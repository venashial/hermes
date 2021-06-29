const cron = require('node-cron')

const db = require('../database')

const modrinth = require('../modrinth')

const webhooks = require('../webhooks')

module.exports.start = async () => {
  // Get project ids from database
  const databaseProjects = await db.getAllProjects()

  if (databaseProjects.length == 0) {
    return
  }

  // Get them on modrinth
  const { modrinthProjects, missingProjects } = await modrinth.getProjects(
    databaseProjects.map((project) => project.project_id)
  )

  // Remove missing (deleted) projects
  if (missingProjects.length > 0) {
    await Promise.all(
      missingProjects.map(async (project_id) => {
        await db.removeWebhooksByProject(project_id)
        await db.removeProjectById(project_id)
      })
    )
  }
  if (modrinthProjects.length == 0) {
    return
  }

  // Check for different updated timestamp
  await Promise.all(
    modrinthProjects.map(async (modrinthProject) => {
      const databaseProject = databaseProjects.filter(
        (databaseProject) => databaseProject.project_id === modrinthProject.id
      )[0]

      // Filter updated projects
      if (
        new Date(modrinthProject.updated) >
        new Date(databaseProject.last_updated)
      ) {
        console.log('[SCAN] 🔍 Found new version(s)')

        const modrinthVersions = (await modrinth.getVersions(modrinthProject.id)).reverse()
        if (modrinthVersions) {
          // Find ID of last seen version
          let indexOfLastVersion = modrinthVersions
            .map((versions) => versions.id)
            .indexOf(databaseProject.last_version_id)

          if (indexOfLastVersion == -1) {
            indexOfLastVersion = modrinthVersions
              .map((versions) => versions.date_published)
              .filter(
                (date_published) =>
                  (new Date(date_published) >
                    new Date(databaseProject.last_updated))[0]
              )
          }

          // Get new versions
          const newModrinthVersions = modrinthVersions
            .splice(indexOfLastVersion + 1)

          // Add each version to queue
          await Promise.all(
            newModrinthVersions.map(async (modrinthVersion) => {
              await db.newQueueItem({
                project_id: modrinthProject.id,
                data: await modrinth.formatData({
                  modrinthProject,
                  modrinthVersion,
                }),
                webhooks: JSON.stringify(
                  (
                    await db.getWebhooksByProject(modrinthProject.id)
                  ).map((webhook) => webhook.id)
                ),
                version_date: modrinthVersion.date_published,
              })
            })
          )

          console.log(
            `[SCAN] 📨 Added ${newModrinthVersions.length} new version${
              newModrinthVersions.length > 1 ? 's' : ''
            }`
          )

          // Update project in DB
          await db.updateProjectById(modrinthProject.id, {
            last_updated: modrinthProject.updated,
            last_version_id: newModrinthVersions[newModrinthVersions.length - 1].id,
          })
        }
      }
    })
  )

  await module.exports.openQueue()
}

if (process.env.NODE_ENV === 'development') {
  cron.schedule('0 * * * * *', () => {
    console.log('[SCAN] 💿 Starting scan')
    module.exports.start()
  })
} else {
  cron.schedule(
    '0,30 * * * *',
    () => {
      console.log('[SCAN] 💿 Starting scan')
      module.exports.start()
    }
  )
}

module.exports.openQueue = async () => {
  // Get all webhooks in queue
  const queue = await db.getQueue()

  if (queue.length > 0) {
    console.log('[QUEUE] 📬 Opening queue')

    for (const queueItem of queue) {
      const webhook_rows = JSON.parse(queueItem.webhooks)
      await webhook_rows.map(async (row) => {
        const webhook = await db.getWebhookByRow(row)

        const config = JSON.parse(webhook.config)

        // Send webhook
        const data = webhooks.applyRowConfig(JSON.parse(queueItem.data), config)
        await webhooks.send(webhook.payload_url, data, webhook.content_type, config)

        // Delete webhook in queue
        await db.removeQueueItemByRow(queueItem.id)
      })

      await new Promise(r => setTimeout(r, 1000));
    }

    console.log('[QUEUE] 📭 Finished sending webhooks')
  }
}
