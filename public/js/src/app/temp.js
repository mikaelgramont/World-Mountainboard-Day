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
	'text!templates/temp/modal.tpl',
	'text!templates/temp/section.tpl',
	'text!templates/temp/aside.tpl',

	// Bootstrap plugins
	'order!bootstrap/bootstrap-modal'
	
	], function($, _, Backbone, mustache, register, riderModule, modalTpl, sectionTpl, asideTpl, bootstrapModal){

	var pubsub;
	
	/**************************************************************************
	 * VIEWS 
	 *************************************************************************/
	var ModalView = Backbone.View.extend({
		el: $('#modal'),
		
		template: mustache.compile(modalTpl),
		
		render: function(){
			$(this.el).html(this.template());
			return this;
		},
		
		getHtml: function() {
			return $(this.el).html();
		},
		
		events: {
			click: function(e) {
				if(!$(e.target).is('p.modalClick')){
					return;
				}
				var s = new SectionView(),
				    a = new AsideView();
				pubsub.publish('register.content.ready', s, a);
			}
		},
		
		close: function() {
			this.model.unbind();
			this.remove();
		}
	});
	
	var SectionView = Backbone.View.extend({
		template: mustache.compile(sectionTpl),
		render: function(){
			return this.template();
		}
	});
	
	var AsideView = Backbone.View.extend({
		template: mustache.compile(asideTpl),
		render: function(){
			return this.template();
		}
	});
	
	var TempView = Backbone.View.extend({
		el: $("#main"),
		
		initialize: function(riders) {
			if(register.isDebug()) {
				console.log('temp - initialize');
			}
			
			pubsub = register.getPubsub();

			this.riders = riders;
			this.riders.bind('reset', this.addAll, this);
			this.riders.fetch();
			
			pubsub.subscribe('register.lang.ready', _.bind(this.redraw, this));
		},
		
		close: function() {
			if(register.isDebug()) {
				console.log('temp - close');
			}
			this.riders.unbind();
			this.riders.reset();
			register.getPubsub().unsubscribe('register.lang.ready', _.bind(this.redraw, this));
		},
		
		redraw: function() {
			if(register.isDebug()) {
				console.log('temp - redraw');
			}
			this.riders.reset();
		},
		
		events: {
			click: function() {
				var view = new ModalView({model: this.model});
				$("#modal").html(view.render().getHtml()).modal();
				if(register.isDebug()) {
					console.log('temp - click');
				}
			}
		},
		
		addOne: function(rider) {
			console.log('addOne');
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