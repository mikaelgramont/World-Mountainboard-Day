/******************************************************************************
 * js/src/app/rider.js
 *
 * Rider model, collection and view
 *****************************************************************************/
define([
    // Libraries
	'order!jquery',
	'underscore',
	'backbone',
	'mustache-wrapper',
	
	// Application modules
	'../app/register',

	// Templates
	'text!templates/rider/username.tpl',
	'text!templates/rider/modal.tpl',

	// Bootstrap  plugins
	'order!bootstrap/bootstrap-modal'
	
	], function($, _, Backbone, mustache, registerModule, usernameTpl, modalTpl, bootstrapModal){

	/**************************************************************************
	 * MODEL 
	 *************************************************************************/
	var model = Backbone.Model.extend({
		// Default attributes for a rider item.
		defaults: function() {
			return {
				username:  'unknown'
			};
		},
		
		initialize: function(initialValues) {
			console.log('rider - initialize', initialValues);
		},
		
		isLoggedIn: function() {
			return !!this.attributes.userId;
		}
		
	});

	
	/**************************************************************************
	 * COLLECTION 
	 *************************************************************************/
	var collection = Backbone.Collection.extend({
		// Reference to this collection's model.
		model: model,
		url: window.appConfig.apiUrl + '/riders/'
	});


	/**************************************************************************
	 * VIEWS 
	 *************************************************************************/
	var modalView = Backbone.View.extend({
		template: mustache.compile(modalTpl),
		
		render: function(){
			$(this.el).html(
				this.template(this.model.toJSON())
			);
			return this;
		},
		
		getHtml: function() {
			return $(this.el).html();
		}
	});
	
	var usernameView = Backbone.View.extend({
		tagName:  "li",
		className: "rider",
		
		events: {
			'click': function(e){
				var view = new modalView({model: this.model});
				$("#modal").modal().html(
					view.render().getHtml()
				);
				e.preventDefault();
			}
		},
	
		// The RiderView listens for changes to its model, re-rendering.
		initialize: function() {
			this.model.bind('destroy', this.remove, this);
		},
		
		template: mustache.compile(usernameTpl),
	
		// Re-render the contents of the item
		render: function() {
			$(this.el).html(
				this.template(this.model.toJSON())
			);
			return this;
		},
	
		// Remove this view from the DOM.
		remove: function() {
			$(this.el).remove();
		},
		
		// Remove the item, destroy the model.
		clear: function() {
			this.model.destroy();
		}
	});

	
	/**************************************************************************
	 * MODULE INTERFACE 
	 *************************************************************************/
	return {
		'model': model,
		'collection': collection,
		'views': {
			modal: modalView,
			username: usernameView
		}
	};
});
