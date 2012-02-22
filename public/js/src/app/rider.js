/*
window.Rider = Backbone.Model.extend({
	// Default attributes for a rider item.
	defaults: function() {
		return {
			username:  'unknown'
		};
	}
});

window.RiderList = Backbone.Collection.extend({
	// Reference to this collection's model.
	model: Rider,
	url: '//test.api.ridedb.dev/riders/'
});

// Create our global collection of **Riders**.
window.Riders = new RiderList;

// The DOM element for a todo item...
window.RiderView = Backbone.View.extend({
	tagName:  "li",
	
	// Cache the template function for a single item.
	template: _.template($('#rider-template').html()),

	events: {
		
	},

	// The RiderView listens for changes to its model, re-rendering.
	initialize: function() {
		this.model.bind('destroy', this.remove, this);
	},

	// Re-render the contents of the todo item.
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
*/