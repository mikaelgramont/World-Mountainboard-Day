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
	
	// Templates
	'text!templates/session/corner-logged-in.tpl',
	'text!templates/session/corner-logged-out.tpl',
	'text!templates/session/login-form.tpl',

	// Bootstrap plugins
	'order!bootstrap/bootstrap-dropdown'
	
	], function($, cookie, _, Backbone, mustache, register, cornerLoggedInTpl, cornerLoggedOutTpl, loginFormTpl, dropdownPlugin){

	/**************************************************************************
	 * MODEL 
	 *************************************************************************/
	var Session = Backbone.Model.extend({
		errors: [], // form errors
		
		initialize: function() {
			//this.savePersistingIdentityParams('plainuser', '123456789', true);
			this.loadPersistingIdentityParams();
			
			var corner = new SessionCornerView(this);
			
			this.url = register.getApiResourceUrl('session');
		},
		
		isLoggedIn: function() {
			return !!register.getRider().isLoggedIn();			
		},
		
		login: function(formValues) {
			console.log('session - login', formValues);
			
			var session = this;
			
			$.ajax({
				url: this.url,
				type: 'POST',
				dataType: 'json',
				data: formValues,
				success: function(responseData, status){
					console.log('session - login ajax success', responseData.sessionId);
					register.setApiSessionId(responseData.sessionId);
					session.url = register.getApiResourceUrl('session');
				},
				
				error: function(jqXHR, textStatus, errorThrown) {
					console.log('session - login ajax error', arguments);
				}
			});
			
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
	var SessionCornerView = Backbone.View.extend({
		initialize: function(model) {
			this.model = model;
			
			this.model.bind('login', this.render, this);
			this.model.bind('logout', this.render, this);
			
			var templateFile = this.model.isLoggedIn() ? cornerLoggedInTpl : cornerLoggedOutTpl;
			this.template = mustache.compile(templateFile);
		},
		
		el: $('#session-corner'),

		render: function() {
			$(this.el).html(
				this.template(this.model.toJSON())
			);
			return this;
		},
		
		events: {
			'click': function(e){
				var handled = true;
				if(e.originalEvent.originalTarget.id == 'logout-btn') {
					this.model.logout();
				} else if (e.originalEvent.originalTarget.id == 'login-btn') {
					$("#modal").addClass('login-form').html(
						new LoginFormView(this.model).render()
					).modal();
					
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

	// The login form
	var LoginFormView = Backbone.View.extend({
		initialize: function(model) {
			this.model = model;
		},
		
		el: $('#modal'),
		
		template: mustache.compile(loginFormTpl),

		render: function() {
			console.log('session - LoginFormView render()', arguments);
			return this.template(this.model.toJSON());
		},
		
		events: {
			'submit': function(e){
				console.log('session - LoginModalView - submit', arguments);
				var form = e.originalEvent.originalTarget;
				this.model.login($(form).serialize());
			}
		}
	}); 
	/**************************************************************************
	 * MODULE INTERFACE 
	 *************************************************************************/
	return {
		model: Session,
		views: {
			sessionCorner: SessionCornerView,
			loginForm: LoginFormView
		}
	};
});
