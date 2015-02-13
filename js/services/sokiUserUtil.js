angular
    .module('sokisoki')
    .factory('sokiUserUtil', function($q, $http, $location, sokiConfig, ssDb, sokiLogger) {
        var API = sokiConfig.get('API_ENDPOINT');
        var ACTIONS = sokiConfig.get('ACTIONS');

        var service = {},
            _user = null;

        service.get = function() {
            return _user;
        };

        var setUser = function(user) {
            _user = user;
            ssDb.set('user', _user);
        };

        service.login = function(type, id, name, done) {
            sokiLogger.log('Logging in to sokisoki');
            $http
                //todo: make this a POST
                .get(API + '/user/login', { params: {type: type, id: id, name: name }})
                .then(function(res) {
                    sokiLogger.log('logged in!');
                    sokiLogger.log(res);
                    setUser(res.data);
                    done(null, _user);
                }, function(err) {
                    sokiLogger.log('failed to log in');
                    sokiLogger.log(err);
                    service.clearUser();
                    done(err);
                });
        };

        service.updateHistory = function(done) {
            sokiLogger.log('Updating history');
            if (!_user) {
                done(null, _user);
                return;
            }
            $http
                .get(API + '/user/' + _user.user_id + '/history', {params: { token: _user.api_token }})
                .then(function(res) {
                    sokiLogger.log('Got history');
                    sokiLogger.log(res);
                    var history = res.data.history;
                    for (var i=0; i<history.length; i++) {
                        var item = history[i];
                        if (item.action in ACTIONS) {
                            item.action = ACTIONS[item.action];
                        }
                        item.date = new Date(item.date);
                    }
                    _user.history = history;
                    setUser(_user);
                    done(null, _user);
                }, function(err) {
                    sokiLogger.log('failed to get history');
                    sokiLogger.log(err);
                    done(err);
                });
        };

        service.clearUser = function() {
            _user = null;
            ssDb.set('user', _user);
        };

        service.getHistory = function() {
            return _user ? _user.history : [];
        };

        service.hasOnboarded = function() {
            return _user && _user.onboarded;
        };

        service.setOnboarded = function() {
            _user.onboarded = true;
            ssDb.set('user', _user);

            $http
                //todo: make this a POST
                .get(API + '/user/' + _user.user_id + '/onboarded', { params: { token: _user.api_token }})
                .then(function() { }, function() { });
        };

        if(typeof cordova == 'undefined') {
            // when running in browser, allow all routes
            service.checkStatus = function(path, route) {
                sokiLogger.log(path + ': allowing user through');
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
                    sokiLogger.log('cannot access ' + path + ': ' + reason);
                    $location.path(newPath);
                    defer.reject(reason);
                } else {
                    defer.resolve();
                }
                return defer.promise;
            };
        }

        _user = ssDb.get('user');
        if (!_user) {
            service.clearUser();
        }
        return service;
    });