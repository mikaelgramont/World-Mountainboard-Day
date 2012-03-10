/******************************************************************************
 * js/src/app/register.js
 *
 * Module that stores global data and objects
 *****************************************************************************/
define([], function(){
	
	var data = {
		// By default, no session id
		apiSessionId: null,
		// The url to the rest api
		apiUrl: null,
		// Whether to use debug methods
		debug: false,
		// The language currently being used
		lang: 'en',
		// The rider object
		rider: {},
		// The name of the GET parameter for session management
		apiSessionKey: 'PHPSESSID'
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
		
		getApiResourceUrl: function(resource, params) {
			if(typeof params == 'undefined') {
				params = {};
			}
			
			if(typeof apiResourceUrls[resource] == 'undefined') {
				throw new Error('No url defined for resource "' + resource + '"');
			}
			
			var url = '//' + this.getApiUrl() + '/' + apiResourceUrls[resource] + '/';
			
			if(this.getApiSessionId()) {
				params[this.get('apiSessionKey')] = this.getApiSessionId();
			}
			
			var querystring = [];
			for(var key in params) {
				querystring.push(encodeURIComponent(key) + "=" + encodeURIComponent(params[key]));
			}
			if(querystring.length > 0) {
				url += '?' + querystring.join('&');
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