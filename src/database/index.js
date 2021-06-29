const knex = require('./knex')

module.exports.delete = async () => {
  try {
    await knex('projects').del()
    await knex('webhooks').del()
    await knex('queue').del()
  } catch (error) {
    throw error
  }
}

/*
Projects table
*/

module.exports.newProject = async ({
  project_id,
  last_updated,
  last_version_id,
}) => {
  try {
    await knex('projects').insert({ project_id, last_updated, last_version_id })
  } catch (error) {
    throw error
  }
}

module.exports.getProjectById = async (project_id) => {
  try {
    return (await knex('projects').where({ project_id }))[0]
  } catch (error) {
    throw error
  }
}

module.exports.getAllProjects = async () => {
  try {
    return (await knex('projects'))
  } catch (error) {
    throw error
  }
}

module.exports.existingProjectById = async (project_id) => {
  try {
    const rows = (await knex('projects').where({ project_id }))

    if (rows.length > 0) {
      return true
    } else {
      return false
    }
  } catch (error) {
    throw error
  }
}

module.exports.updateProjectById = async (
  project_id,
  { last_updated, last_version_id }
) => {
  try {
    await knex('projects').where({ project_id }).update({ last_updated, last_version_id })
  } catch (error) {
    throw error
  }
}

module.exports.removeProjectById = async (project_id) => {
  try {
    await knex('projects').where({ project_id }).del()
  } catch (error) {
    throw error
  }
}

/*
Webhooks table
*/

module.exports.newWebhook = async ({
  project_id,
  payload_url,
  content_type,
  config,
}) => {
  try {
    await knex('webhooks').insert({ project_id, payload_url, content_type, config: JSON.stringify(config) })
  } catch (error) {
    throw error
  }
}

module.exports.getWebhookByRow = async (id) => {
  try {
    return (await knex('webhooks').where({ id }))[0]
  } catch (error) {
    throw error
  }
}

module.exports.existingWebhookByURL = async (payload_url) => {
  try {
    const rows = await module.exports.getWebhooksByURL(payload_url)

    if (rows.length > 0) {
      return true
    } else {
      return false
    }
  } catch (error) {
    throw error
  }
}

module.exports.getWebhooksByURL = async (payload_url) => {
  try {
    return (await knex('webhooks').where({ payload_url }))
  } catch (error) {
    throw error
  }
}

module.exports.getWebhooksByProject = async (project_id) => {
  try {
    return (await knex('webhooks').where({ project_id }))
  } catch (error) {
    throw error
  }
}

module.exports.webhookRecordFailByRow = async (id) => {
  try {
    await knex('webhooks').where({ id }).update({ failed_attempts: knex.raw('failed_attempts + 1') })

    const row = await module.exports.getWebhookByRow(id)

    if (row.failed_attempts >= 3) {
      console.log('[SEND FAIL] 💥 Removed webhook(s)')
      module.exports.removeWebhooksByUrl(row.payload_url)
    }
  } catch (error) {
    throw error
  }
}

module.exports.removeWebhooksByUrl = async (payload_url) => {
  try {
    const webhooks = await module.exports.getWebhooksByURL(payload_url)

    await Promise.all(
      webhooks.map(async (webhook) => {
        const project_webhooks = await module.exports.getWebhooksByProject(
          webhook.project_id
        )
        if (project_webhooks[0].payload_url === webhook.payload_url) {
          await module.exports.removeProjectById(webhook.project_id)
        }
      })
    )

    await knex('webhooks').where({ payload_url }).del()
  } catch (error) {
    throw error
  }
}

module.exports.removeWebhooksByProject = async (project_id) => {
  try {
    await knex('webhooks').where({ project_id }).del()
  } catch (error) {
    throw error
  }
}

/*
Queue table
*/

module.exports.getQueue = async () => {
  try {
    return (await knex('queue').orderBy('version_date', 'asc'))
  } catch (error) {
    throw error
  }
}

module.exports.newQueueItem = async ({
  project_id,
  data,
  webhooks,
  version_date,
}) => {
  try {
    await knex('queue').insert({ project_id, data, webhooks, version_date: new Date(version_date).valueOf() })
  } catch (error) {
    throw error
  }
}

module.exports.removeQueueItemByRow = async (id) => {
  try {
    await knex('queue').where({ id }).del()
  } catch (error) {
    throw error
  }
}
