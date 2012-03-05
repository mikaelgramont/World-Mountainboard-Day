/******************************************************************************
 * js/src/app/session.js
 *
 * Session model
 *****************************************************************************/
define([
    // Libraries
	'order!jquery',
	'underscore',
	'backbone',
	'mustache-wrapper',

	// Application modules
	'../app/rider',
	'../app/temp',
	
	// Templates
	'text!templates/session/corner-logged-in.tpl',
	'text!templates/session/corner-logged-out.tpl',
	'text!templates/session/login-form.tpl',

	// Bootstrap  plugins
	'order!bootstrap/bootstrap-dropdown'
	
	], function($, _, Backbone, mustache, riderModule, tempModule, cornerTpl, loginTpl, dropdownPlugin){

	var model = Backbone.Model.extend({
		defaults: function() {
			return {
				apiSessionId: null, // By default, no session id
				debug: false, // Whether to use debug methods
				lang: 'en', // the language being used in the current session
				
				rider: {},   // guest user by default

				// the following will be persisted to cookies or localstorage (latter more likely)
				userN: null, // username
				userP: null, // user password
				userR: false, //whether to remember user login and password
				
				errors: [] // login/logout errors
			};
		},
		
		initialize: function(appConfig) {
			var sessionData = appConfig.sessionData;
			
			if(sessionData.debug) {
				console.log('session - initialize', appConfig);
			}

			this.attributes.apiSessionId = sessionData.apiSessionId;
			this.attributes.debug = !!sessionData.debug;
			this.attributes.lang = sessionData.lang;
			
			this.attributes.rider = new riderModule.model(sessionData.rider);
			
			window.session = this;
		},
		
		isLoggedIn: function() {
			return !!this.attributes.rider.isLoggedIn();			
		},
		
		login: function() {
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
		}
	});
	
	var sessionCornerView = Backbone.View.extend({
		template: mustache.compile(cornerTpl),
		
		initialize: function() {
			this.model.bind('login', this.render, this);
			this.model.bind('logout', this.render, this);
		},
		
		render: function() {
			console.log('session - render()', arguments);
			$(this.el).html(
				this.template(this.model.toJSON())
			);
			return this;
		}
	}); 
	
	return {
		model: model,
		views: [sessionCornerView]
	};
});
