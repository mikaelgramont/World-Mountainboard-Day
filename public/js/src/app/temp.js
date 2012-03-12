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
	'../app/register',
	'../app/rider',
	
	// Templates
	'text!templates/modal.tpl',

	// Bootstrap plugins
	'order!bootstrap/bootstrap-modal'
	
	], function($, _, Backbone, mustache, register, riderModule, modalTpl, bootstrapModal){

	var pubsub;
	
	/**************************************************************************
	 * VIEWS 
	 *************************************************************************/
	var ModalView = Backbone.View.extend({
		template: mustache.compile(modalTpl),
		render: function(){
			$(this.el).html(this.template());
			return this;
		},
		getHtml: function() {
			return $(this.el).html();
		}
	});
	
	var TempView = Backbone.View.extend({
		el: $("#main"),
		
		initialize: function(riders) {
			pubsub = register.getPubsub();

			this.riders = riders;
			this.riders.bind('add', this.addOne, this);
			this.riders.bind('reset', this.addAll, this);
			this.riders.fetch();
		},
		
		events: {
			click: function() {
				var view = new ModalView({model: this.model});
				$("#modal").html(view.render().getHtml()).modal();
				console.log('temp - click');				
			}
		},
		
		addOne: function(rider) {
			var view = new riderModule.views.username({model: rider});
			this.$("#rider-list").append(view.render().el);
		},
		
		addAll: function() {
			this.riders.each(this.addOne);
		}
	});
	
	return {
		views: {
			modal: ModalView,
			temp: TempView
		}
	};
});