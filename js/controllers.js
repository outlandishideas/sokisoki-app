'use strict';

/* Controllers */
angular.module('sokisoki')

.controller('OnboardController', function($scope, $rootScope, $location, ssUserUtil, sokiEventHandler) {
		sokiEventHandler.setBackButtonHandler(function(event) {
		$rootScope.$apply(function() {
			ssUserUtil.setOnboarded();
			$location.path('/history');
		});
	});

	$scope.finished = function() {
		ssUserUtil.setOnboarded();
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
.controller('UserController', function($scope, $rootScope, $location, sokiScanner, ssUserUtil, sokiEventHandler, ssAppUtil) {
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

.controller('ProductController', function($scope, $rootScope, $controller, $location, $routeParams, sokiEventHandler, $timeout, sokiBarcode, sokiConfig, ssAppUtil) {
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

	$scope.barcode = {
		code: sokiBarcode.get('barcode'),
		brand: sokiBarcode.get('brand'),
		description: sokiBarcode.get('description'),
		hashtag: sokiBarcode.get('hashtag'),
		content: content
	};

	$scope.openUrl = ssAppUtil.openExternalUrl;

	$scope.actions = [_actions.want, _actions.love, _actions.buy];

	$scope.youtubeEmbed = function(id) {
		return 'http://www.youtube.com/embed/' + id + '?showinfo=0&modestbranding=1&fs=0&rel=0&showinfo=0';
	};

	$scope.performAction = function(action) {
		if ($scope.toast.promise) {
			$timeout.cancel($scope.toast.promise);
		}
		sokiBarcode.doAction($routeParams.barcode, action.present, function() {
			$scope.toast.message = action.alert;
			$scope.toast.action = action.present;
			$scope.toast.promise = $timeout(function() {
				$scope.toast.message = '';
			}, 3000);
		});
	};
})

.controller('HistoryController', function($scope, $rootScope, $location, $controller, sokiEventHandler, ssAppUtil, ssUserUtil, sokiConfig) {
	// call base controller
	$controller('UserController', {$scope: $scope});

	$scope.menuState = {
		title: 'History',
		show: false
	};

		sokiEventHandler.setBackButtonHandler(function(event) {
		$scope.$apply(function() {
			if (!$scope.menuState.toggleMenu(false)) {
				ssAppUtil.exit();
			}
		});
	});

	$scope.showEvent = function(event) {
		$location.path('/product/' + event.barcode);
	};

	var ACTIONS = sokiConfig.get('ACTIONS');
	var history = ssUserUtil.getHistory();
	history.sort(function(a, b) {
		return a.date > b.date ? -1 : 1;
	});

	$scope.history = history;
})

.controller('LoginController', function($scope, $rootScope, sokiFacebook, ssTwitter, ssUserUtil, $location, ssAppUtil, sokiEventHandler, log) {
	sokiEventHandler.setBackButtonHandler(function(event) {
		ssAppUtil.exit();
	});

	$scope.showTermsAndConditionsPanel = false;
	$scope.showTsAndCs = function() {
		$scope.showTermsAndConditionsPanel = true;
	};
	$scope.hideTsAndCs = function() {
		$scope.showTermsAndConditionsPanel = false;
	};

	$scope.signingIn = false;
	var signInCallback = function(err) {
		if(err) {
			log('error signing in to sokisoki');
			log(JSON.stringify(err));
			$scope.signingIn = false;
			return;
		}

		$location.path('/history');
	};

	$scope.facebookLogin = function() {
		$scope.signingIn = true;
		sokiFacebook.login()
			.then(function(data) {
				log(data);
				ssUserUtil.login('facebook', data.id, data.name, signInCallback);
			}, function(data) {
				log('error signing in to facebook');
				log(data);
				$scope.signingIn = false;
			});
	};

	$scope.twitterLogin = function() {
		$scope.signingIn = true;
		ssTwitter.login()
			.then(function(data) {
				ssUserUtil.login('twitter', data.id_str, data.screen_name, signInCallback);
			}, function(data) {
				console.log('error signing in to twitter');
				$scope.signingIn = false;
			});
	};
})

//.controller('NotificationCtrl', function ($scope, $cordovaDialogs, $cordovaVibration) {
//    $scope.alertNotify = function() {
//	    var msg = 'Alert success!';
//	    $cordovaDialogs.alert("Test Alert","Popup","OK")
//		    .then(function() {console.log(msg); });
//    };
//
//    $scope.beepNotify = function() {
//	    $cordovaDialogs.beep(1);
//    };
//
//    $scope.vibrateNotify = function() {
//	    $cordovaVibration.vibrate(3000);
//    };
//
//    $scope.confirmNotify = function() {
//	    $cordovaDialogs.confirm("My Confirmation","Are you sure?",["Yes","No"])
//		    .then(function(a, b, c){
//			    console.log("Confirm Success", a);
//			    console.log(a);
//			    console.log(b);
//			    console.log(c);
//		    });
//    };
//})

//.controller('GeolocationCtrl', function ($scope,navSvc,$rootScope) {
//    navigator.geolocation.getCurrentPosition(function(position) {
//        $scope.position=position;
//        $scope.$apply();
//        },function(e) { console.log("Error retrieving position " + e.code + " " + e.message) });
//
//    $scope.back = function () {
//        navSvc.back();
//    };
//}
//
//.controller('AccelerCtrl', function($scope) {
//    navigator.accelerometer.getCurrentAcceleration(function (acceleration) {
//        $scope.acceleration  = acceleration;
//        },function(e) { console.log("Error finding acceleration " + e) });
//})
//
//.controller('DeviceCtrl', function ($scope) {
//    $scope.device = device;
//})
//
//.controller('CompassCtrl', function ($scope) {
//    navigator.compass.getCurrentHeading(function (heading) {
//        $scope.heading  = heading;
//        $scope.$apply();
//    },function(e) { console.log("Error finding compass " + e.code) });
//})
//
//.controller('HackerNewsCtrl', function ($scope, $rootScope) {
//
//    // load in data from hacker news unless we already have
//    if (!$rootScope.items) {
//
//        jx.load('http://api.ihackernews.com/page',function(data){
//            console.log(JSON.stringify(data));
//            $rootScope.items = data.items;
//            $scope.$apply();
//        },'json');
//
//    } else {
//        console.log('data already loaded');
//    }
//
//    $scope.loadItem = function(item) {
//        navigator.notification.alert(item.url,function() {console.log("Alert success")},"My Alert","Close");
//    };
//})
//
//.controller('ContactsCtrl', function ($scope) {
//    $scope.find = function() {
//        $scope.contacts = [];
//        var options = new ContactFindOptions();
//        //options.filter=""; //returns all results
//        options.filter=$scope.searchTxt;
//        options.multiple=true;
//        var fields = ["displayName", "name", "phoneNumbers"];
//        navigator.contacts.find(fields,function(contacts) {
//            $scope.contacts=contacts;
//            $scope.$apply();
//        },function(e){console.log("Error finding contacts " + e.code)},options);
//    }
//})
//
//.controller('CameraCtrl', function ($scope) {
//    $scope.takePic = function() {
//        var options =   {
//            quality: 50,
//            destinationType: Camera.DestinationType.DATA_URL,
//            sourceType: 1,      // 0:Photo Library, 1=Camera, 2=Saved Photo Album
//            encodingType: 0     // 0=JPG 1=PNG
//        };
//        // Take picture using device camera and retrieve image as base64-encoded string
//        navigator.camera.getPicture(onSuccess,onFail,options);
//    };
//    var onSuccess = function(imageData) {
//        console.log("On Success! ");
//        $scope.picData = "data:image/jpeg;base64," +imageData;
//        $scope.$apply();
//    };
//    var onFail = function(e) {
//        console.log("On fail " + e);
//    };
//})

;



                     