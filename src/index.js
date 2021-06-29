const startServer = require('./start')

startServer()

require('./scan')

if (process.env.NODE_ENV === 'development') {
  require('./tests')
}
