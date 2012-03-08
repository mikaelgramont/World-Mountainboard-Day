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
	'../src/app/register',
	'../src/app/session',
	'../src/app/rider',
	'../src/app/temp',
	
	
], function($, _, Backbone, mustache, register, sessionModule, riderModule, tempModule){
	var AppView = Backbone.View.extend({
		initialize: function(config) {
			if(appConfig.sessionData.debug) {
				console.log('main - initialize', appConfig);
			}

			register.setApiSessionId(config.sessionData.sessionId);
			register.setApiUrl(config.apiUrl);
			register.setDebug(config.sessionData.debug);
			register.setLang(config.sessionData.lang);
			register.setRider(new riderModule.model(config.sessionData.rider));
			
			var session = new sessionModule.model();
			if(register.isDebug()) {
				window.session = session;
			}
			
			var tempView = new tempModule.views.temp(new riderModule.collection());
		},
		
		el: $('#app'),

		events: {
			'click': function(e){
				if(register.isDebug()) {
					console.log('main - click on', e.originalEvent.originalTarget);
				}
				
				e.preventDefault();
				e.stopPropagation();
			}
		}
	});
	
	var appView = new AppView(appConfig);
});