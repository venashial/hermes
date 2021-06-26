const express = require('express')
const path = require('path')

require('express-async-errors')

module.exports = function startServer() {
  const app = express()

  app.use(express.static(path.join(__dirname, '../static')))

  require('./routes')(app)

  app.use(errorMiddleware)

  app.set('view engine', 'ejs')

  const port =
    process.env.PORT || (process.env.NODE_ENV === 'development' ? 8080 : 5000)

  return new Promise((resolve) => {
    const server = app.listen(port, () => {
      console.log(`Listening on port ${server.address().port}`)

      const originalClose = server.close.bind(server)

      server.close = () => {
        return new Promise((resolveClose) => {
          originalClose(resolveClose)
        })
      }

      setupCloseOnExit(server)

      resolve(server)
    })
  })
}

function errorMiddleware(error, req, res, next) {
  if (res.headersSent) {
    next(error)
  } else {
    console.error(error)

    res.status(500)
    res.json({
      message: error.message,
      ...(process.env.NODE_ENV === 'production'
        ? null
        : { stack: error.stack }),
    })
  }
}


function setupCloseOnExit(server) {
  async function exitHandler(options = {}) {
    await server
      .close()
      .then(() => {
        console.info('Server successfully closed')
      })

      .catch((e) => {
        console.warn('Something went wrong closing the server', e.stack)
      })
    if (options.exit) process.exit()
  }

  process.on('exit', exitHandler)
  process.on('SIGINT', exitHandler.bind(null, { exit: true }))
  process.on('SIGUSR1', exitHandler.bind(null, { exit: true }))
  process.on('SIGUSR2', exitHandler.bind(null, { exit: true }))
  process.on('uncaughtException', exitHandler.bind(null, { exit: true }))
}