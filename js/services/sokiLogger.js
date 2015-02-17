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
					var stack = e.stack.replace(/^[^\(]+?[\n$]/gm, '')
						.replace(/^\s+at\s+/gm, '')
						.replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@')
						.split('\n');
					for (var i = 0; i < stack.length; i++) {
						var regex = /(.+)\s*\((.+):([0-9]+):([0-9]+)\)/g;
						var args = regex.exec(stack[i]);
						if (args == null) {
							var iosRegex = /(.+):([0-9]+):([0-9]+)/g;
							args = iosRegex.exec(stack[i]);
							args.unshift('unknown');
						}
						if (typeof args != 'undefined' && args != null && args.length >= 4) {
							var fileComponents = args[2].split('/');
							var line = args[3];
							if (fileComponents[fileComponents.length - 1] != 'sokiLogger.js') {
								var file = fileComponents.slice(-2).join('/');
								_service.logs.unshift({
									date: new Date(),
									file: file,
									line: line,
									msg: msg
								});
								console.log('SOKI_DEBUG: ' + file + ' line ' + line + ' :: ' + msg);
								break;
							}
						} else {
							sokiAppUtil.showAlert('Failed to parse', stack[i]);
						}
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
				sokiAppUtil.showAlert(typeof msg, msg + "\n\n" + ex.message + "\n" + JSON.stringify(ex));
			}
		};

		return _service;
	})

;