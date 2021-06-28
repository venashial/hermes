module.exports = function (app) {

	app.post('/api/webhook', function (req, res) {
		console.log(req.body)
		res.sendStatus(200)
	});

	app.delete('/api/webhook', function (req, res) {
		res.sendStatus(200)
	});

}