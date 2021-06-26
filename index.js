const express = require('express');
const app = express();

app.use(express.static('static'))

// set the view engine to ejs
app.set('view engine', 'ejs');

// index page
const version = require('./package.json').version
app.get('/', function (req, res) {
	res.render('pages/index', {
		version
	});
});

// 404 page
app.get('*', function (req, res) {
	res.render('pages/404', {
		version
	});
});

const port = process.env.NODE_ENV === 'development' ? 8080 : 80
app.listen(port);
console.log(`Server is listening on port ${port}`);