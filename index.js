if (!process.env.PORT) {
  process.env.PORT = process.env.NODE_ENV === 'development' ? 8080 : 8060
}

if (process.env.NODE_ENV === 'development') {
  process.env.DOMAIN = 'localhost:' + process.env.PORT
}

require('./src')