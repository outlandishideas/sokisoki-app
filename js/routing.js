'use strict';

angular.module('sokisoki')

//	.config(function($routeProvider, ssUserAuth) {
//		var originalWhen = $routeProvider.when;
//
//		$routeProvider.when = function(path, route){
//			// always run the resolvers
//			if (!route.resolve) {
//				route.resolve = {};
//			}
//			route.resolve.checkUser = function() {
//				var u = ssUserAuth.get();
//				console.log('user');
//				console.log(u);
//			};
//
//			originalWhen(path, route);
//			return $routeProvider;
//		};
//	})

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
