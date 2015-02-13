'use strict';

/* Controllers */
angular.module('sokisoki')

.controller('OnboardController', function($scope, $rootScope, $location, sokiUserUtil, sokiEventHandler) {
	sokiEventHandler.setBackButtonHandler(function(event) {
		$rootScope.$apply(function() {
			sokiUserUtil.setOnboarded();
			$location.path('/history');
		});
	});

	$scope.finished = function() {
		sokiUserUtil.setOnboarded();
		$location.path('/history');
	};

	$scope.slides = [
		{
			title: 'Find',
			text: 'Look out for the soki soki marker on selected products.',
			icon: 'binoculars'
		},
		{
			title: 'Scan',
			text: 'When you\'ve picked out a product scan the barcode.',
			icon: 'barcode'
		},
		{
			title: 'Explore',
			text: 'Enjoy the product\'s special content delivered to your device.',
			icon: 'life-saver'
		},
		{
			title: 'Share',
			text: 'Let your friends know that you unlocked content via your social network.',
			icon: 'share-alt'
		}
	];
})
;



                     