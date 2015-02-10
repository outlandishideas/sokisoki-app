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

	.run(['$rootScope', 'ssEventHandler', function ($rootScope, ssEventHandler) {
		$rootScope.$on('$routeChangeStart', function (event) {
			ssEventHandler.clearBackButtonHandler();
		});
	}])

	.value('log', function(msg) {
		var e = new Error('dummy');
		var stack = e.stack.replace(/^[^\(]+?[\n$]/gm, '')
			.replace(/^\s+at\s+/gm, '')
			.replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@')
			.split('\n');
		var regex = /(.+)\s*\((.+):([0-9]+):([0-9]+)\)/g;
		var args = regex.exec(stack[0]);
		var file = args[2].split('/').slice(-2).join('/');
		console.log('SOKI_DEBUG: ' + file + ' line ' + args[3] + ' :: ' + msg);
	})

	.config(function($sceDelegateProvider) {
		$sceDelegateProvider.resourceUrlWhitelist([
			'self',
			'http://www.youtube.com/**',
			'https://www.youtube.com/**'
		]);
	})
;
