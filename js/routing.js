'use strict';

angular.module('sokisoki')

	.config(['$routeProvider', function($routeProvider) {
		// add an additional resolver to all routes, which checks the user login and redirects if necessary
		var originalWhen = $routeProvider.when;

		$routeProvider.when = function(path, route){
			if (!route.resolve) {
				route.resolve = {};
			}

			route.resolve.checkLogin = function(ssUserAuth) {
				return ssUserAuth.checkStatus(path);
			};

			originalWhen.call($routeProvider, path, route);

			return $routeProvider;
		};
	}])

	.config(function($routeProvider) {
        $routeProvider.when('/login', {
	        templateUrl: 'views/login.html',
	        controller: 'LoginController'
        });
        $routeProvider.when('/home', {
	        templateUrl: 'views/home.html',
	        controller: 'HomeController'
        });
        $routeProvider.when('/onboard', {
	        templateUrl: 'views/onboard.html',
	        controller: 'OnboardController'
        });
//        $routeProvider.when('/view1', {
//	        templateUrl: 'partials/notificationView.html'
//        });
        $routeProvider.otherwise({redirectTo: '/home'});
	})

;
