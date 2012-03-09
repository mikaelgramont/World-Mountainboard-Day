/******************************************************************************
 * js/src/app/register.js
 *
 * Module that stores global data and objects
 *****************************************************************************/
define([], function(){
	
	var data = {
		apiSessionId: null, // By default, no session id
		apiUrl: null, 		// The url to the rest api
		debug: false, 		// Whether to use debug methods
		lang: 'en', 		// The language currently being used
		rider: {}			// The rider object
	};
	
	var apiResourceUrls = {
		'rider': 'riders',
		'session': 'sessions'
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
		
		getApiUrl: function() {
			return data.apiUrl;
		},
		
		setApiUrl: function(url) {
			this.set('apiUrl', url);
		},
		
		getApiResourceUrl: function(resource) {
			if(typeof apiResourceUrls[resource] == 'undefined') {
				throw new Error('No url defined for resource "' + resource + '"');
			}
			
			var url = '//' + this.getApiUrl() + '/' + apiResourceUrls[resource] + '/';
			if(this.getApiSessionId()) {
				url +=  '?PHPSESSID=' + this.getApiSessionId();
			}
			
			if(this.isDebug()) {
				console.log('register - url for ' + resource + ': ' + url);
			}
			
			return url;
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
		},
		
		data: data
	};
});