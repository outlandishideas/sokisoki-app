'use strict';

angular.module('sokisoki', ['ngTouch', 'ngRoute', 'ngCordova', 'ui.bootstrap', 'ngAnimate'])

	.value('version', '0.1')

	.filter('interpolate', ['version', function(version) {
		// replace %VERSION% with the version number via {{'%VERSION%' | interpolate}}.
		// alternatively use directive <span app-version></span>
		return function(text) {
			return String(text).replace(/\%VERSION\%/mg, version);
		}
	}])

//    .config(function ($compileProvider){
//        $compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
//    })

	.run(['$rootScope', 'sokiEventHandler', 'sokiLogger', function ($rootScope, sokiEventHandler, sokiLogger) {
		if (typeof device != 'undefined' && device.platform != 'Android' && typeof StatusBar != 'undefined' && StatusBar.hide) {
			StatusBar.hide();
		}
		$rootScope.$on('$routeChangeStart', function (event) {
			sokiEventHandler.clearBackButtonHandler();
		});
	}])

	.config(function($sceDelegateProvider) {
		$sceDelegateProvider.resourceUrlWhitelist([
			'self',
			'http://sokisoki.com/**',
			'http://api.twitter.com/**',
			'https://api.twitter.com/**',
			'http://www.sokisoki.com/**',
			'http://www.youtube.com/**',
			'https://www.youtube.com/**'
		]);
	})
;
