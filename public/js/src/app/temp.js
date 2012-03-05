/******************************************************************************
 * js/src/app/temp.js
 *
 * Temporary code to verify everything works
 *****************************************************************************/
define([
    // Libraries
	'order!jquery',
	'underscore',
	'backbone',
	'mustache-wrapper',

	// Application modules
	'../app/rider',
	
	// Templates
	'text!templates/modal.tpl',

	// Bootstrap  plugins
	'order!bootstrap/bootstrap-modal'
	
	], function($, _, Backbone, mustache, riderModule, modalTpl, bootstrapModal){
	
	var modalView = Backbone.View.extend({
		template: mustache.compile(modalTpl),
		render: function(){
			$(this.el).html(this.template());
			return this;
		},
		getHtml: function() {
			return $(this.el).html();
		}
	});
	
	var tempView = Backbone.View.extend({
		el: $("#app"),
		
		initialize: function(riders) {
			this.riders = riders;
			this.riders.bind('add', this.addOne, this);
			this.riders.bind('reset', this.addAll, this);
			this.riders.fetch();
		},
		
		events: {
			click: function() {
				var view = new modalView({model: this.model});
				$("#modal").modal().html(view.render().getHtml());
				console.log('temp - click');				
			}
		},
		
		addOne: function(rider) {
			var view = new riderModule.view({model: rider});
			this.$("#rider-list").append(view.render().el);
		},
		
		addAll: function() {
			this.riders.each(this.addOne);
		}
	});
	
	var app = new tempView(new riderModule.collection());
});