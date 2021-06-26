const version = require('../../package.json').version

module.exports = function (app) {

	require('./webhook')(app)

	// index page
	app.get('/', function (req, res) {
		res.render('pages/index', {
			version
		});
	});

	// 404 page
	app.get('*', function (req, res) {
		res.status(404).render('pages/404', {
			version
		});
	});
}