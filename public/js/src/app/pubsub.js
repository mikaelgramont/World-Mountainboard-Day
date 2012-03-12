/******************************************************************************
 * js/src/app/pubsub.js
 *
 * Pubsub module to share events across the application
 *****************************************************************************/
define([
        // Libraries
        'backbone',
        
    	// Application modules
    	'../app/register'
        
    ], function(Backbone, register){
	
	var pubsub = Backbone.Model.extend({
		publish: function() {
			if(register.isDebug()) {
				console.info('pubsub - publishing', arguments);
			}
			return this.trigger.apply(this, arguments);
		},
		
		subscribe: function() {
			if(register.isDebug()) {
				console.info('pubsub - subscribing', arguments);
			}
			return this.bind.apply(this, arguments);
		}
	});
	
	return pubsub;
});