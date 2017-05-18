var express = require('express')
var app = express();
var exec = require('child_process').exec;
var request = require('request');
var cheerio = require("cheerio");
var fs = require('fs');
var bodyParser = require('body-parser');

app.use(express.static(__dirname));

//Something so we can post data
app.use(bodyParser.urlencoded({
    extended: true
}));



app.post('/', function(req, res){

request = request.defaults({jar: true});
	var options = {
	    url: 'http://www.google.com',
	    headers: {
	        'User-Agent': 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.6; rv:1.9.2.16) Gecko/20110319 Firefox/3.6.16'
	    }
	};

	request(options, function () {

    var number = req.body.pages;

	    request('https://www.google.com/search?q=site:' + req.body.domain + '&num=100&start=1', function (error, response, body) {

	        var $ = cheerio.load(body);
	        var stream = fs.createWriteStream("my_file.txt");

	        $("h3").each(function() {
	            var link = $(this);
	            // get the links
	            var text = link.find('a').attr('href');
	            //prettyfy them
	            var s = text.split("/url?q=")[1];
	            var l = s.substring(0, s.lastIndexOf("&sa=") + 0);
	            var lb = l + "\n"
	            stream.write(lb);

	            console.log(lb);
	        });
	    });
	});


	res.sendFile(__dirname + '/done.html');

});


//Send traffic to the form
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/index.html');

});



app.post('/concat' , function(req , res){
    console.log('this was called');
    exec('gulp concat');
    res.send('success!');

});

app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
