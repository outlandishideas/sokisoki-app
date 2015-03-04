'use strict';

angular.module('sokisoki')

	.config(['$routeProvider', function($routeProvider) {
		// add an additional resolver to all routes, which checks the user login and redirects if necessary
		var originalWhen = $routeProvider.when;

		$routeProvider.when = function(path, route){
			if (!route.resolve) {
				route.resolve = {};
			}

			route.resolve.getConfig = function($q, sokiConfig) {
				var defer = $q.defer();

				sokiConfig.load(function(err) {
					if(err) {
						defer.reject();
						return;
					}

					defer.resolve();
				});
			};

			route.resolve.checkLogin = function(sokiUserUtil) {
				return sokiUserUtil.checkStatus(path);
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
		.when('/debug/:showMenu', {
	        templateUrl: 'views/debug.html',
	        controller: 'DebugController'
        })
        .when('/history', {
	        templateUrl: 'views/history.html',
	        controller: 'HistoryController',
	        resolve: {
		        loadHistory: function($q, sokiUserUtil, sokiLogger) {
			        var defer = $q.defer();

			        sokiUserUtil.updateHistory(function(err) {
				        sokiLogger.log('finished updating history');
				        defer.resolve();
			        });

			        return defer.promise;
		        }
	        }
        })
        .when('/onboard', {
	        templateUrl: 'views/onboard.html',
	        controller: 'OnboardController'
        })
        .when('/product-unknown/:barcode', {
	        templateUrl: 'views/product-unknown.html',
	        controller: 'ProductUnknownController'
        })
        .when('/product/:barcode/:arg?', {
	        templateUrl: 'views/product.html',
	        controller: 'ProductController',
			resolve: {
				loadBarcode: function($q, $route, $location, sokiBarcode) {
					var defer = $q.defer();
					var barcode = $route.current.params.barcode;

					// load the information about the barcode, but redirect to product-unknown on error
					sokiBarcode.load(barcode, function(err) {
						if(err) {
							defer.reject();
							$location.path('/product-unknown/' + barcode);
							return;
						}

						defer.resolve();
					});

					return defer.promise;
				}
			}
        })
        .when('/terms-and-conditions', {
	        templateUrl: 'views/termsAndConditions.html',
	        controller: 'TermsAndConditionsController'
        })
//        $routeProvider.when('/view1', {
//	        templateUrl: 'partials/notificationView.html'
//        });
        .otherwise({redirectTo: '/login'});
	})

;
