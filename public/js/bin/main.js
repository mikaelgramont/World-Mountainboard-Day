/******************************************************************************
 * js/src/main.js
 * 
 * Point of entry into the application
 *****************************************************************************/
require([
    // Libraries
	'order!jquery',
	'underscore',
	'backbone',
	'mustache-wrapper',

	// Application modules
	'../src/app/session'
	
], function($, _, Backbone, mustache, sessionModule){
	var session = new sessionModule.model(appConfig);
});