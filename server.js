var express = require('express');
var request = require('request');

var app = express();

var port = process.env.PORT || 3000;

var lowDB = require('lowdb');

var db = lowDB('./db.json', { storage: require('lowdb/lib/storages/file-async')});

app.get('/', function (req, res, next) {
	return res.send('<p>Image Search Abstraction Layer is UP - <b>Vivek Bharatha</b>.</p>' +
		'<p>You can check for imagesearch API at <a href="/api/imagesearch/funny%20human?offset=4" >ImageSearch for funny human</a></p>' + 
		'<p>You can check for latest imagesearch API at <a href="/api/latest/imagesearch" >Latest ImageSearch</a></p>');
});

app.get('/api/imagesearch/:q/:offset?', function (req, res, next) {
	var result = [];
	var q = req.params.q;
	var offset = req.query.offset;

	db.get('latest')
  		.push({ term: q, when: (new Date ()).toISOString()})
  		.write();

	var bingSearchAPI = 'https://api.cognitive.microsoft.com/bing/v5.0/images/search?q=' + q + '&count=10';
	if (offset) {
		bingSearchAPI = bingSearchAPI + '&offset=' + offset;
	}

	request.get({headers: {'Ocp-Apim-Subscription-Key': '0b5de94d0cf6446eb948cd4cdf7bf45f'}, uri: bingSearchAPI}, function (err, response, body) {
		if (err) {
			console.log('Bing request error: ', err);
			return res.json('Bing API token expired');
		}
		body = JSON.parse(body);
		if (body.value) {
			body.value.forEach(function (image) {
				var imageObj = {
					url: image.contentUrl,
					snippet: image.name,
					thumbnail: image.thumbnailUrl,
					context: image.hostPageUrl
				};
				result.push(imageObj);
			});
			return res.json(result);
		} else {
			return res.json({ error: 'Bing API token expired' });
		}
	});

});

app.get('/api/latest/imagesearch', function (req, res, next) {
	var response = [];

	response = db.get('latest')
	.chain()
  		.sortBy('when').reverse()
  		.take(10)
  		.value();
	return res.json(response);
});

app.listen(port, function () {
	console.log('Server up and listening at port: ' + port);
});