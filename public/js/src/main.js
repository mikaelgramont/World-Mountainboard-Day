/******************************************************************************
 * js/src/main.js
 * 
 * Point of entry into the application
 *****************************************************************************/
require([
    // Libraries
	'jquery',
	'underscore',
	'backbone',
	'mustache-wrapper',

	// Application modules
	'../src/app/session',
	'../src/app/rider',

	// Bootstrap plugins
	'bootstrap/bootstrap-dropdown'

], function($, _, Backbone, mustache, riderModule){
	// Start building the application
	var riders = new riderModule.collection();
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
	
	var app = new AppView();
});