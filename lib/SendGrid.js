"use strict";

var request = require('request');
var package_json = require('./../package.json');
var report = require('./report');
var Sendgrid = require('Sendgrid');

/**
 * Formats report results and sends them to Web Api via Request
 * @param  Report report Instance of Report
 * @return array         Result sent by SendGrid
 */
Sendgrid.prototype.Report = function(reportObj) {

   var form = {};

   form['api_user'] = this.api_user;
   form['api_key'] = this.api_key;
   
   /**
    * Create a post request
    * Uri: https://api.sendgrid.com/api/report{module}.report{action}.report{format}
    * 
    */
   request.post({url : reportObj.getUrl(), form: form}, function optionalCallback(err, httpResponse, body) {
      if (err) {
         return console.error('request failed:', err);
      }

      return JSON.parse(body);
   });

   return ;   
};

module.exports = Sendgrid;