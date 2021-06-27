const version = require('../../package.json').version

module.exports = function (app) {
  require('./webhook')(app)

  // index page
  app.get('/', function (req, res) {
    res.render('pages/index', {
      version,
    })
  })

  // uptime
  app.get('/uptime', function (req, res) {
    res.json({ uptime: process.uptime() })
  })

  // 404 page
  app.get('*', function (req, res) {
    res.status(404).render('pages/404', {
      version,
    })
  })
}
