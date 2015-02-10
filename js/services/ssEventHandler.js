angular
    .module('sokisoki')
    .factory('ssEventHandler', function(log) {
        var service = {},
            handlers = { backbutton: null };

        service.setHandler = function(action, handler) {
            log('setting handler for ' + action);
            log(handler);

            if (handlers[action]) {
                document.removeEventListener(action, handlers[action]);
            }

            if (handler) {
                document.addEventListener(action, handler);
            }

            handlers[action] = handler;
        };

        service.clearHandler = function(action) {
            service.setHandler(action, null);
        };

        service.setBackButtonHandler = function(handler) {
            service.setHandler('backbutton', handler);
        };

        service.clearBackButtonHandler = function() {
            service.clearHandler('backbutton');
        };

        return service;
    });