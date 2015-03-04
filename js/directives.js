'use strict';

/* Directives */
angular.module('sokisoki')
    .directive('appVersion', ['version', function(version) {
        return function(scope, elm, attrs) {
          elm.text(version);
		}
	}])

	.directive('actionIcon', function(sokiConfig) {
		var ACTIONS = sokiConfig.get('ACTIONS');

		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				var args = scope.$eval(attrs.actionIcon);
				if (typeof args != 'undefined' && args.id && args.id in ACTIONS) {
					var icon = ACTIONS[args.id].faIcon;
					if (icon) {
						element.append('<span class="fa ' + icon + '"></span>')
							.addClass('action-icon');
					}
				}
			}
		}
	})

	.directive('sokiNavbar', ['$location', 'sokiScanner', 'sokiUserUtil', 'sokiBarcode', 'sokiConfig', function($location, sokiScanner, sokiUserUtil, sokiBarcode, sokiConfig) {
		return {
			restrict: 'E',
			scope: {
				state: '='
			},
			templateUrl: 'views/partials/nav.html',
			link: function(scope, element, attrs) {
				var ACTIONS = sokiConfig.get('ACTIONS');
				var state = scope.state;
				if (typeof state == 'undefined') {
					state = {
						title: 'no title',
						show: false
					}
				}
				if (typeof state.show == 'undefined') {
					state.show = false;
				}
				scope.scan = function() {
					sokiScanner.scan(function(result) {
						var scanned = result.text;
						sokiBarcode.doAction(scanned, ACTIONS.scan.id, {}, function() {
							//do nothing
						});
						scope.$apply(function() {
							$location.path('/product/' + scanned + '/scan');
						});
					});
				};
				scope.toggleMenu = function(show, source) {
					var oldShow = state.show;
					if (typeof show == 'undefined') {
						show = !oldShow;
					}
					state.show = show;
					scope.signOutTest = false;
					// return true if state has changed
					return show != oldShow;
				};
				// expose toggle menu to provider of state
				state.toggleMenu = scope.toggleMenu;
				scope.signOutCheck = function() {
					scope.signOutTest = true;
				};
				scope.signOutCancel = function() {
					scope.signOutTest = false;
				};

				var changePath = function(path) {
					scope.toggleMenu(false, path);
					$location.path(path);
				};
				scope.tsAndCs = function() {
					changePath('/terms-and-conditions');
				};
				scope.onboard = function() {
					changePath('/onboard');
				};
				scope.history = function() {
					changePath('/history');
				};
				scope.signOut = function() {
					scope.toggleMenu(false, 'sign out');
					sokiUserUtil.clearUser();
					$location.path('/login');
				};
				scope.showDebug = function() {
					changePath('/debug/1');
				};
			}
		}
	}])
;
