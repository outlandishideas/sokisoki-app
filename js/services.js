'use strict';

/* Services */

angular.module('sokisoki')

	.factory('ssOauth', function() {
		return window.OAuth;
	})

	.factory('ssScanner', function() {
		return typeof cordova != 'undefined' ? cordova.require("cordova/plugin/BarcodeScanner") : null;
	})

	.factory('ssAppUtil', function() {
		return {
			exit: function() {
				if (navigator.app){
					navigator.app.exitApp();
				} else if(navigator.device){
					navigator.device.exitApp();
				}
			}
		};
	})

	.factory('ssEventHandler', function() {
		var handlers = {
			backbutton: null
		};
		var service = {};
		service.setHandler = function(action, handler) {
			console.log('setting handler for ' + action);
			console.log(handler);
			if (handlers[action]) {
				document.removeEventListener(action, handlers[action]);
			}
			if (handler) {
				document.addEventListener(action, handler);
			}
			handlers[action] = handler;
		};
		service.clearHandler = function(action) {
			service.setHandler(action, null);
		};
		service.setBackButtonHandler = function(handler) {
			service.setHandler('backbutton', handler);
		};
		service.clearBackButtonHandler = function() {
			service.clearHandler('backbutton');
		};
		return service;
	})

	.factory('ssUserAuth', ['$q', 'ssDb', '$location', function($q, ssDb, $location) {
		var service = {};

		service.hasOnboarded = function() {
			return ssDb.get('onboarded');
		};
		service.setOnboarded = function() {
			ssDb.set('onboarded', true);
		};
		service.getUser = function() {
			console.log('getting user');
			return ssDb.get('tmp');
		};
		service.setUser = function(value, type) {
			console.log('setting user');
			console.log(JSON.stringify(value));
			console.log(type);
			ssDb.set('tmp', {
				user: value,
				type: type
			});
		};
		service.clearUser = function() {
			console.log('clearing user');
			ssDb.remove('tmp');
			ssDb.remove('onboarded');
		};

		if (typeof cordova == 'undefined') {
			// when running in browser, allow all routes
			service.checkStatus = function(path, route) {
				console.log(path + ': allowing user through');
			}
		} else {
			service.checkStatus = function(path) {
				var defer = $q.defer();
				var newPath = null;
				switch (path) {
					case '/home':
						if (!service.getUser()) {
							console.log('cannot access home: no user');
							newPath = '/login';
						} else if (!service.hasOnboarded()) {
							console.log('cannot access home: not onboarded');
							newPath = '/onboard';
						}
						break;
					case '/login':
						if (service.getUser()) {
							console.log('cannot access login: already logged in');
							newPath = '/home';
						}
						break;
					case '/onboard':
						if (!service.getUser()) {
							console.log('cannot access onboard: no user');
							newPath = '/login';
						}
						break;
				}
				if (newPath) {
					$location.path(newPath);
					defer.reject();
				} else {
					defer.resolve();
				}
				return defer.promise;
			};
		}

		return service;
	}])

	.factory('ssDb', function() {
		var db = window.localStorage;
		return {
			get: function(key) {
				return db.getItem(key);
			},
			set: function(key, value) {
				db.setItem(key, value);
			},
			remove: function(key) {
				db.removeItem(key);
			},
			clear: function() {
				db.clear();
			}
		};
	})

	.factory('ssFacebook', ['$q', function($q) {
		return {
			login: function() {
				var q = $q.defer();

				facebookConnectPlugin.login([],
					function (res) {
						q.resolve(res);
					}, function (res) {
						q.reject(res);
					});

				return q.promise;
			}
		};
	}])

	.factory('ssTwitter', ['$q', '$rootScope', 'ssOauth', function($q, $rootScope, ssOauth) {
		var options = {
			consumerKey: 'e7zQ94khCDqEmOkT2Gluiu1OB', // YOUR Twitter CONSUMER_KEY
			consumerSecret: 'vYGYsD0yAVgfzxvrtnKmHxTkoCo4jtCsauxOSV02XYnR8slGKg', // YOUR Twitter CONSUMER_SECRET
			callbackUrl: "http://localhost" //this doesn't matter, as anything going here is intercepted
		};

		var currentData = {
			deferred: null,
			requestParams: null,
			oauth: ssOauth(options),
			accessParams: {}
		};

		var onError = function(data) {
			console.log("ERROR: "+JSON.stringify(data));
			var args = JSON.parse(data.text);
			$rootScope.$apply(function() {
				var d = currentData.deferred;
				currentData.deferred = null;
				d.reject(args);
			});
		};

		var promptForLogin = function(data) {
			currentData.requestParams = data.text;
			currentData.authWindow = window.open('https://api.twitter.com/oauth/authorize?'+currentData.requestParams, '_blank', 'location=no,toolbar=no');
			if (currentData.authWindow) {
				currentData.authWindow.addEventListener('loadstart', listenForLocation);
			} else {
				console.log('login not possible');
			}
		};

		// called by promptForLogin, above, to look for query parameters
		var listenForLocation = function(e) {
			console.log('twitter: location changed');
			console.log(e.url);
			if (e.url.indexOf(options.callbackUrl) >= 0) {
				var params = e.url.substr(e.url.indexOf('?') + 1);

				params = params.split('&');
				for (var i = 0; i < params.length; i++) {
					var y = params[i].split('=');
					if(y[0] === 'oauth_verifier') {
						currentData.authWindow.close();
						currentData.oauth.get('https://api.twitter.com/oauth/access_token?oauth_verifier='+y[1]+'&'+currentData.requestParams, getUserInfo, onError);
						break;
					} else if (y[0] === 'denied') {
						//todo: test this
						currentData.authWindow.close();
						onError(params);
						break;
					}
				}
			}
		};

		var getUserInfo = function(data) {
			currentData.accessParams = {};
			var qvars_tmp = data.text.split('&');
			for (var i = 0; i < qvars_tmp.length; i++) {
				var y = qvars_tmp[i].split('=');
				currentData.accessParams[y[0]] = decodeURIComponent(y[1]);
			}
			currentData.oauth.setAccessToken([currentData.accessParams.oauth_token, currentData.accessParams.oauth_token_secret]);
			currentData.oauth.get('https://api.twitter.com/1.1/account/verify_credentials.json?skip_status=true', onComplete, onError);
		};

		var onComplete = function(data) {
			var args = JSON.parse(data.text);
			$rootScope.$apply(function() {
				var d = currentData.deferred;
				currentData.deferred = null;
				d.resolve(args);
			});
		};

		return {
			login: function() {
				if (currentData.deferred) {
					currentData.deferred.reject('started again');
				}
				currentData.deferred = $q.defer();
				currentData.requestParams = null;
				currentData.oauth.get('https://api.twitter.com/oauth/request_token', promptForLogin, onError);
				return currentData.deferred.promise;
			}
		};
	}])


;