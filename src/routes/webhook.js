module.exports = function (app) {

	app.post('/webhook', function (req, res) {
		console.log(req.data)
		res.sendStatus(200)
	});

	app.delete('/webhook', function (req, res) {
		res.sendStatus(200)
	});

}