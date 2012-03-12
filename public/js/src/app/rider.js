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

	], function($, _, Backbone, mustache, register, usernameTpl, modalTpl, bootstrapModal){

	var pubsub;
	
	/**************************************************************************
	 * MODEL 
	 *************************************************************************/
	var Rider = Backbone.Model.extend({
		// Default attributes for a rider item.
		defaults: function() {
			return {
				username:  'unknown',
				userId: 0
			};
		},
		
		initialize: function(initialValues) {
			if(register.isDebug()) {
				//console.info('rider - initialize', initialValues);
			}
			pubsub = register.getPubsub();
		},
		
		isLoggedIn: function() {
			return !!(parseInt(this.get('userId'), 10));
		},
		
		events: {
			change: function() {
				console.log('rider model - change', arguments);
			}
		}
	});

	
	/**************************************************************************
	 * COLLECTION 
	 *************************************************************************/
	var RiderCollection = Backbone.Collection.extend({
		model: Rider,
		initialize: function(){
			this.url = register.getApiResourceUrl('rider');
		}
	});


	/**************************************************************************
	 * VIEWS 
	 *************************************************************************/
	var ModalView = Backbone.View.extend({
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
	
	var UsernameView = Backbone.View.extend({
		tagName:  "li",
		className: "rider",
		
		events: {
			'click': function(e){
				var view = new ModalView({model: this.model});
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
				this.template(_.extend(this.model.toJSON(), {i18n: register.getI18n()}))
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
		'model': Rider,
		'collection': RiderCollection,
		'views': {
			modal: ModalView,
			username: UsernameView
		}
	};
});
