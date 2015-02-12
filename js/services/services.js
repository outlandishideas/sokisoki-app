'use strict';

angular
	.module('sokisoki')

	.factory('ssOauth', function() {
		return window.OAuth;
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
			},
			showAlert: function(title, message) {
				if (typeof navigator !== "undefined" && navigator.notification) {
					navigator.notification.alert(message, null, title);
				} else {
					window.alert(message);
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