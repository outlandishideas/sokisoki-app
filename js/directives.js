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
				if (typeof args != 'undefined' && args.present) {
					var icon = null;
					switch (args.present) {
						case ACTIONS.scan.present:
							icon = 'barcode';
							break;
						case ACTIONS.buy.present:
							icon = 'shopping-cart';
							break;
						case ACTIONS.love.present:
							icon = 'heart';
							break;
						case ACTIONS.want.present:
							icon = 'star';
							break;
					}
					if (icon) {
						element.append('<span class="fa fa-' + icon + '"></span>')
							.addClass('action-icon');
					}
				}
			}
		}
	})

	.directive('sokiNavbar', ['$location', 'sokiScanner', 'ssUserUtil', 'sokiBarcode', 'sokiConfig', function($location, sokiScanner, ssUserUtil, sokiBarcode, sokiConfig) {
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
						sokiBarcode.doAction(scanned, ACTIONS.scan.present, function() {
							//do nothing
						});
						scope.$apply(function() {
							$location.path('/product/' + scanned);
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
					ssUserUtil.clearUser();
					$location.path('/login');
				};
			}
		}
	}])
;
