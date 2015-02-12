angular
    .module('sokisoki')
    .factory('sokiBarcode', function($http, sokiConfig, sokiUserUtil, log) {
        var API = sokiConfig.get('API_ENDPOINT'),
            ACTIONS = sokiConfig.get('ACTIONS');

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
         * @param metadata hashmap of additional metadata
         * @param done callback
         */
        methods.doAction = function(id, action, metadata, done) {
            done = done || function() { };

            if(!action in ACTIONS) {
                done('unrecognised action');
                return;
            }

            var user = sokiUserUtil.get();

            $http
                //todo: make this a POST
                .get(API + '/barcode/' + id + '/' + action, { params: { user_id: user.user_id, token: user.api_token, metadata: metadata } })
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