if (!process.env.PORT) {
  process.env.PORT = process.env.NODE_ENV === 'development' ? 8080 : 5000
}

if (process.env.NODE_ENV === 'development') {
  process.env.DATABASE_URL = 'postgres://user:password@localhost:5432/db'
  process.env.DOMAIN = 'localhost:' + process.env.PORT
}

require('./src')