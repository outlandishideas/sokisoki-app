'use strict';

/* Controllers */
angular.module('sokisoki')

.controller('ProductUnknownController', function($scope, $rootScope, $controller, $routeParams) {

	// call base controller
	$controller('UserController', {$scope: $scope});

	$scope.menuState = {
		title: $routeParams.barcode,
		show: false
	};
})
;
