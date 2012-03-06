/******************************************************************************
 * js/src/app/register.js
 *
 * Module that stores global data and objects
 *****************************************************************************/
define([], function(){
	
	var data = {
		apiSessionId: null, // By default, no session id
		debug: false, 		// Whether to use debug methods
		lang: 'en', 		// The language currently being used
		rider: {}			// The rider object
	};
	
	/**************************************************************************
	 * MODULE INTERFACE 
	 *************************************************************************/
	return {
		set: function(key, value) {
			data[key] = value;
		},
		
		get: function(key) {
			return data[key];
		},
		
		getApiSessionId: function() {
			return data.apiSessionId;
		},
		
		setApiSessionId: function(id) {
			this.set('apiSessionId', id);
		},
		
		isDebug: function() {
			return data.debug;
		},
		
		setDebug: function(bool) {
			this.set('debug', !!bool);
		},
		
		getLang: function() {
			return data.lang;
		},
		
		setLang: function(lang) {
			this.set('lang', lang);
		},
		
		getRider: function() {
			return data.rider;
		},
		
		setRider: function(rider) {
			this.set('rider', rider);
		}
	};
});