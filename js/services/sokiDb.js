angular
	.module('sokisoki')
	.factory('sokiDb', function() {
		var db = window.localStorage;
		return {
			get: function(key) {
				return JSON.parse(db.getItem(key));
			},
			set: function(key, value) {
				db.setItem(key, JSON.stringify(value));
			},
			remove: function(key) {
				db.removeItem(key);
			},
			clear: function() {
				db.clear();
			}
		};
	});