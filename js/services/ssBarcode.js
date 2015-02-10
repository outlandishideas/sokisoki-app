angular
    .module('sokisoki')
    .factory('ssBarcode', function($http, ssConfig, log) {
        var API = ssConfig.get('API_ENDPOINT'),
            ACTIONS = ssConfig.get('ACTIONS');

        var methods = {},
            _barcode;

        methods.load = function(id, done) {
            $http
                .get(API + '/barcode/' + id)
                .then(function(res) {
                    log('barcode ' + id + ' loaded successfully');
                    _barcode = res.data;
                    done(null, _barcode);
                }, function(err) {
                    log('barcode ' + id + ' was not loaded: ' + JSON.stringify(err));
                    done(err);
                });
        };

        methods.get = function(property) {
            return _barcode ? _barcode[property] : undefined;
        };

        /**
         * Perform an action on a Barcode.
         * @param id id of barcode (optional)
         * @param action action to perform
         * @param done callback
         */
        methods.doAction = function(id, action, done) {
            done = done || function() { };

            if(!action in ACTIONS) {
                done('unrecognised action');
                return;
            }

            $http
                .post(API + '/barcode/' + id + '/' + action, {})
                .then(function() {
                    log('action ' + action + ' performed successfully');
                    done(null);
                }, function(err) {
                    log('action ' + action + ' was not performed: ' + JSON.stringify(err));
                    done(err);
                });
        };

        return methods;
    });