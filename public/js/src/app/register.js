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
		lang: null,
		// The rider object
		rider: {},
		// The name of the GET parameter for session management
		apiSessionKey: null,
		// The pubsub module
		pubsub: null
	};
	
	var apiResourceUrls = {
		'rider': 'riders',
		'session': 'sessions'
	};
	
	var	set = function(key, value) {
		data[key] = value;
	};
	
	var get = function(key) {
		return data[key];
	};

	
	/**************************************************************************
	 * MODULE INTERFACE 
	 *************************************************************************/
	return {
		getApiSessionId: function() {
			return get('apiSessionId');
		},
		
		setApiSessionId: function(id) {
			set('apiSessionId', id);
		},
		
		getApiSessionKey: function() {
			return get('apiSessionKey');
		},
		
		setApiSessionKey: function(key) {
			set('apiSessionKey', key);
		},
		
		getApiUrl: function() {
			return get('apiUrl');
		},
		
		setApiUrl: function(url) {
			set('apiUrl', url);
		},
		
		getApiResourceUrl: function(resource, params, id) {
			if(typeof params == 'undefined') {
				params = {};
			}
			
			if(typeof apiResourceUrls[resource] == 'undefined') {
				throw new Error('No url defined for resource "' + resource + '"');
			}
			
			var url = '//' + this.getApiUrl() + '/' + apiResourceUrls[resource] + '/';
			
			if(id) {
				url += id + '/';
			}
			
			if(this.getApiSessionId()) {
				params[get('apiSessionKey')] = get('apiSessionId');
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
			return get('debug');
		},
		
		setDebug: function(bool) {
			set('debug', !!bool);
		},

		getLang: function() {
			return get('lang');
		},
		
		setLang: function(lang) {
			set('lang', lang);
		},
		
		getRider: function() {
			return get('rider');
		},
		
		setRider: function(rider) {
			set('rider', rider);
		},
		
		getPubsub: function() {
			return get('pubsub');
		},
		
		setPubsub: function(pubsub) {
			set('pubsub', pubsub);
		}
	};
});