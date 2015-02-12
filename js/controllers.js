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

.controller('TermsAndConditionsController', function($scope, $controller) {
	// call base controller
	$controller('UserController', {$scope: $scope});

	$scope.menuState = {
		title: 'T\'s & C\'s',
		show: false
	};

})

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

.controller('ProductController', function($scope, $rootScope, $controller, $location, $routeParams, sokiEventHandler, $timeout, sokiBarcode, sokiConfig, sokiAppUtil) {
	var _actions = sokiConfig.get('ACTIONS');

	// call base controller
	$controller('UserController', {$scope: $scope});

	$scope.menuState = {
		title: sokiBarcode.get('brand'),
		show: false
	};
	$scope.toast = {
		message: '',
		action: '',
		classes: function() {
			return ($scope.toast.message ? 'open ' : 'closed ') + $scope.toast.action;
		},
		promise: null
	};

	var content = sokiBarcode.get('metadata');
	content.sort(function(a, b) {
		return parseInt(a.seq) - parseInt(b.seq);
	});

	var history = sokiBarcode.get('history');
	angular.forEach(history, function(value, key) {
		value.date = new Date(value.date);
		if (value.action in _actions) {
			value.action = _actions[value.action];
		}
	});
	history.sort(function(a, b) {
		return a.date > b.date ? -1 : 1;
	});

	$scope.barcode = {
		code: sokiBarcode.get('barcode'),
		brand: sokiBarcode.get('brand'),
		description: sokiBarcode.get('description'),
		hashtag: sokiBarcode.get('hashtag'),
		content: content,
		history: history
	};

	$scope.share = {
		action: null,
		message: '',
		classes: function() {
			return $scope.share.action ? $scope.share.action.present + ' open' : 'closed';
		},
		show: function(action) {
			$scope.share.action = action;
			var msg = $scope.share.action.message;
			if ($scope.barcode.hashtag) {
				msg += ' #' + $scope.barcode.hashtag;
			}
			$scope.share.message = msg;
		},
		hide: function() {
			$scope.share.action = null;
			$scope.share.message = '';
		},
		send: function() {
			var action = $scope.share.action;
			var message = $scope.share.message;
			$scope.share.hide();
			if ($scope.toast.promise) {
				$timeout.cancel($scope.toast.promise);
			}
			sokiBarcode.doAction($routeParams.barcode, action.present, {message: message}, function() {
				$scope.toast.message = action.alert;
				$scope.toast.action = action.present;
				$scope.toast.promise = $timeout(function() {
					$scope.toast.message = '';
				}, 2000);
			});
		}
	};
	$scope.performedActions = sokiBarcode.get('user_actions');

	$scope.openUrl = sokiAppUtil.openExternalUrl;

	$scope.actions = [_actions.want, _actions.love, _actions.buy];

	$scope.youtubeEmbed = function(id) {
		return 'http://www.youtube.com/embed/' + id + '?showinfo=0&modestbranding=1&fs=0&rel=0&showinfo=0';
	};

	$scope.performAction = function(action) {
		if ($scope.share.action) {
			$scope.share.hide();
			$timeout(function() {
				$scope.share.show(action);
			}, 200);
		} else {
			$scope.share.show(action);
		}
	};
})

.controller('HistoryController', function($scope, $rootScope, $location, $controller, sokiEventHandler, sokiAppUtil, sokiUserUtil, sokiConfig) {
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
})

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
				sokiUserUtil.login('facebook', data.id, data.name, signInCallback);
			}, function(data) {
				sokiLogger.log('error signing in to facebook');
				sokiLogger.log(data);
				sokiAppUtil.showAlert('Error', 'Facebook login failed. Please try again');
				$scope.signingIn = false;
			});
	};

	$scope.twitterLogin = function() {
		$scope.signingIn = true;
		sokiTwitter.login()
			.then(function(data) {
				sokiUserUtil.login('twitter', data.id_str, data.screen_name, signInCallback);
			}, function(data) {
				sokiLogger.log('error signing in to twitter');
				sokiLogger.log(data);
				sokiAppUtil.showAlert('Error', 'Twitter login failed. Please try again');
				$scope.signingIn = false;
			});
	};
})

.controller('DebugController', function($scope, $location, $routeParams, sokiLogger) {
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
	$scope.login = function() {
		$location.path('/login');
	};
})
;



                     