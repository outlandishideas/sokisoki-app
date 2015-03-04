angular
    .module('sokisoki')
    .factory('sokiConfig', function($q, sokiLogger) {
        var methods = {};
        var _config = {};
        _config.API_ENDPOINT = 'http://sokisoki.com/api';
        _config.ACTIONS = {
            buy: {
                verbs: {
                    present: 'have',
                    past: 'had'
                },
                label: 'Have',
                alert: 'Bought! (todo)',
                message: 'I bought this #sokisoki',
                faIcon: 'fa-check'
            },
            love: {
                verbs: {
                    present: 'love',
                    past: 'loved'
                },
                label: 'Love',
                alert: 'Loved! (todo)',
                message: 'I loved this #sokisoki',
                faIcon: 'fa-heart'
            },
            scan: {
                verbs: {
                    present: 'scan',
                    past: 'scanned'
                },
                label: 'Scanned',
                alert: 'Scanned!',
                message: 'I scanned this #sokisoki',
                faIcon: 'fa-barcode'
            },
            want: {
                verbs: {
                    present: 'want',
                    past: 'wanted'
                },
                label: 'Want',
                alert: 'Added to wish list! (todo)',
                message: 'I added this to my wishlist #sokisoki',
                faIcon: 'fa-star'
            }
        };

        // set id properties
        for (var i in _config.ACTIONS) {
            if (_config.ACTIONS.hasOwnProperty(i)) {
                _config.ACTIONS[i].id = i;
            }
        }

        methods.get = function(key) {
            return _config[key];
        };

        methods.put = function(key, value) {
            sokiLogger.log('! Warning: changes to config will not persist');
            _config[key] = value;
            return _config[key];
        };

        return methods;
    });