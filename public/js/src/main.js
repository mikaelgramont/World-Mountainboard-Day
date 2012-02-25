/******************************************************************************
 * js/src/app/main.js
 * Point of entry into the application
 *****************************************************************************/
require([
    // Libraries
	'jquery',
	'underscore',
   	'backbone',
   	
   	// Application modules
   	'../src/app/rider',
], function($, _, Backbone, riderModule){
	// The Application
	// ---------------
	
	// Create our global collection of **Riders**.
	var riders = new riderModule.collection;
	
	// Our overall **AppView** is the top-level piece of UI.
	var AppView = Backbone.View.extend({
		el: $("#app"),
		
		initialize: function() {
			riders.bind('add',   this.addOne, this);
			riders.bind('reset', this.addAll, this);
			riders.fetch();
		},
		
		addOne: function(rider) {
			var view = new riderModule.view({model: rider});
			this.$("#rider-list").append(
				view.render().el
			);
		},
		
		addAll: function() {
			riders.each(this.addOne);
		}
	});
	
	  // Finally, we kick things off by creating the **App**.
	var app = new AppView;
});