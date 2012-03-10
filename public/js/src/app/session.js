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
	
	// Templates
	'text!templates/session/corner-logged-in.tpl',
	'text!templates/session/corner-logged-out.tpl',
	'text!templates/session/login-form.tpl',

	// Bootstrap plugins
	'order!bootstrap/bootstrap-dropdown'
	
	], function($, cookie, _, Backbone, mustache, register, riderModule, cornerLoggedInTpl, cornerLoggedOutTpl, loginFormTpl, dropdownPlugin){

	var corner, modal;
	
	/**************************************************************************
	 * MODEL 
	 *************************************************************************/
	var Session = Backbone.Model.extend({
		defaults: function(){
			return {
				// The rider object
				rider: null,
				// Form error
				errorMessage: 'test'
			}
		},
		
		initialize: function() {
			//this.savePersistingIdentityParams('plainuser', '123456789', true);
			this.loadPersistingIdentityParams();
			
			this.url = register.getApiResourceUrl('session');
			this.set({rider: register.getRider()});

			corner = new SessionCornerView(this);
			window.myModal = modal = new LoginFormView(this);
		},
		
		events: {
			change: function() {
				console.info('session - model - change', arguments);
			}
		},
		
		isLoggedIn: function() {
			return !!register.getRider().isLoggedIn();			
		},
		
		login: function(formValues, formValuesAsArray) {
			console.info('login', formValues);
			this.set({errorMessage: ''}, {silent: true});
			
			var onLoginSuccess = _.bind(function(data, status){
				register.setApiSessionId(data.sessionId);
				this.url = register.getApiResourceUrl('session');

				this.attributes.rider.set(data.rider);
				this.trigger('change');
				
				// Does not remvoe the background:
				$("#modal").hide().trigger('hidden');
				
				this.savePersistingIdentityParams(formValuesAsArray);
			}, this);
			
			var onLoginError =  _.bind(function(jqXHR, textStatus, errorThrown) {
				var response = JSON.parse(jqXHR.responseText);
				this.set({errorMessage: response.errorId});
				console.info('session - login ajax error', this.get('errorMessage'));
				// TODO: update the UI to show errors
			}, this);
			
			$.ajax({
				url: this.url,
				type: 'POST',
				dataType: 'json',
				data: formValues,
				success: onLoginSuccess,
				error: onLoginError 
			});
		},
		
		logout: function() {
			console.info('session - logout', arguments);
			this.set({errorMessage: ''}, {silent: true});

			var onLogoutSuccess = _.bind(function(data, status){
				register.setApiSessionId(data.sessionId);
				this.url = register.getApiResourceUrl('session');

				this.attributes.rider.set(data.rider);
				this.trigger('change');
				
				this.clearPersistingIdentityParams();
			}, this);
			
			var onLogoutError =  _.bind(function(jqXHR, textStatus, errorThrown) {
				var response = JSON.parse(jqXHR.responseText);
				this.set({errorMessage: response.errorId});
				console.info('session - logout ajax error', this.get('errorMessage'));
				// TODO: update the UI to show errors
			}, this);			

			var url = '//' + register.getApiUrl() + '/sessions/' + register.getApiSessionId() + '/' +'?PHPSESSID=' + register.getApiSessionId();
			console.info('delete url', url);
			
			$.ajax({
				url: url,
				type: 'DELETE',
				dataType: 'json',
				success: onLogoutSuccess,
				error: onLogoutError 
			});
		},
		
		// The following reflect login cookies
		persistingIdentityParams: {
			userN: null, // username
			userP: null, // user password
			userR: false //whether to remember user login and password
		},
		
		loadPersistingIdentityParams: function() {
			_.each(['userN', 'userP', 'userR'], function(element, index, list){
				this.persistingIdentityParams[element] = $.cookie(element);
			}, this);
			
			if(register.isDebug()) {
				console.info('session - loadPersistingIdentityParams', this.persistingIdentityParams);
			}
		},
		
		clearPersistingIdentityParams: function() {
			_.each(['userN', 'userP', 'userR'], function(element, index, list){
				this.persistingIdentityParams[element] = null;
				$.cookie(element, null);
			}, this);
			
			if(register.isDebug()) {
				console.info('session - clearPersistingIdentityParams', this.persistingIdentityParams);
			}
		},
		
		savePersistingIdentityParams: function(params) {
			var ret = false;
			_.each(params, function(param){
				if(param.name == 'userR' && param.value == '1') {
					ret = true;
				}
			});
			
			if(!ret) {
				return;
			}
			
			_.each(params, function(param){
				$.cookie(param.name, param.value, {expires: 30});
			});
		}
	});

	
	/**************************************************************************
	 * VIEWS 
	 *************************************************************************/
	var SessionCornerView = Backbone.View.extend({
		initialize: function(session) {
			this.model = session;
			
			this.model.bind('change', this.render, this);
		},
		
		el: $('#session-corner'),

		render: function() {
			var rider = this.model.get('rider');
			
			console.info('session - corner view - render');
			var templateFile = this.model.isLoggedIn() ? cornerLoggedInTpl : cornerLoggedOutTpl;
			this.template = mustache.compile(templateFile);
			
			$(this.el).html(
				this.template(rider.toJSON())
			);
			return this;
		},
		
		events: {
			click: function(e){
				var handled = true;

				if(e.target.id == 'logout-btn') {
					this.model.logout();
				} else if (e.target.id == 'login-btn') {
					$("#modal").addClass('login-form').html(
						modal.render()
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
			
			this.model.bind('change', this.render, this);
			
			this.template = mustache.compile(loginFormTpl);
		},
		
		el: $('#modal'),
		
		template: mustache.compile(loginFormTpl),

		render: function() {
			console.debug('session - LoginFormView render()', this);
			return this.template(this.model.toJSON());
		},
		
		events: {
			'submit': function(e){
				console.info('session - LoginModalView - submit', arguments);
				var form = e.target;
				this.model.login($(form).serialize(), $(form).serializeArray());
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
