angular
    .module('sokisoki')
    .factory('ssUserUtil', function($q, $http, $location, ssConfig, ssDb, log) {
        var API = ssConfig.get('API_ENDPOINT');

        var service = {},
            _user = {
                type: null
            };

        service.get = function() {
            return _user;
        };

        service.load = function(value, type, done) {
            _user.type = type;
            done();
            return;
            // todo

            $http
                .post(API + '/user', { id: type + '-' + value.id })
                .then(function(res) {
                    _user = res.data;
                    done(null, _user);
                }, function(err) {
                    done(err);
                });
        };

        service.clearUser = function() {
            // todo
        };

        service.getHistory = function() {
            return _user.history;
        };

        service.hasOnboarded = function() {
            return _user.onboarded;
        };

        service.setOnboarded = function() {
            _user.onboarded = true;
            return;

            $http
                .post(API + '/user/onboarded', { onboarded: true })
                .then(function() { }, function() { });
        };

        if(typeof cordova == 'undefined') {
            // when running in browser, allow all routes
            service.checkStatus = function(path, route) {
                console.log(path + ': allowing user through');
            }
        } else {
            service.checkStatus = function(path) {
                var defer = $q.defer();
                var newPath = null;
                var reason = null;
                switch (path) {
                    case '/home':
                    case '/history':
                        if (!service.get()) {
                            reason = 'no user';
                            newPath = '/login';
                        } else if (!service.hasOnboarded()) {
                            reason = 'not onboarded';
                            newPath = '/onboard';
                        }
                        break;
                    case '/login':
                        if (service.get()) {
                            reason = 'already logged in';
                            newPath = '/history';
                        }
                        break;
                    case '/onboard':
                        if (!service.get()) {
                            reason = 'no user';
                            newPath = '/login';
                        }
                        break;
                }
                if (newPath) {
                    console.log('cannot access ' + path + ': ' + reason);
                    $location.path(newPath);
                    defer.reject(reason);
                } else {
                    defer.resolve();
                }
                return defer.promise;
            };
        }

        return service;
    });