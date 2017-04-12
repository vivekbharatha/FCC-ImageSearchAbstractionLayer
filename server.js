var express = require('express');

var app = express();

var port = process.env.PORT || 3000;

app.get('/', function (req, res, next) {
	return res.send('<p>Image Search Abstraction Layer is UP - <b>Vivek Bharatha</b>.</p>' +
		'<p>You can check for imagesearch API at <a href="/api/imagesearch" >ImageSearch</a></p>' + 
		'<p>You can check for latest imagesearch API at <a href="/api/latest/imagesearch" >Latest ImageSearch</a></p>');
});

app.get('/api/imagesearch', function (req, res, next) {
	var response = [];

	return res.json(response);
});

app.get('/api/latest/imagesearch', function (req, res, next) {
	var response = [];

	return res.json(response);
});

app.listen(port, function () {
	console.log('Server up and listening at port: ' + port);
});