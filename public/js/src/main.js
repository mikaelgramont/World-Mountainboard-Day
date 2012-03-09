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
	var preventDefaultActions = function(e, type) {
		// makes sure we don't follow links and form submissions
		if(e.type !== type) {
			return;
		}

		var t = e.originalEvent.originalTarget;
		var detailedDebug = 0;
		
		if(register.isDebug() && detailedDebug) {
			console.log('main - ' + type +' event on', t);
		}		
		
		//TODO: allow external links to be opened
		if(type == 'click' && 'A' == t.tagName ||
		   type == 'submit' && 'FORM' == t.tagName) {
			if(register.isDebug() && detailedDebug) {
				console.log('main - stopping ' + type +' event');
			}
			e.preventDefault();
			e.stopPropagation();
		}
	};
	
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
			'click': function(e) {
				preventDefaultActions(e, 'click');
			},
			
			'submit': function(e) {
				preventDefaultActions(e, 'submit');
			}
			
		}
	});
	
	var appView = new AppView(appConfig);
});