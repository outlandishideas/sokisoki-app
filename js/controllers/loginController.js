'use strict';

/* Controllers */
angular.module('sokisoki')

.controller('LoginController', function($scope, $rootScope, sokiFacebook, sokiTwitter, sokiUserUtil, $location, sokiAppUtil, sokiEventHandler, sokiLogger) {
	sokiEventHandler.setBackButtonHandler(function(event) {
		sokiAppUtil.exit();
	});

	$scope.showTermsAndConditionsPanel = false;
	$scope.showTsAndCs = function() {
		$scope.showTermsAndConditionsPanel = true;
	};
	$scope.hideTsAndCs = function() {
		$scope.showTermsAndConditionsPanel = false;
	};

	$scope.showDebug = function() {
		$location.path('/debug/0');
	};

	$scope.signingIn = false;
	var signInCallback = function(err) {
		if(err) {
			sokiLogger.log('error signing in to sokisoki');
			sokiLogger.log(JSON.stringify(err));
			$scope.signingIn = false;
			return;
		}

		$location.path('/history');
	};

	$scope.facebookLogin = function() {
		$scope.signingIn = true;
		sokiFacebook.login()
			.then(function(data) {
				sokiLogger.log(data);
				sokiUserUtil.login('facebook', data.id, data.name, sokiFacebook.getAccessData(), signInCallback);
			}, function(data) {
				sokiLogger.log('error signing in to facebook');
				sokiLogger.log(data);
				sokiAppUtil.showNativeAlert('Error', 'Facebook login failed. Please try again');
				$scope.signingIn = false;
			});
	};

	$scope.twitterLogin = function() {
		$scope.signingIn = true;
		sokiTwitter.login()
			.then(function(data) {
				sokiUserUtil.login('twitter', data.id_str, data.screen_name, sokiTwitter.getAccessData(), signInCallback);
			}, function(data) {
				sokiLogger.log('error signing in to twitter');
				sokiLogger.log(data);
				sokiAppUtil.showNativeAlert('Error', 'Twitter login failed. Please try again');
				$scope.signingIn = false;
			});
	};
})

;



                     