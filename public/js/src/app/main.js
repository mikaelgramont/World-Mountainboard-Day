/******************************************************************************
 * js/src/app/main.js
 * Point of entry into the application
 *****************************************************************************/
define('app', ['jquery','underscore','backbone'], function($, _, Backbone){
	console.log('js/src/app/main.js - defining app')
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
});