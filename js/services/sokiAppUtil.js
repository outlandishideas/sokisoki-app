angular
	.module('sokisoki')
	.factory('sokiAppUtil', function() {
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
			},
			oauth: function() {
				return window.OAuth;
			}
		};
	})

;