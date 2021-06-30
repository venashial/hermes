const validate = require('jsonschema').validate

const db = require('../database')

const modrinth = require('../modrinth')

const postSchema = {
  type: 'object',
  properties: {
    payload_url: { type: 'string' },
    content_type: { type: 'string' },
    project_ids: {
      type: 'array',
      items: { type: 'string' },
      uniqueItems: true,
    },
    config: {
      type: 'object',
      properties: {
        filter: {
          type: 'object',
          properties: {
            version_type: {
              type: 'array',
              items: { type: 'string' },
            },
            version_type: {
              type: 'array',
              items: { type: 'string' },
            },
          },
        },
        hiddenItems: {
          type: 'array',
          items: { type: 'string' },
          uniqueItems: true,
        },
      },
    },
  },
  required: ['payload_url', 'content_type', 'project_ids', 'config'],
}

const deleteSchema = {
  type: 'object',
  properties: {
    payload_url: { type: 'string' },
  },
  required: ['payload_url'],
}

module.exports = function (app) {
  app.post('/api/webhook', async function (req, res) {
    const webhook = req.body

    const validationResult = validate(webhook, postSchema)
    if (!validationResult.valid) {
      res
        .status(400)
        .send(`Missing information, ${validationResult.errors[0].message}.`)
      return
    }
    if (!validURL(webhook.payload_url)) {
      res.status(400).send('Invalid payload URL.')
      return
    }
    if (!['discord', 'json'].includes(webhook.content_type)) {
      res.status(400).send('Invalid content_type.')
      return
    }
    if (webhook.project_ids.length == 0) {
      res.status(400).send('Missing project IDs.')
      return
    }
    if (await db.existingWebhookByURL(webhook.payload_url)) {
      res
        .status(400)
        .send(
          'That payload URL is already added. To change it, you must delete it and add it again.'
        )
        return
    }
    
    let vetted_projects = []

    for (const project_id of webhook.project_ids) {
      if (await db.existingProjectById(project_id)) {
        vetted_projects.push({ modrinthProject: {}, project_id })
      } else {
          const modrinthProject = await modrinth.getProject(project_id)
          if (modrinthProject && modrinthProject.id === project_id) {
            vetted_projects.push({ modrinthProject, project_id })
          } else {
            res.status(400).send(`Couldn't find a Modrinth project with the ID ${project_id}.`)
            return
          }
      }
    }

    for (vetted_project of vetted_projects) {
      let { project_id, modrinthProject } = vetted_project

      if (modrinthProject.id) {
        // New project
        const modrinthVersions = await modrinth.getVersions(project_id)

        await db.newProject({ project_id, last_updated: modrinthProject.updated, last_version_id: modrinthVersions[0].id })
      }

      await db.newWebhook({ project_id, payload_url: webhook.payload_url, content_type: webhook.content_type, config: webhook.config })
    }

    res.status(200).send('Successfully added webhook: ' + webhook.payload_url)

    console.log('[USER] 🪝  Added new webhook')
  })

  app.delete('/api/webhook', async function (req, res) {
    const webhook = req.body

    const validationResult = validate(webhook, deleteSchema)
    if (!validationResult.valid) {
      res
        .status(400)
        .send(`Missing information, ${validationResult.errors[0].message}.`)
      return
    }
    if (!validURL(webhook.payload_url)) {
      res.status(400).send('Invalid payload URL.')
      return
    }

    if (await db.existingWebhookByURL(webhook.payload_url)) {
      await db.removeWebhooksByUrl(webhook.payload_url)

      res.status(200).send('Successfully removed webhook: ' + webhook.payload_url)
  
      console.log('[USER] 💥 Removed webhook')
    } else {
      res.status(400).send('That webhook doesn\'t exist yet or already was removed.')
    }
  })
}

function validURL(str) {
  var pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ) // fragment locator
  return !!pattern.test(str)
}
