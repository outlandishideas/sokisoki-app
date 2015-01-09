'use strict';

/* Controllers */
angular.module('sokisoki')

.controller('OnboardController', function($scope, $rootScope, $location, ssUserUtil, ssEventHandler) {
	ssEventHandler.setBackButtonHandler(function(event) {
		$rootScope.$apply(function() {
			console.log(JSON.stringify(event));
			console.log('onboard back');
			ssUserUtil.setOnboarded();
			console.log('going home');
			$location.path('/history');
		});
	});

	$scope.finished = function() {
		console.log('finished');
		ssUserUtil.setOnboarded();
		console.log('going home');
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

	$scope.nextSlide = function() {
		console.log('next slide');
	};

	$scope.previousSlide = function() {
		console.log('previous slide');
	};
})

// base controller for all logged-in screens
.controller('UserController', function($scope, $rootScope, $location, ssScanner, ssUserUtil, ssEventHandler, ssAppUtil) {
	ssEventHandler.setBackButtonHandler(function(event) {
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

.controller('ProductController', function($scope, $rootScope, $controller, $location, $routeParams, ssEventHandler, $timeout, ACTIONS) {
	// call base controller
	$controller('UserController', {$scope: $scope});

	$scope.menuState = {
		title: 'Loading...',
		show: false
	};

	$scope.barcode = $routeParams.barcode;

	$scope.actions = [ ACTIONS.want, ACTIONS.love, ACTIONS.buy ];

	$scope.performAction = function(action) {
		console.log('performing action: ' + action.present);
	};

	//todo: tmp
	$timeout(function() {
		$scope.menuState.title = 'Braun';
	}, 1000);
})

.controller('HistoryController', function($scope, $rootScope, $location, $controller, ssEventHandler, ssAppUtil, ssUserUtil, ACTIONS) {
	// call base controller
	$controller('UserController', {$scope: $scope});

	$scope.menuState = {
		title: 'History',
		show: false
	};

	ssEventHandler.setBackButtonHandler(function(event) {
		$scope.$apply(function() {
			if (!$scope.menuState.toggleMenu(false)) {
				ssAppUtil.exit();
			}
		});
	});

	$scope.showEvent = function(event) {
		$location.path('/product/' + event.barcode);
	};
//	$scope.history = ssUserUtil.getHistory();
	var history = [
		{
			action: ACTIONS.buy,
			barcode: '1234',
			description: 'Braun Shaver',
			date: new Date('2014-12-10 00:00:00')
		},
		{
			action: ACTIONS.love,
			barcode: '1234',
			description: 'Braun Shaver',
			date: new Date('2014-12-12 00:00:00')
		},
		{
			action: ACTIONS.want,
			barcode: '1234',
			description: 'Braun Shaver',
			date: new Date('2014-12-15 00:00:00')
		},
		{
			action: ACTIONS.scan,
			barcode: '1234',
			description: 'Braun Shaver',
			date: new Date('2014-12-20 00:00:00')
		},
		{
			action: ACTIONS.scan,
			barcode: '1234',
			description: 'Braun Shaver',
			date: new Date('2014-12-26 00:00:00')
		},
		{
			action: ACTIONS.love,
			barcode: '1234',
			description: 'Braun Shaver',
			date: new Date('2015-01-01 00:00:00')
		},
		{
			action: ACTIONS.love,
			barcode: '1234',
			description: 'Braun Shaver',
			date: new Date('2015-01-01 00:00:00')
		},
		{
			action: ACTIONS.love,
			barcode: '1234',
			description: 'Braun Shaver',
			date: new Date('2015-01-01 00:00:00')
		},
		{
			action: ACTIONS.love,
			barcode: '1234',
			description: 'Braun Shaver',
			date: new Date('2015-01-01 00:00:00')
		},
		{
			action: ACTIONS.love,
			barcode: '1234',
			description: 'Braun Shaver',
			date: new Date('2015-01-01 00:00:00')
		},
		{
			action: ACTIONS.love,
			barcode: '1234',
			description: 'Braun Shaver',
			date: new Date('2015-01-01 00:00:00')
		},
		{
			action: ACTIONS.love,
			barcode: '1234',
			description: 'Braun Shaver',
			date: new Date('2015-01-01 00:00:00')
		}
	];
	history.sort(function(a, b) {
		return a.date > b.date ? -1 : 1;
	});
	$scope.history = history;
})

.controller('LoginController', function($scope, $rootScope, ssFacebook, ssTwitter, ssUserUtil, $location, ssAppUtil, ssEventHandler) {
	ssEventHandler.setBackButtonHandler(function(event) {
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
	$scope.facebookLogin = function() {
		$scope.signingIn = true;
		ssFacebook.login()
			.then(function(data) {
				ssUserUtil.setUser(data, 'facebook');
				$location.path('/history');
			}, function(data) {
				console.log('error signing in to facebook');
				$scope.signingIn = false;
			});
	};

	$scope.twitterLogin = function() {
		$scope.signingIn = true;
		ssTwitter.login()
			.then(function(data) {
				ssUserUtil.setUser(data, 'twitter');
				$location.path('/history');
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



                     