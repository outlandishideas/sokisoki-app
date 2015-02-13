'use strict';

/* Controllers */
angular.module('sokisoki')

.controller('TermsAndConditionsController', function($scope, $controller) {
	// call base controller
	$controller('UserController', {$scope: $scope});

	$scope.menuState = {
		title: 'T\'s & C\'s',
		show: false
	};

})
;



                     