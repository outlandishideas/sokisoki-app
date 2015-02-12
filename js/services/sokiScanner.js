angular
	.module('sokisoki')
	.factory('sokiScanner', function($timeout, log) {
		if (typeof cordova != 'undefined') {
			return cordova.require("cordova/plugin/BarcodeScanner");
		}
		// create a fake one
		return {
			scan: function(callback) {
				var barcodes = ['1234', '5060020474859', '0000'];
				var index = Math.floor(Math.random() * barcodes.length);
				var barcode = barcodes[index];
				log('Faking a scan (' + barcode + ')');
				if (callback) {
					$timeout(function() {
						callback({
							text: barcode
						});
					}, 1000);
				}
			}
		};
	})

;