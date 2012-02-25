/******************************************************************************
 * js/src/app/rider.js
 * 
 * Rider model, collection and view
 *****************************************************************************/
define(['jquery', 'underscore', 'backbone'], function($, _, Backbone){
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
	
	var view = Backbone.View.extend({
		tagName:  "li",
		className: "rider",
		
		// Cache the template function for a single item.
		template: _.template($('#rider-template').html()),
	
		events: {
			
		},
	
		// The RiderView listens for changes to its model, re-rendering.
		initialize: function() {
			this.model.bind('destroy', this.remove, this);
		},
	
		// Re-render the contents of the item
		render: function() {
			$(this.el).html(this.template(this.model.toJSON()));
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
		'view': view
	};
});