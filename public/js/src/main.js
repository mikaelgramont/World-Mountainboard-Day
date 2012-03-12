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
	'../src/app/pubsub',
	'../src/app/session',
	'../src/app/rider',
	'../src/app/temp',
	
	// i18n
	'i18n!nls/lang'
	
	
], function($, _, Backbone, mustache, register, pubsub, sessionModule, riderModule, tempModule, i18n){
	var preventDefaultActions = function(e, type) {
		// makes sure we don't follow links and form submissions
		if(e.type !== type) {
			return;
		}

		var t = e.target;
		var detailedDebug = 0;
		
		if(register.isDebug() && detailedDebug) {
			console.log('main - ' + type +' event on', t);
		}		
		
		//TODO: allow external links to be opened
		if(type == 'click' && t.tagName == 'A'||
		   type == 'submit' && t.tagName == 'FORM') {
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

			register.setPubsub(new pubsub);

			register.setApiSessionId(config.sessionData.sessionId);
			register.setApiSessionKey(config.sessionData.apiSessionKey);
			register.setApiUrl(config.apiUrl);
			register.setDebug(config.sessionData.debug);
			register.setLang(config.sessionData.lang);
			register.setI18n(i18n);
			register.setRider(new riderModule.model(config.sessionData.rider));
			
			var session = new sessionModule.model();
			if(register.isDebug()) {
				window.session = session;
				window.register = register;
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