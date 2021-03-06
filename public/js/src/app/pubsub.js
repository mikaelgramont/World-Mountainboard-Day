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
	
	return Backbone.Model.extend({
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
		},
		
		unsubscribe: function() {
			if(register.isDebug()) {
				console.info('pubsub - unsubscribing', arguments);
			}
			return this.unbind.apply(this, arguments);
		}
	});
});