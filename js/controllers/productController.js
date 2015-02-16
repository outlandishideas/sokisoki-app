'use strict';

/* Controllers */
angular.module('sokisoki')

.controller('ProductController', function($scope, $rootScope, $controller, $location, $routeParams, $timeout,
                                          sokiEventHandler, sokiBarcode, sokiConfig, sokiAppUtil, sokiUserUtil, sokiTwitter, sokiFacebook) {
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
		value.date = sokiAppUtil.parseDate(value.date);
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
			var user = sokiUserUtil.get();
			var sharer = null;
			if (user.userType == 'facebook') {
				sharer = sokiFacebook.share;
			} else if (user.userType == 'twitter') {
				sharer = sokiTwitter.share;
			}
			if (sharer) {
				sharer(message, user.accessData);
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
;
