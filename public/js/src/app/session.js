/******************************************************************************
 * js/src/app/session.js
 *
 * Session model
 *****************************************************************************/
define([
    // Libraries
	'order!jquery',
	'order!jquery.cookie',
	'underscore',
	'backbone',
	'mustache-wrapper',

	// Application modules
	'../app/register',
	'../app/rider',
	'../app/temp',
	
	// Templates
	'text!templates/session/corner-logged-in.tpl',
	'text!templates/session/corner-logged-out.tpl',
	'text!templates/session/login-form.tpl',

	// Bootstrap plugins
	'order!bootstrap/bootstrap-dropdown'
	
	], function($, cookie, _, Backbone, mustache, register, riderModule, tempModule, cornerTpl, loginTpl, dropdownPlugin){

	/**************************************************************************
	 * MODEL 
	 *************************************************************************/
	var model = Backbone.Model.extend({
		errors: [], // form errors
		
		initialize: function(appConfig) {
			if(appConfig.sessionData.debug) {
				console.log('session - initialize', appConfig);
			}

			register.setApiSessionId(appConfig.sessionData.apiSessionId);
			register.setDebug(appConfig.sessionData.debug);
			register.setLang(appConfig.sessionData.lang);
			register.setRider(new riderModule.model(appConfig.sessionData.rider));
			
			this.savePersistingIdentityParams('n', 'p', true);
			this.loadPersistingIdentityParams();
			
			var corner = new sessionCornerView(this);
			
			if(register.isDebug()) {
				window.session = this;
			}
		},
		
		isLoggedIn: function() {
			return !!register.getRider().isLoggedIn();			
		},
		
		login: function() {
			console.log('session - login', arguments);
			/**
			 * TODO: call this method when the login form is submitted
			 * - update the current model with data from the login form
			 * - prepare and send a POST ajax request to the api: /sessions/
			 * - use the result of that:
			 *   - in case of success:
			 *     - clear errors
			 *     - save the new userId
			 *     - maybe save parameters to LS (depending on userR)
			 *     - send a 'login' event 
			 *   - in case of error
			 *     - update the UI to show errors
			 */
		},
		
		logout: function() {
			console.log('session - logout', arguments);
			/**
			 * TODO: call this method when the logout form is submitted
			 * - reset model data
			 * - prepare and send a DELETE ajax request to the api: /sessions/
			 * - use the result of that:
			 *   - in case of success: 
			 *     - clear errors
			 *     - save the new userId (0)
			 *     - clear parameters in LS
			 *     - send a 'logout' event 
			 *   - in case of error
			 *     - update the UI to show errors
			 */
		},
		
		// The following reflect login cookies
		persistingIdentityParams: {
			userN: null, // username
			userP: null, // user password
			userR: false, //whether to remember user login and password
		},
		
		loadPersistingIdentityParams: function() {
			_.each(['userN', 'userP', 'userR'], function(element, index, list){
				this.persistingIdentityParams[element] = $.cookie(element);
			}, this);
			
			if(register.isDebug()) {
				console.log('session - loadPersistingIdentityParams', this.persistingIdentityParams);
			}
		},
		
		savePersistingIdentityParams: function(userN, userP, userR) {
			$.cookie('userN',userN);
			$.cookie('userP',userP);
			$.cookie('userR',userR);
		}
	});

	
	/**************************************************************************
	 * VIEWS 
	 *************************************************************************/
	var sessionCornerView = Backbone.View.extend({
		initialize: function(model) {
			this.model = model;
			
			this.model.bind('login', this.render, this);
			this.model.bind('logout', this.render, this);
		},
		
		el: $('#session-corner'),

		template: mustache.compile(cornerTpl),

		render: function() {
			console.log('session - render()', arguments);
			$(this.el).html(
				this.template(this.model.toJSON())
			);
			return this;
		},
		
		events: {
			'click': function(e){
				console.log('session - backbone listener - click', arguments);
				var handled = true;
				if(e.originalEvent.originalTarget.id == 'logout-btn') {
					this.model.logout();
				} else if (e.originalEvent.originalTarget.id == 'login-btn') {
					this.model.login();
				} else {
					handled = false;
				}
				
				if(handled) {
					e.preventDefault();
					e.stopPropagation();
				}
			}
		}
	}); 

	
	/**************************************************************************
	 * MODULE INTERFACE 
	 *************************************************************************/
	return {
		model: model,
		views: {
			sessionCorner: sessionCornerView
		}
	};
});
