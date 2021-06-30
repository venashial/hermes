const development = {
  client: 'sqlite3',
  connection: {
    filename: './dev.sqlite3',
  },
  useNullAsDefault: true,
}

const production = {
  client: 'pg',
  connection: process.env.DATABASE_URL,
  ssl: process.env.USE_DATABASE_SSL
    ? JSON.parse(process.env.USE_DATABASE_SSL)
    : false,
  pool: {
    min: 2,
    max: 10,
    afterCreate: function (conn, done) {
      // in this example we use pg driver's connection API
      conn.query('SET timezone="UTC";', function (err) {
        if (err) {
          // first query failed, return error and don't try to make next query
          console.log('[STARTUP] 🚫 Couldn\'t connect to database')
          done(err, conn)
          process.exit(1)
        } else {
          conn.query('SELECT * FROM pg_stat_activity;', function (err) {
            console.log('[STARTUP] 📡 Connected to database')
            done(err, conn)
          })
        }
      })
    },
  },
  migrations: {
    tableName: 'knex_migrations',
  },
}

module.exports = {
  development,
  production,
}
