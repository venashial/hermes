module.exports = async (pool) => {
  const tableQueries = [
    `CREATE TABLE IF NOT EXISTS projects (
      id                serial        PRIMARY KEY,
      project_id        character(8)  NOT NULL UNIQUE,
      last_updated      timestamp     NOT NULL,
      last_version_id   character(8)  NOT NULL)`,

    `CREATE TABLE IF NOT EXISTS webhooks (
        id              serial        PRIMARY KEY,
        project_id      character(8)  NOT NULL,
        payload_url     varchar(2048) NOT NULL,
        failed_attempts integer       DEFAULT 0,
        config          json          DEFAULT '{}'::json)`,

    `CREATE TABLE IF NOT EXISTS queue (
          id            serial        PRIMARY KEY,
          project_id    character(8)  NOT NULL,
          data          json          NOT NULL,
          webhooks      text[]        NOT NULL,
          version_date  timestamp     NOT NULL)`,
  ]

  let successes = 0

  tableQueries.forEach(async (query) => {
    try {
      await pool.query(query)
      successes++

      if (successes == tableQueries.length) {
        // console.log('Created or found all tables')
      }
    } catch (error) {
      throw error
    }
  })
}
