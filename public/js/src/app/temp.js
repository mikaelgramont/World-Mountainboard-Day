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
	'text!templates/temp/modal-content.tpl',
	'text!templates/temp/section.tpl',
	'text!templates/temp/aside.tpl',

	// Bootstrap plugins
	'order!bootstrap/bootstrap-modal'
	
	], function($, _, Backbone, mustache, register, riderModule, modalContentTpl, sectionTpl, asideTpl, bootstrapModal){

	var pubsub;
	
	/**************************************************************************
	 * VIEWS 
	 *************************************************************************/
	var ModalContentView = Backbone.View.extend({
		// This is necessary to keep event handlers working:
		el: $('#modal'),
		
		template: mustache.compile(modalContentTpl),
		
		render: function(){
			return {
				contentHtml: this.template(),
				title: 'aTitle'
			};
		},
		
		events: {
			click: function(e) {
				if(!$(e.target).is('p.modalClick')){
					return;
				}
				var s = new SectionView(),
				    a = new AsideView();
				register.getPubsub().publish('register.content.ready', 'temp-content', s, a);
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
			
			this.riders = riders;
			this.riders.bind('reset', this.addAll, this);
			this.riders.fetch();

			register.getPubsub().subscribe('register.lang.ready', this.redraw, this);
		},
		
		close: function() {
			if(register.isDebug()) {
				console.log('temp - close');
			}
			this.riders.unbind();
			this.riders = null;
			// Stop listening to the events below
			this.undelegateEvents();

			register.getPubsub().unsubscribe('register.lang.ready', this.redraw, this);
		},
		
		redraw: function() {
			if(register.isDebug()) {
				console.log('temp - redraw');
			}
			// How to force the collection to be re-rendered?
			this.riders.each(function(rider, index){
				rider.trigger('render')
			});
		},
		
		events: {
			click: function() {
				var modalContent = new ModalContentView({model: this.model}).render();
				var modal = register.getModal();
				
				modal.addDataForRender(modalContent);
				modal.render();
				$(modal.el).modal();
				
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
			modal: ModalContentView,
			temp: TempView
		}
	};
});