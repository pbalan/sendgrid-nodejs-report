"use strict";

var Report = function() {
	var modules = ['spamreports','blocks','bounces','invalidemails','unsubscribes'];
	var actions = ['get','delete','count','add'];
	var parameters = ['date','days','limit','offset','type','email'];
	var parameters_underscored = [{'start_date':'startDate'},{'end_date':'endDate'},{'delete_all':'deleteAll'}];

	var action=null, 
		module=null, 
		format=null,
		result=null;

	this.format = 'json';
	this.action = 'get';


   /**
   	* Setter for actions, modules and parameters.
   	*
   	* There's a lot of meta programming here that makes things look like magic. The setters
   	* for modules, actions and parameters are set from chainable method. So if you link spamreports(),
   	* and delete() to the method chain in the object you are setting the module as 'spamreports' and
   	* the action as "delete".
   	*
   	* For parameters, the method argument will pass through as the variable's value. For instance,
   	* startDate('2014-01-01') will set $this->start_date to '2014-01-01'.
   	*
   	* Example:
   	* 
   	* $report->spamreports()->date()->days(1)->startDate('2014-01-01')->email('foo@bar.com');
   	*
   	* Sets the following:
   	* $this->module = 'spamreports';
   	* $this->action = 'get'; //default
   	* $this->date = 1;
   	* $this->days = 1;
   	* $this->start_date = '2014-01-01';
   	* $this->email = 'foo@bar.com';
   	* 
   	* 
   	* @param  string $method Any of the method in $this->modules
   	* @param  string $args
   	* @return this
   	*/
	this.__call = function (method, args){

		// set action (defaults to get)
		if(actions.indexOf(method) > -1)
		{
			this.action = method;
		}

		// set module
		if(modules.indexOf(method) > -1)
		{
			this.module = method;
		}

		// set parameter    	
    	this.parameters = this.__getArrayValues(parameters, parameters_underscored);
    	
    	if(parameters.indexOf(method) > -1)
    	{
    		method = this.__addUnderscore(method);
    		if(args !== undefined)
    		{
    			args = args.shift();
    		}
    		if(args===undefined)
    		{
    			args = 1;
    		}
    		this.method = args;
    	}

    	return this;
	};

	/**
   	 * Defines URL for SendGrid Web API
   	 * @param  string url Overrides base URL in case endpoint changes in the future.
   	 * @return string fully formed url 
   	 */
  	this.getUrl = function(url){

    	if(url===undefined)
    	{
    		url = 'https://api.sendgrid.com/api/' + this.module + '.' + this.action + '.' + this.format;
    	}

    	return url;
  	}



	/**	
	 *	Convert back from camelCase to underscored method name
	 *	@param 	string method as camelCase
	 *	@param 	string method as underscored
	 */
	this.__addUnderscore = function(method){

		if(this.__get2DArrayValues(parameters_underscored).indexOf(method) > -1)
		{
			// Determine the method key to replace
			var replaceThis = this.__get2DArrayValues(parameters_underscored).indexOf(method);
			// fetch the value to replace with
			var replaceWith = this.__get2DArrayKeys(parameters_underscored)[replaceThis];
			// replace
			method = method.replace(method, replaceWith);
		}

		return method;
	};

	/**
   	 * Creates API valid array from list of parameters
   	 *
   	 * This is based on a similar function found in the official SendGrid lib:
   	 * https://github.com/sendgrid/sendgrid-php/blob/master/lib/SendGrid/Email.php
   	 * 
   	 * return array
   	 */
  	this.toWebFormat = function() {
    	var web = new Array();

    	this.parameters = this.__getArrayValues(parameters, parameters_underscored);
    	
    	parameters.forEach(function(values){
		    var value = parameters[values];
		   	web.push(value);
    	});

    	return web;
  	};

  	/**
  	 *	Get all the parameters
  	 */
  	this.__getArrayValues = function(param, param_underscored){

		var underscored_keys = Object.keys(param_underscored);
    	underscored_keys.forEach(function(values){
    		var items = Object.keys(param_underscored[values]);
		  	items.forEach(function(item) {
		    	var value = param_underscored[values][item];
		    	param.push(value);
		  	});
    	});
    	
    	return param;
	};

	/**
	 *	Get all the arrays keys
	 *	@param 	array param_underscored 2D 
	 *	@return array
	 */
	this.__get2DArrayKeys = function(param_underscored){
		var param = new Array();
		var underscored_keys = Object.keys(param_underscored);
    	underscored_keys.forEach(function(values){
    		var items = Object.keys(param_underscored[values]);
		  	items.forEach(function(item) {
		    	var value = param_underscored[values][item];
		    	param.push(item);
		  	});
    	});
    	
    	return param;
	};

	/**
	 *	Get all the arrays values
	 *	@param 2D array param_underscored 
	 *	@return array
	 */
	this.__get2DArrayValues = function(param_underscored){
		var param = new Array();
		var underscored_keys = Object.keys(param_underscored);
    	underscored_keys.forEach(function(values){
    		var items = Object.keys(param_underscored[values]);
		  	items.forEach(function(item) {
		    	var value = param_underscored[values][item];
		    	param.push(value);
		  	});
    	});
    	
    	return param;
	};

	this.exit = function()
	{
		return false;
	};

};

module.exports = Report;