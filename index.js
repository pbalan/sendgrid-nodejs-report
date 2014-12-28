"use strict";

var dotenv = require('dotenv');
dotenv.load();

// use report module
var report = require('./lib/report');

// use SendGrid nodeJS module
var SendGrid = require('./lib/SendGrid');

// load sendgrid username & password from .env (environment file)
var username = process.env.SENDGRID_USERNAME, 
	password = process.env.SENDGRID_PASSWORD;

// create a Sendgrid object
var SendgridObj = new SendGrid(username, password);

// load http module to create server
var restify = require('restify');
// specify the server port and other options
var options =  {
					host: 'localhost',
					port: 4000
               };

function app(req, res) {

	res.write('module: ' + reportObj.module + ', action: ' + reportObj.action);
	res.end();
};

var server = restify.createServer(app);

server
  .use(restify.fullResponse())
  .use(restify.bodyParser());

server.listen(options.port, function(request, response){

	// server created
	console.log('server running at http://' + options.host + '/ on port ' + server.address().port);
});

server.get('/module/:module', function (req, res, next) {
  // create report module
  if(req.params.module===undefined)
  {
  	res.send('module is required');
  }
})

server.get('/module/:module/action/:action', function (req, res, next) {
  // create report module
  var reportObj = new report();
  if(req.params.action===undefined)
  {
  	res.send('action is required');
  }
  SendgridObj.Report ( reportObj.__call(req.params.module).__call(req.params.action), function (error, response){
  	res.send(JSON.stringify(response));
  })
});

server.get('/module/:module/action/:action/method/:methods', function (req, res, next) {
  // create report module
  var reportObj = new report();
  
  SendgridObj.Report ( reportObj.__call(req.params.module).__call(req.params.action), function (error, response){
  	res.send(JSON.stringify(response));
  })
});

server.on('data',app);