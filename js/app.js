'use strict';

angular.module('sokisoki', ['ngTouch', 'ngRoute', 'ngCordova', 'ui.bootstrap'])

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

	.run(['$rootScope', 'sokiEventHandler', function ($rootScope, sokiEventHandler) {
		if (StatusBar && StatusBar.hide) {
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
			'http://www.sokisoki.com/**',
			'http://www.youtube.com/**',
			'https://www.youtube.com/**'
		]);
	})
;
