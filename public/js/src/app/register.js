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
		pubsub: null,
		// The translations
		i18n: {},
		// The languages supported
		languages: {},
		// The only modal dialog instance
		modal: null,
		// The handle for current content name
		contentName: ''
		
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
			var i18n = get('i18n');
			var that = this; 
			var onLangReady = function(downloadedTranslations) {
				if(downloadedTranslations) {
					that.setI18n(lang, downloadedTranslations);
				}
				set('lang', lang);
				that.getPubsub().publish('register.lang.ready', lang);
			};
			
			if(i18n[lang]) {
				onLangReady();
			} else {
				require(['../bin/i18n-' + lang], onLangReady);
			}
		},
		
		setAvailableLanguages: function(languages) {
			set('languages', languages);
		},
		
		getAvailableLanguages: function() {
			return get('languages');
		},
		
		getI18n: function() {
			var i18n = get('i18n');
			var lang = this.getLang();
			return i18n[lang];
		},
		
		setI18n: function(lang, hash) {
			var decoratedHash = this.decorateForMustache(hash);
			var i18n = get('i18n');
			i18n[lang] = decoratedHash;
			set('i18n', i18n);
		},
		
		// Takes a hash as input, and adds a number of
		// functions to allow text manipulation in mustache templates
		decorateForMustache: function(obj) {
			// uc = uppercase
			obj.uc = function() {
				return function(text, render) {
					return render(text.toUpperCase());
				};
			};
			
			obj.lc = function() {
				return function(text, render) {
					return render(text.toLowerCase());
				};
			};
			
			obj.ucfirst = function() {
				return function(text, render) {
					var ret = text.charAt(0).toUpperCase();
				    return ret + text.substr(1);
				    return render(ret);
				};
			};
			
			return obj;
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
		},
		
		getModal: function() {
			return get('modal');
		},
		
		setModal: function(modal) {
			set('modal', modal);
		},
		
		getContentName: function() {
			return get('contentName');
		},
		
		setContentName: function(contentName) {
			set('contentName', contentName)
		}
	};
});