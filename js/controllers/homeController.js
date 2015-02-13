'use strict';

/* Controllers */
angular.module('sokisoki')

.controller('HomeController', function($scope, $rootScope, $controller) {
	// call base controller
	$controller('UserController', {$scope: $scope});

	$scope.copyright = new Date();

	$scope.showInfo = function () {
		$rootScope.showInfoPanel = true;
	};
	$scope.hideInfo = function () {
		$rootScope.showInfoPanel = false;
	};
})
;



                     