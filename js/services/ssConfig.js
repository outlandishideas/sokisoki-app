angular
    .module('sokisoki')
    .value('config', {
        API_ENDPOINT: 'http://sokisoki.com/api',
        ACTIONS: {
            buy: {
                present: 'buy',
                past: 'bought',
                label: 'Buy this'
            },
            love: {
                present: 'love',
                past: 'loved',
                label: 'Love this'
            },
            scan: {
                present: 'scan',
                past: 'scanned',
                label: 'Scanned this'
            },
            want: {
                present: 'want',
                past: 'wanted',
                label: 'Wish list'
            }
        }
    })
    .factory('ssConfig', function($q, config, log) {
        var methods = {},
            _config;

        methods.load = function(done) {
            if(config) {
                _config = config;
                done(null, _config);
            }

            done('no configuration');
        };

        methods.get = function(key) {
            return config[key];
        };

        methods.put = function(key, value) {
            log('! Warning: changes to config will not persist');
            config[key] = value;
            return config[key];
        };

        return methods;
    });