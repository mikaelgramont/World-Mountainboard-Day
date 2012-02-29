/******************************************************************************
 * js/src/app/rider.js
 *
 * Rider model, collection and view
 *****************************************************************************/
define([
    // Libraries
	'jquery',
	'underscore',
	'backbone',
	'mustache-wrapper',

	// Templates
	'text!templates/rider/username.tpl',
	'text!templates/modal.tpl',

	// Bootstrap  plugins
	'bootstrap/bootstrap-modal',
	
	], function($, _, Backbone, mustache, usernameTpl, modalTpl){
	var model = Backbone.Model.extend({
		// Default attributes for a rider item.
		defaults: function() {
			return {
				username:  'unknown'
			};
		}
	});
	
	var collection = Backbone.Collection.extend({
		// Reference to this collection's model.
		model: model,
		url: window.appConfig.apiUrl + '/riders/'
	});
	
	var modalView = Backbone.View.extend({
		template: mustache.compile(modalTpl),
		render: function(){
			$(this.el).html(
				this.tempate(this.model.toJSON())
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
	
	return {
		'model': model,
		'collection': collection,
		'view': usernameView
	};
});
