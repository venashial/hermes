if (!process.env.PORT) {
  process.env.PORT = process.env.NODE_ENV === 'development' ? 8080 : 8060
  console.log('[ENV] 🚢 Using port ' + process.env.PORT)
}

if (process.env.NODE_ENV === 'development') {
  process.env.DOMAIN = 'localhost:' + process.env.PORT
}

require('./src')