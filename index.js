var express = require('express'),
	async = require('async'),
	path = require('path'),
	app = express();


//app.get('/', function(req, res){
//	res.send('hello world the server running ');
//});

async.parallel([
	function(cb) {
		var server = require(path.join(__dirname,'nathanbroslawsky/server.js'));
		server(function(broadway) {
			app.use(express.vhost('nathanbroslawsky.com',broadway.express));
			app.use(express.vhost('www.nathanbroslawsky.com',broadway.express));
			cb();
		});
	},
	function(cb) {
		var server = require(path.join(__dirname,'nathanbroslawsky/redirect.js'));
		server('http://www.nathanbroslawsky.com/blog',3002,function(a) {
			app.use(express.vhost('blog.nsfive.com',a))
			cb();
		});
	},
	function(cb) {
		var server = require(path.join(__dirname,'nathanbroslawsky/redirect.js'));
		server('http://www.nathanbroslawsky.com',3003,function(a) {
			app.use(express.vhost('nsfive.com',a));
			app.use(express.vhost('*.nsfive.com',a));
			cb();
		});
	}
],

function() {
	app.listen(80);
	console.log('listening on port 80');
});

