const { Pool } = require('pg')

const createTables = require('./create')

let pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

module.exports.start = async () => {
  try {
    connect()
  } catch (error) {
    try {
      connect(true)
    } catch (error) {
      console.error('Database connection error')
      throw error
    }
  } finally {
    console.log('📡 Connected to database')
    createTables(pool)
  }
}

async function connect(shouldUseSSL = false) {
  if (shouldUseSSL) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    })
  }
  await pool.connect()
}

/*
Webhooks table
*/

module.exports.newWebhook = async ({ project_id, payload_url, config }) => {
  try {
    await pool.query(
      'INSERT INTO webhooks (project_id, payload_url, config) VALUES ($1, $2, $3)',
      [project_id, payload_url, JSON.stringify(config)]
    )
  } catch (error) {
    throw error
  }
}

module.exports.getWebhookByRow = async ({ row_id }) => {
  try {
    return ( await pool.query('SELECT * FROM webhooks WHERE id = $1', [row_id]) ).rows[0]
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
    return ( await pool.query('SELECT * FROM webhooks WHERE payload_url = $1', [payload_url]) ).rows
  } catch (error) {
    throw error
  }
}

module.exports.getWebhooksByProject = async (project_id) => {
  try {
    return ( await pool.query('SELECT * FROM webhooks WHERE project_id = $1', [project_id]) ).rows
  } catch (error) {
    throw error
  }
}

module.exports.webhookRecordFailByRow = async (row_id) => {
  try {
    await pool.query('UPDATE webhooks SET failed_attempts = failed_attempts + 1 WHERE id = $1', [ row_id ])

    const row = ( await module.exports.getWebhookByRow(row_id) )

    if (row.failed_attempts >= 3) {
      module.exports.removeWebhooksByUrl(row.payload_url)
    }
  } catch (error) {
    throw error
  }
}

module.exports.removeWebhooksByUrl = async (payload_url) => {
  try {
    const webhooks = await module.exports.getWebhooksByURL(payload_url)

    await Promise.all(webhooks.map(async (webhook) => {
      const project_webhooks = await module.exports.getWebhooksByProject(webhook.project_id)
      if (project_webhooks[0].payload_url === webhook.payload_url) {
        await module.exports.removeProjectById(webhook.project_id)
      }
    }));

    await pool.query('DELETE FROM webhooks WHERE payload_url = $1', [ payload_url ])
  } catch (error) {
    throw error
  }
}

/*
Projects table
*/

module.exports.newProject = async ({ project_id, last_updated, last_version_id }) => {
  try {
    await pool.query(
      'INSERT INTO projects (project_id, last_updated, last_version_id) VALUES ($1, $2, $3)',
      [project_id, last_updated, last_version_id]
    )
  } catch (error) {
    throw error
  }
}

module.exports.getProjectById = async (project_id) => {
  try {
    return ( await pool.query('SELECT * FROM projects WHERE project_id = $1', [project_id]) ).rows[0]
  } catch (error) {
    throw error
  }
}

module.exports.existingProjectById = async (project_id) => {
  try {
    const rows = ( await pool.query('SELECT * FROM projects WHERE project_id = $1', [project_id]) ).rows
    
    if (rows.length > 0) {
      return true
    } else {
      return false
    }
  } catch (error) {
    throw error
  }
}

module.exports.removeProjectById = async (project_id) => {
  try {
    await pool.query('DELETE FROM projects WHERE project_id = $1', [ project_id ])
  } catch (error) {
    throw error
  }
}

/*
Queue table
*/

module.exports.getQueue = async () => {
  try {
    return ( await pool.query('SELECT * FROM queue', [project_id]) ).rows
  } catch (error) {
    throw error
  }
}

module.exports.newQueueItem = async ({ project_id, data, webhooks, version_date }) => {
  try {
    await pool.query('INSERT INTO projects (project_id, data, webhooks, version_date) VALUES ($1, $2, $3, $4)', [ project_id, data, webhooks, version_date ])
  } catch (error) {
    throw error
  }
}

module.exports.removeQueueItemByRow = async (row_id) => {
  try {
    await pool.query('DELETE FROM queue WHERE id = $1', [ row_id ])
  } catch (error) {
    throw error
  }
}