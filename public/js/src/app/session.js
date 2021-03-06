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
	'text!templates/session/logout-message.tpl',
	'text!templates/session/registration-form.tpl',

	// Bootstrap plugins
	'order!bootstrap/bootstrap-dropdown'
	
	], function($, cookie, _, Backbone, mustache, register, riderModule, cornerLoggedInTpl, cornerLoggedOutTpl, loginFormTpl,
			logoutMessageTpl, registrationTpl, dropdownPlugin){

	// View instances
	var sessionCorner, loginLogout;
	// Debug flag
	var debug = false;
	// Pubsub instance
	var pubsub;
	
	/**************************************************************************
	 * MODEL 
	 *************************************************************************/
	var Session = Backbone.Model.extend({
		/**********************************************************************
		 * Standard Backbone methods
		 *********************************************************************/
		defaults: function(){
			return {
				// The rider object
				rider: null,
				// Form error
				error: null,
				// The language used in the application
				lang: null
			}
		},
		
		initialize: function() {
			this.loadPersistingIdentityParams();
			
			this.url = register.getApiResourceUrl('session');
			this.set({
				rider: register.getRider(),
				lang: register.getLang()
			});

			sessionCorner = new SessionCornerView(this);
			loginLogout = new LoginLogoutView(this);
			debug = register.isDebug();
			pubsub = register.getPubsub();
		},
		
		events: {
			change: function() {
				if(debug) {
					console.info('session - model - change', arguments);
				}
			}
		},
		
		isLoggedIn: function() {
			return !!register.getRider().isLoggedIn();			
		},
		
		/**********************************************************************
		 * Business logic
		 *********************************************************************/
		onLoginLogoutSuccess: function(params, data, status){
			register.setApiSessionId(data.sessionId);
			this.url = register.getApiResourceUrl('session');

			this.attributes.rider.set(data.rider);
			register.setRider(this.attributes.rider);
			this.trigger('change');
			
			loginLogout.remove();
			if(params.isLogin) {
				pubsub.publish('session.login.success');
				this.savePersistingIdentityParams(params.formValuesAsArray);
			} else {
				pubsub.publish('session.logout.success');
				this.clearPersistingIdentityParams();
			}
		},
		
		onLoginLogoutError: function(isLogin, jqXHR, textStatus, errorThrown) {
			var response = JSON.parse(jqXHR.responseText);
			this.set({error: response.errorId});

			if(!isLogin) {
				loginLogout.displayLogoutMessage();
				loginLogout.showLogoutError();
			}
		},
		
		login: function(formValues, formValuesAsArray) {
			this.resetError();
			$.ajax({
				url: this.url,
				type: 'POST',
				dataType: 'json',
				data: formValues,
				success: _.bind(this.onLoginLogoutSuccess, this, {isLogin: true, formValuesAsArray: formValuesAsArray}),
				error: _.bind(this.onLoginLogoutError, this, true) 
			});
		},
		
		logout: function() {
			this.resetError();
			$.ajax({
				url: register.getApiResourceUrl('session', {}, register.getApiSessionId()),
				type: 'DELETE',
				dataType: 'json',
				success: _.bind(this.onLoginLogoutSuccess, this, {isLogin: false}),
				error: _.bind(this.onLoginLogoutError, this, false) 
			});
		}, 
		
		onRegisterSuccess: function(params, data, status){
			this.login(params.formValues, params.formValuesAsArray);
		},
		
		onRegisterError: function(params, jqXHR, textStatus, errorThrown) {
			var response = JSON.parse(jqXHR.responseText);
			this.set({error: response.errors});
			loginLogout.showRegistrationError();
		},
		
		register: function(formValues, formValuesAsArray) {
			this.resetError();
			var rider = register.getRider();
			var updates = {};
			_.map(formValuesAsArray, function(obj){
				updates[obj.name] = obj.value;
			});
			
			rider.set(updates);
			
			$.ajax({
				url: rider.url,
				type: 'POST',
				dataType: 'json',
				data: formValues,
				success: _.bind(this.onRegisterSuccess, this, {formValues: formValues, formValuesAsArray: formValuesAsArray}),
				error: _.bind(this.onRegisterError, this, {formValues: formValues, formValuesAsArray: formValuesAsArray}) 
			});
			
		},
		
		resetError: function() {
			this.set({'error': null}, {silent: true});
		},
		
		/**********************************************************************
		 * Login cookies
		 *********************************************************************/
		persistingIdentityParams: {
			userN: null, // username
			userP: null, // user password
			userR: false //whether to remember user login and password
		},
		
		loadPersistingIdentityParams: function() {
			_.each(['userN', 'userP', 'userR'], function(element, index, list){
				this.persistingIdentityParams[element] = $.cookie(element);
			}, this);
			
			if(debug) {
				console.info('session - loadPersistingIdentityParams', this.persistingIdentityParams);
			}
		},
		
		clearPersistingIdentityParams: function() {
			_.each(['userN', 'userP', 'userR'], function(element, index, list){
				this.persistingIdentityParams[element] = null;
				$.cookie(element, null);
			}, this);
			
			if(debug) {
				console.info('session - clearPersistingIdentityParams', this.persistingIdentityParams);
			}
		},
		
		savePersistingIdentityParams: function(params) {
			if(debug) {
				console.info('session - savePersistingIdentityParams', params);
			}
			var cookieParams = null;
			_.each(params, function(param){
				if(param.name == 'userR' && param.value == '1') {
					cookieParams = {expires: 30};
				}
			});
			
			_.each(params, function(param){
				$.cookie(param.name, param.value, cookieParams);
			});
		}
	});

	
	/**************************************************************************
	 * VIEWS 
	 *************************************************************************/

	/**************************************************************************
	 * Session corner 
	 *************************************************************************/
	var SessionCornerView = Backbone.View.extend({
		el: $('#session-corner'),

		initialize: function(session) {
			this.model = session;
			this.model.bind('change', this.render, this);

			register.getPubsub().subscribe('register.lang.ready', _.bind(this.onLangChange, this));
		},
		
		close: function() {
			this.model.unbind();
			register.getPubsub().unsubscribe('register.lang.ready', _.bind(this.onLangChange, this));
		},
		
		onLangChange: function(lang) {
			this.model.set({lang: lang});
			this.render();
		},
		
		render: function() {
			var templateFile = this.model.isLoggedIn() ? cornerLoggedInTpl : cornerLoggedOutTpl;
			this.template = mustache.compile(templateFile);
			
			$(this.el).html(this.template(this.getDataForRender()));
			return this;
		},
		
		getDataForRender: function() {
			return register.decorateForMustache({
				languages: register.getAvailableLanguages(),
				lang: this.model.get('lang'),
				error: this.model.get('error'),
				rider: this.model.get('rider').attributes,
				i18n: register.getI18n()
			});
		},
		
		events: {
			click: function(e){
				var $el = $(e.target);
				
				if($el.is('#logout-btn')) {
					this.model.logout();
				} else if($el.is('#login-btn')) {
					loginLogout.displayLoginForm();
				} else if($el.is('#registration-btn')) {
					loginLogout.displayRegistrationForm();
				} else if($el.is('#profile-btn')) {
					pubsub.publish('register.content.changeRequest', 'rider-profile-form');
				} else if ($el.is('#lang-picker a')) {
					$el.parent().parent().removeClass('open');
					register.setLang($el.data('lang'));
				}
			}
		}
		
	}); 
	
	/**************************************************************************
	 * Login/logout/registration modal
	 *************************************************************************/
	var LoginLogoutView = Backbone.View.extend({
		el: $('#modal'),
		
		initialize: function(model) {
			this.model = model;
			this.model.bind('change', this.render, this);
		},

		close: function() {
			this.model.unbind();
		},
		
		templateFile: null,

		displayLoginForm: function() {
			this.model.resetError();
			this.templateFile = loginFormTpl;
			this.render();
			$(this.el).addClass('session-login-form').modal();
		},
		
		displayLogoutMessage: function() {
			this.templateFile = logoutMessageTpl;
			this.render();
			$(this.el).addClass('session-logout-message').modal();	
		},
		
		displayRegistrationForm: function() {
			this.model.resetError();
			this.templateFile = registrationTpl;
			this.render();
			$(this.el).find('span.help-inline').addClass('hide');			
			$(this.el).addClass('session-registration-message').modal();
		},
		
		displayProfileUpdateForm: function() {
			
		},
		
		remove: function() {
			$(this.el).removeClass('session-login-form session-logout-message session-registration-message')
			          .modal('hide');
		},

		getDataForRender: function() {
			var error = this.model.get('error');
			var errorMsg;
			
			if(!error) {
				errorMsg = null;
			} else if(error.hasOwnProperty) {
				errorMsg = {};
				_.each(error, function(val, key){
					errorMsg[key] = register.getI18n()[val[0]];
				});
			} else {
				errorMsg = register.getI18n()[error];
			}
			
			return register.decorateForMustache({
				rider: this.model.get('rider').attributes,
				i18n: register.getI18n(),
				error: errorMsg
			});
		},
		
		render: function(registration) {
			if(!this.templateFile) {
				return;
			}
			
			this.template = mustache.compile(this.templateFile);
			
			$(this.el).html(
				this.template(this.getDataForRender())
			);
			return this.el;
		},
		
		showLogoutError: function() {
			this.render();
			
			$(this.el).find('#session-logout-error').show().end()
			          .find('#session-logout-message').hide().end()
			          .find('#session-logout-close').removeAttr('disabled');
		},
		
		showRegistrationError: function() {
			this.render();

			$(this.el).find('span.help-inline').each(function(i, el) {
				$(el).toggleClass('hide', !$(el).html());
			});
			
			$(this.el).find('#session-registration-error').show();
		},
		
		events: {
			'submit': function(e){
				var $form = $(e.target);
				if($form.is('#login-form'))  {
					this.model.login($form.serialize(), $form.serializeArray());
				} else {
					this.model.register($form.serialize(), $form.serializeArray());
				}
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
			loginLogout: LoginLogoutView
		}
	};
});
