// app.js
console.log('js/src/app/main.js - app loading')
define(['jquery','underscore','backbone'], function($, _, Backbone){
    return {
        initialize: function(){
        	  // The Application
        	  // ---------------

        	  // Our overall **AppView** is the top-level piece of UI.
        	  window.AppView = Backbone.View.extend({

        	    // Instead of generating a new element, bind to the existing skeleton of
        	    // the App already present in the HTML.
        	    el: $("#main"),

        	    // At initialization we bind to the relevant events on the `Riders`
        	    // collection, when items are added or changed. Kick things off by
        	    // loading any preexisting todos that might be saved in *localStorage*.
        	    initialize: function() {
        	      this.input    = this.$("#new-todo");

        	      Riders.bind('add',   this.addOne, this);
        	      Riders.bind('reset', this.addAll, this);
        	     
        	      Riders.fetch();
        	    },

        	    // Add a single rider to the list by creating a view for it, and
        	    // appending its element to the `<ul>`.
        	    addOne: function(rider) {
        	      var view = new RiderView({model: rider});
        	      this.$("#rider-list").append(view.render().el);
        	    },

        	    // Add all items in the **Riders** collection at once.
        	    addAll: function() {
        	      Riders.each(this.addOne);
        	    }
        	  });

        	  // Finally, we kick things off by creating the **App**.
        	  window.App = new AppView;
        }
    };
});/******************************************************************************
 * Rider model, collection and view
 *****************************************************************************/
require(['jquery','underscore','backbone'], function($, _, Backbone){
	console.log('js/src/app/rider.js - setting up the ride model, collection and view')
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
		className: "rider",
		
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
});