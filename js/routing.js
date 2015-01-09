'use strict';

angular.module('sokisoki')

	.config(['$routeProvider', function($routeProvider) {
		// add an additional resolver to all routes, which checks the user login and redirects if necessary
		var originalWhen = $routeProvider.when;

		$routeProvider.when = function(path, route){
			if (!route.resolve) {
				route.resolve = {};
			}

			route.resolve.checkLogin = function(ssUserUtil) {
				return ssUserUtil.checkStatus(path);
			};

			originalWhen.call($routeProvider, path, route);

			return $routeProvider;
		};
	}])

	.config(function($routeProvider) {
        $routeProvider.when('/login', {
	        templateUrl: 'views/login.html',
	        controller: 'LoginController'
        })
//        .when('/home', {
//	        templateUrl: 'views/home.html',
//	        controller: 'HomeController'
//        })
        .when('/history', {
	        templateUrl: 'views/history.html',
	        controller: 'HistoryController'
        })
        .when('/onboard', {
	        templateUrl: 'views/onboard.html',
	        controller: 'OnboardController'
        })
        .when('/product/:barcode', {
	        templateUrl: 'views/product.html',
	        controller: 'ProductController'
        })
        .when('/terms-and-conditions', {
	        templateUrl: 'views/termsAndConditions.html',
	        controller: 'TermsAndConditionsController'
        })
//        $routeProvider.when('/view1', {
//	        templateUrl: 'partials/notificationView.html'
//        });
        .otherwise({redirectTo: '/history'});
	})

;
