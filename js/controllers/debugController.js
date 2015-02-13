'use strict';

/* Controllers */
angular.module('sokisoki')

.controller('DebugController', function($scope, $location, $routeParams, sokiLogger, sokiUserUtil) {
	if ($routeParams.showMenu == '1') {
		$scope.menuState = {
			title: 'Debug',
			show: false
		};
	} else {
		$scope.menuState = null;
	}

	$scope.logs = sokiLogger.getLogs();

	$scope.clearLogs = function() {
		sokiLogger.clearLogs();
		$scope.logs = sokiLogger.getLogs();
	};
	$scope.testLog = function() {
		sokiLogger.log('Testing');
	};
	$scope.back = function() {
		if (sokiUserUtil.get()) {
			$location.path('/history');
		} else {
			$location.path('/login');
		}
	};
})
;



                     