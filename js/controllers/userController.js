'use strict';

/* Controllers */
angular.module('sokisoki')

// base controller for all logged-in screens
.controller('UserController', function($scope, $rootScope, $location, sokiScanner, sokiUserUtil, sokiEventHandler, sokiAppUtil) {
	sokiEventHandler.setBackButtonHandler(function(event) {
		$scope.$apply(function() {
			if (!$scope.menuState || !$scope.menuState.toggleMenu(false)) {
				$location.path('/history');
			}
		});
	});
})
;



                     