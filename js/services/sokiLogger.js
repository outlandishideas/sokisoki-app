angular
	.module('sokisoki')
	.factory('sokiLogger', function(sokiAppUtil) {
		var _service = {};

		_service.logs = [];

		_service.clearLogs = function() {
			_service.logs = [];
		};

		_service.getLogs = function() {
			return _service.logs;
		};

		_service.log = function(msg) {
			try {
				if (typeof msg != 'string') {
					msg = JSON.stringify(msg);
				}
				var e = new Error('dummy');
				if (typeof e.stack != 'undefined') {
					var stack = e.stack;
					stack = stack.split('\n');
					stack.shift();
					var toLog = null;
					for (var i = 0; i < stack.length; i++) {
						var line = stack[i];
						var regex;
						if (line.slice(-1) == ')') {
							regex = /(.+)\s*\((.+):([0-9]+):([0-9]+)\)/g;
						} else {
							regex = /(.+)\s+(.+):([0-9]+):([0-9]+)/g;
						}
						var args = regex.exec(line);
						if (args == null) {
							var iosRegex = /(.+):([0-9]+):([0-9]+)/g;
							args = iosRegex.exec(line);
							args.unshift('unknown');
						}
						if (typeof args != 'undefined' && args != null && args.length >= 4) {
							var fileComponents = args[2].split('/');
							var filename = fileComponents[fileComponents.length - 1];
							if (filename != 'sokiLogger.js') {
								var lineOutput = {
									date: new Date(),
									file: fileComponents.slice(-2).join('/'),
									line: args[3],
									msg: msg
								};
								if (filename != 'cordova.js' && filename != 'angular.js') {
									// we've found a good match
									toLog = lineOutput;
									break;
								} else if (!toLog) {
									// we've found a non-logger match
									toLog = lineOutput;
								}
							}
						} else {
							sokiAppUtil.showNativeAlert('Failed to parse', stack[i]);
						}
					}
					if (toLog) {
						_service.logs.unshift(toLog);
						console.log('SOKI_DEBUG: ' + toLog.file + ' line ' + toLog.line + ' :: ' + toLog.msg);
					}
				} else {
					_service.logs.unshift({
						date: new Date(),
						file: '',
						line: '',
						msg: msg
					});
					console.log('SOKI_DEBUG: ' + msg);
				}
			} catch (ex) {
				sokiAppUtil.showNativeAlert(typeof msg, msg + "\n\n" + ex.message + "\n" + JSON.stringify(ex));
			}
		};

		return _service;
	})

;