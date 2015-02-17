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
			var line = 17;
			try {
				line = 19;
				if (typeof msg != 'string') {
					msg = JSON.stringify(msg);
				}
				line = 23;
				var e = new Error('dummy');
				line = 25;
				if (typeof e.stack != 'undefined') {
				line = 27;
					var stack = e.stack.replace(/^[^\(]+?[\n$]/gm, '')
						.replace(/^\s+at\s+/gm, '')
						.replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@')
						.split('\n');
				line = 32;
					for (var i = 0; i < stack.length; i++) {
				line = 34;
						var regex = /(.+)\s*\((.+):([0-9]+):([0-9]+)\)/g;
				line = 36;
						var args = regex.exec(stack[i]);
				line = 38;
						if (typeof args != 'undefined' && args != null && args.length >= 4) {
				line = 40;
							var fileComponents = args[2].split('/');
				line = 42;
							if (fileComponents[fileComponents.length - 1] != 'sokiLogger.js') {
				line = 44;
								var file = fileComponents.slice(-2).join('/');
				line = 46;
								_service.logs.unshift({
									date: new Date(),
									file: file,
									line: args[3],
									msg: msg
								});
				line = 53;
								console.log('SOKI_DEBUG: ' + file + ' line ' + args[3] + ' :: ' + msg);
				line = 55;
								break;
							}
						} else {
				line = 59;
							sokiAppUtil.showAlert('Failed to parse', e.stack);
						}
					}
				} else {
				line = 64;
					_service.logs.unshift({
						date: new Date(),
						file: '',
						line: '',
						msg: msg
					});
				line = 71;
					console.log('SOKI_DEBUG: ' + msg);
				}
			} catch (ex) {
				sokiAppUtil.showAlert(typeof msg, msg + "\n\n" + line + "\n\n" + ex.message + "\n" + JSON.stringify(ex));
			}
		};

		return _service;
	})

;