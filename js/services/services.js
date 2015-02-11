'use strict';

angular
	.module('sokisoki')

	.factory('ssOauth', function() {
		return window.OAuth;
	})

	.factory('ssScanner', function($timeout, log) {
		if (typeof cordova != 'undefined') {
			return cordova.require("cordova/plugin/BarcodeScanner");
		}
		// create a fake one
		return {
			scan: function(callback) {
				log('Faking a scan');
				if (callback) {
					$timeout(function() {
						callback({
							text: '1234'
						});
					}, 1000);
				}
			}
		};
	})

	.factory('ssAppUtil', function() {
		return {
			exit: function() {
				if (navigator.app){
					navigator.app.exitApp();
				} else if(navigator.device){
					navigator.device.exitApp();
				}
			},
			openExternalUrl: function(url) {
				if (typeof navigator !== "undefined" && navigator.app) {
					navigator.app.loadUrl(url, { openExternal:true });
				} else {
					window.open(url, "_blank");
				}
			}
		};
	})

	.factory('ssDb', function() {
		var db = window.localStorage;
		return {
			get: function(key) {
				return JSON.parse(db.getItem(key));
			},
			set: function(key, value) {
				db.setItem(key, JSON.stringify(value));
			},
			remove: function(key) {
				db.removeItem(key);
			},
			clear: function() {
				db.clear();
			}
		};
	});