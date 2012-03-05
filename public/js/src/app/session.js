/******************************************************************************
 * js/src/app/session.js
 *
 * Session model
 *****************************************************************************/
define([
    // Libraries
	'jquery',
	'underscore',
	'backbone',
	'mustache-wrapper',

	// Templates
	'text!templates/session/corner.tpl',
	'text!templates/session/login.tpl',
	'text!templates/modal.tpl',

	// Bootstrap  plugins
	'bootstrap/bootstrap-modal'
	
	], function($, _, Backbone, mustache, cornerTpl, loginTpl, modalTpl){
	
	var model = Backbone.Model.extend({
		defaults: function() {
			return {
				apiSessionId: null, // By default, no session id
				user: {},   // guest user by default
				lang: 'en', // the language being used in the current session

				// the following will be persisted to cookies or localstorage (latter more likely)
				userN: null, // username
				userP: null, // user password
				userR: false, //whether to remember user login and password
				
				errors: [] // login/logout errors
			};
		},
		
		initialize: function(appConfig) {
			console.log('session - initialize');
			console.log('appConfig', appConfig);
		},
		
		isLoggedIn: function() {
			return !!this.userId;			
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
