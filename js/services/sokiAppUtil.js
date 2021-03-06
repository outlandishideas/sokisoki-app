angular
	.module('sokisoki')
	.factory('sokiAppUtil', function() {
		return {
			os: function() {
				if (typeof device != 'undefined' && typeof device.platform != 'undefined') {
					return device.platform;
				}
				return '';
			},
			exit: function() {
				if (navigator.app){
					navigator.app.exitApp();
				} else if(navigator.device){
					navigator.device.exitApp();
				}
			},
			openExternalUrl: function(url) {
				window.open(url, "_system");
			},
			showNativeAlert: function(title, message) {
				if (typeof navigator !== "undefined" && navigator.notification) {
					navigator.notification.alert(message, null, title);
				} else {
					window.alert(message);
				}
			},
			showNativeConfirm: function(title, message, callback) {
				if (typeof navigator !== "undefined" && navigator.notification) {
					navigator.notification.confirm(message, callback, title, ['Yes', 'No']);
				} else {
					var result = window.confirm(message);
					if (callback) {
						callback(result);
					}
				}
			},
			oauth: function() {
				// taken from https://github.com/bytespider/jsOAuth
				// see http://bytespider.github.io/jsOAuth/api-reference/ for references
				return window.OAuth;
			},
			parseDate: function(dateString) {
				var regex = /([0-9]{4})-([0-9]{2})-([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})/g;
				var m = regex.exec(dateString);
				if (m && m.length == 7) {
					return new Date(m[2] + '/' + m[3] + '/' + m[1] + ', ' + m[4] + ':' + m[5] + ':' + m[6]);
				}
				return null;
			}
		};
	})

;