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
	
	// Templates
	'text!templates/layout/nav-primary.tpl',
	'text!templates/layout/nav-secondary.tpl',
	
	
], function($, _, Backbone, mustache, register, pubsub, sessionModule, riderModule, tempModule, navPrimaryTpl, navSecondaryTpl){
	var preventDefaultActions = function(e, type) {
		// makes sure we don't follow links and form submissions
		if(e.type !== type) {
			return;
		}

		var t = e.target;
		var detailedDebug = 1;
		
		//TODO: allow external links to be opened
		if(type == 'click' && t.tagName == 'A'||
		   type == 'submit' && t.tagName == 'FORM') {
			if(register.isDebug() && detailedDebug) {
				console.log('main - stopping ' + type +' event on', t);
			}
			e.preventDefault();
			e.stopPropagation();
			return;
		}

		if(register.isDebug() && detailedDebug) {
			console.log('main - ' + type +' event on', t);
		}		
	};
	
	// This view manages the content of the document
	var MainView = Backbone.View.extend({
		section: null,
		aside: null,
		
		el: $('#main'),
		
		initialize: function(){
			if(register.isDebug()) {
				console.log('main - mainView - initialize', appConfig);
			}
		},
	
		render: function(){
		}
	});
	
	var NavPrimaryView = Backbone.View.extend({
		el: $('#nav-primary'),
		
		template: mustache.compile(navPrimaryTpl),
		
		initialize: function (){
			if(register.isDebug()) {
				console.log('main - NavPrimaryView - initialize');
			}
			register.getPubsub().subscribe('register.lang.ready', _.bind(this.render, this));
		},
		
		render: function (){
			$(this.el).html(this.template(this.getDataForRender()));
			return this.el;
		},
		
		getDataForRender: function() {
			return register.decorateForMustache({
				i18n: register.getI18n()
			});
		}
		
		// No close method because this view is always there
	});

	var NavSecondaryView = Backbone.View.extend({
		el: $('#nav-secondary'),
		
		template: mustache.compile(navSecondaryTpl),
		
		initialize: function (){
			if(register.isDebug()) {
				console.log('main - NavSecondaryView - initialize');
			}
			register.getPubsub().subscribe('register.lang.ready', _.bind(this.render, this));
		},
		
		render: function (){
			$(this.el).html(this.template(this.getDataForRender()));
			return this.el;
		},
		
		getDataForRender: function() {
			return register.decorateForMustache({
				i18n: register.getI18n()
			});
		}
		
		// No close method because this view is always there
	});
	
	
	// This view is the main entry point of the application
	var AppView = Backbone.View.extend({
		navPrimary: null,
		navSecondary: null,
		
		initialize: function(config) {
			if(config.sessionData.debug) {
				console.log('main - appView - initialize', appConfig);
			}

			register.setPubsub(new pubsub);

			register.setApiSessionId(config.sessionData.sessionId);
			register.setApiSessionKey(config.sessionData.apiSessionKey);
			register.setApiUrl(config.apiUrl);
			register.setDebug(config.sessionData.debug);
			register.setI18n(config.sessionData.lang, config.translations);
			register.setLang(config.sessionData.lang);
			register.setAvailableLanguages(config.languages);
			register.setRider(new riderModule.model(config.sessionData.rider));
			
			var session = new sessionModule.model();
			if(register.isDebug()) {
				window.session = session;
				window.register = register;
			}
			
			this.navPrimary = new NavPrimaryView();
			this.navSecondary = new NavSecondaryView();
			
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