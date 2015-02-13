'use strict';

/* Controllers */
angular.module('sokisoki')

.controller('HistoryController', function($scope, $rootScope, $location, $controller, sokiEventHandler, sokiAppUtil, sokiUserUtil, sokiConfig, sokiLogger) {
	sokiLogger.log('In history controller');
	// call base controller
	$controller('UserController', {$scope: $scope});

	$scope.menuState = {
		title: 'History',
		show: false
	};

	sokiEventHandler.setBackButtonHandler(function(event) {
		$scope.$apply(function() {
			if (!$scope.menuState.toggleMenu(false)) {
				sokiAppUtil.exit();
			}
		});
	});

	$scope.showEvent = function(event) {
		$location.path('/product/' + event.barcode);
	};

	var ACTIONS = sokiConfig.get('ACTIONS');
	var history = sokiUserUtil.getHistory();
	history.sort(function(a, b) {
		return a.date > b.date ? -1 : 1;
	});

	$scope.history = history;
	sokiLogger.log('Finished history controller setup');
})
;



                     