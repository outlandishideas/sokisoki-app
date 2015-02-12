angular
    .module('sokisoki')
    .factory('sokiUserUtil', function($q, $http, $location, sokiConfig, ssDb, log) {
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
            $http
                //todo: make this a POST
                .get(API + '/user/login', { params: {type: type, id: id, name: name }})
                .then(function(res) {
                    log('logged in!');
                    log(res);
                    setUser(res.data);
                    done(null, _user);
                }, function(err) {
                    log('failed to log in');
                    log(err);
                    service.clearUser();
                    done(err);
                });
        };

        service.updateHistory = function(done) {
            if (!_user) {
                return;
            }
            $http
                .get(API + '/user/' + _user.user_id + '/history', {params: { token: _user.api_token }})
                .then(function(res) {
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
                    log('failed to get history');
                    log(err);
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

        _user = ssDb.get('user');
        if (!_user) {
            service.clearUser();
        }
        return service;
    });