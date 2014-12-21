"use strict";

var dotenv = require('dotenv');
dotenv.load();

// create report object
var report = require('./lib/report');

// use SendGrid nodeJS module
var SendGrid = require('./lib/SendGrid');

// load sendgrid username & password from .env (environment file)
var username = process.env.SENDGRID_USERNAME, 
	password = process.env.SENDGRID_PASSWORD;

// create a Sendgrid object
var SendgridObj = new SendGrid(username, password);

// load http module to create server
var http = require('http');
// specify the server port and other options
var options =  {
					host: 'localhost',
					port: 4000
               };

function app(req, res) {
  	var reportObj = new report();
	var response = SendgridObj.Report ( reportObj.__call('bounces').__call('count'), options );

	res.write('module: ' + reportObj.module + ', action: ' + reportObj.action + ', response: ' + response);
	res.end();
};

var server = http.createServer(app).listen(options.port, function(){

	// server created
	console.log('server running at http://' + options.host + '/ on port ' + server.address().port);
});