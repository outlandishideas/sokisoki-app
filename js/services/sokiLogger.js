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
				if (e.stack) {
					var stack = e.stack.replace(/^[^\(]+?[\n$]/gm, '')
						.replace(/^\s+at\s+/gm, '')
						.replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@')
						.split('\n');
					for (var i = 0; i < stack.length; i++) {
						var regex = /(.+)\s*\((.+):([0-9]+):([0-9]+)\)/g;
						var args = regex.exec(stack[i]);
						var fileComponents = args[2].split('/');
						if (fileComponents[fileComponents.length - 1] != 'sokiLogger.js') {
							var file = fileComponents.slice(-2).join('/');
							_service.logs.unshift({
								date: new Date(),
								file: file,
								line: args[3],
								msg: msg
							});
							console.log('SOKI_DEBUG: ' + file + ' line ' + args[3] + ' :: ' + msg);
							break;
						}
					}
				} else {
					_service.logs.unshift({
						date: new Date(),
						file: 'unknown',
						line: '?',
						msg: msg
					});
					console.log('SOKI_DEBUG: ' + msg);
				}
			} catch (ex) {
				sokiAppUtil.showAlert('Error', ex.message);
			}
		};

		return _service;
	})

;