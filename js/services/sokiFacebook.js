angular
    .module('sokisoki')
    .factory('sokiFacebook', ['$q', '$http', 'sokiLogger', function($q, $http, sokiLogger) {
        var _accessData = {};
        var FB = typeof facebookConnectPlugin == 'undefined' ? {} : facebookConnectPlugin;
        return {
            login: function() {
                var q = $q.defer();

                var onFail = function(errorObj) {
                    q.reject(errorObj);
                };

                var login = function() {
                    FB.login(['public_profile'], onLogin, onFail);
                };

                var onLogin = function(res) {
                    FB.login(['publish_actions'], onLogin2, onFail);
                };

                var onLogin2 = function(res) {
                    _accessData = res.authResponse;
                    sokiLogger.log('logged into facebook');
                    sokiLogger.log(_accessData);
                    FB.api('/me?fields=name', [], onUserFetch, onFail);
                };

                var onUserFetch = function(res) {
                    if (res && !res.error) {
                        q.resolve(res);
                    } else {
                        q.reject(res);
                    }
                };

                login();

                return q.promise;
            },
            getAccessData: function() {
                return _accessData;
            },
            share: function(message, accessData) {
                var q = $q.defer();
                sokiLogger.log('Sharing on facebook: ' + message);

                var onFail = function(errorObj) {
                    sokiLogger.log('failure');
                    sokiLogger.log(errorObj);
                    q.reject(errorObj);
                };

                var checkPerms = function() {
                    FB.api('/me/permissions', [], function(res) {
                        var found = false;
                        if (res && res.data && res.data.length) {
                            for (var i=0; i<res.data.length; i++) {
                                if (res.data[i].permission == 'publish_actions' && res.data[i].status == 'granted') {
                                    found = true;
                                    break;
                                }
                            }
                        }
                        if (found) {
                            getAccessToken();
                        } else {
                            onFail('No permission granted');
                        }
                    }, onFail);
                };

                var getAccessToken = function() {
                    FB.login([],
                        function(res) {
                            doPost(res.authResponse.accessToken);
                        }, onFail);
                };

                var doPost = function(accessToken) {
                    $http
                        .post('https://graph.facebook.com/me/feed?access_token=' + accessToken + '&message=' + encodeURIComponent(message), {})
                        .then(function(res) {
                            sokiLogger.log('facebook success');
                            sokiLogger.log(res);
                            q.resolve(res);
                        }, function(err) {
                            sokiLogger.log('facebook error');
                            sokiLogger.log(err);
                            q.reject(err);
                        });
                };

                checkPerms();

                return q.promise;
            }
        };
    }]);