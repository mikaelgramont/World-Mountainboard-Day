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
	'text!templates/layout/modal.tpl',
	
	// Bootstrap plugins
	'order!bootstrap/bootstrap-modal'
	
], function($, _, Backbone, mustache, register, pubsub, sessionModule, riderModule, tempModule, navPrimaryTpl, navSecondaryTpl, modalTpl, bootstrapModal){
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

	/**************************************************************************
	 * Application router
	 *************************************************************************/
	var Router = Backbone.Router.extend({
		routes: {
			"": 			"index",
			"locations/":	"locations",
			"riders/":		"riders",
			"sessions/":	"sessions"
		},
		
		index: function() {
			console.log('Calling the index route', arguments);
		},
		
		locations: function(){
			console.log('Calling the locations route', arguments);
		},
		
		riders: function(){
			console.log('Calling the riders route', arguments);
		},
		
		sessions: function(){
			console.log('Calling the sessions route', arguments);
		}
		
	});
	
	/**************************************************************************
	 * Application modal dialog view
	 * Only one instance allowed. Accessed through the register.
	 *************************************************************************/
	var ModalView = Backbone.View.extend({
		dataForRender: {
			title: '',
			contentHtml: ''
		},
		
		el: $('#modal'),
		
		template: mustache.compile(modalTpl),

		render: function() {
			$(this.el).html(this.template(this.getDataForRender()));
			return this;
		},
		
		addDataForRender: function(hash) {
			this.dataForRender = _.extend(this.dataForRender, hash);
		},
		
		resetData: function() {
			this.dataForRender = {};
			this.addDataForRender({i18n: register.getI18n()});
		},
		
		getDataForRender: function() {
			return register.decorateForMustache(this.dataForRender);
		},
		
		close: function() {
			this.resetData();
			this.model.unbind();
		}
	});

	/**************************************************************************
	 * Main view. Manages the content of the document
	 *************************************************************************/
	var MainView = Backbone.View.extend({
		section: null,
		aside: null,
		
		el: $('#main'),
		
		initialize: function(){
			if(register.isDebug()) {
				console.log('main - mainView - initialize', appConfig);
			}
			register.getPubsub().subscribe('register.content.changeRequest', _.bind(this.onContentChangeRequest, this));
			register.getPubsub().subscribe('register.content.ready', _.bind(this.onContentReady, this));
		},

		onContentChangeRequest: function(targetContentName) {
			console.log('onContentChangeRequest', arguments);
			// TODO: instantiate a riderModule.views.profile
			// make it render
			// publish a register.content.ready
		},
		
		// When a content ready event is triggered, this updates the main view
		onContentReady: function(sectionView, asideView) {
			if(register.isDebug()) {
				console.log('main - MainView - onContentReady', arguments);
			}
			if(this.section && this.section.close){
				this.section.close();
			}
			if(this.section && this.section.close){
				this.aside.close();
			}
			
			if(tempView) {
				tempView.close();
				tempView = null;
			}
			
			this.section = sectionView;
			this.aside = asideView;
			
			this.render();
		},
		
		render: function(){
			var s = this.section.render();
			$(this.el).find('section').html(s);

			var a = this.aside.render();
			$(this.el).find('aside').html(a);
		}
	});
	
	/**************************************************************************
	 * Primary navigation view
	 *************************************************************************/
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

	/**************************************************************************
	 * Secondary navigation view
	 *************************************************************************/
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
	
	/**************************************************************************
	 * Application view
	 * This view is the main entry point of the application
	 *************************************************************************/
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
			
			tempView = new tempModule.views.temp(new riderModule.collection());
			modalView = new ModalView();
			register.setModal(modalView);
			
			router = new Router();
			Backbone.history.start({pushState: true});
		},
		
		el: $('#app'),

		events: {
			'click': function(e) {
				var $e = $(e.target);
				if($e.is('.dyn-link')){
					router.navigate($e.data('href'), {trigger: true});
					e.preventDefault();
					e.stopPropagation();
				}
			},
			
			'submit': function(e) {
				preventDefaultActions(e, 'submit');
			}
			
		}

		// No close method because this view is always there
	});
	
	var appView = new AppView(appConfig);
	var mainView = new MainView();
	var modalView;
	var tempView;
	var router;
});