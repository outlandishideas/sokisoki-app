angular
    .module('sokisoki')
    .factory('sokiFacebook', ['$q', '$http', 'sokiLogger', function($q, $http, sokiLogger) {
        var _accessData = {};
        var FB = facebookConnectPlugin;
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
                FB.login(['publish_actions'],
                    function(res) {
                        var accessToken = res.authResponse.accessToken;
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
                    }, function(err) {
                        q.reject(err);
                    }
                );

                return q.promise;
            }
        };
    }]);