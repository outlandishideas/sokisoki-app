angular
    .module('sokisoki')
    .factory('sokiFacebook', ['$q', 'sokiLogger', function($q, sokiLogger) {
        var _accessData = {};
        var FB = facebookConnectPlugin;
        return {
            login: function() {
                var q = $q.defer();

                FB.login(['publish_actions'],
                    function (res) {
                        _accessData = res.authResponse;
                        sokiLogger.log('logged into facebook');
                        sokiLogger.log(_accessData);
                        FB.api('/me?fields=name', ['public_profile'],
                            function(response) {
                                if (response && !response.error) {
                                    q.resolve(response);
                                } else {
                                    q.reject(response);
                                }
                            },
                            function(errorObj) {
                                q.reject(errorObj);
                            });
                    }, function (res) {
                        q.reject(res);
                    });

                return q.promise;
            },
            getAccessData: function() {
                return _accessData;
            },
            share: function(message, accessData) {
                //todo
                sokiLogger.log('Sharing on facebook: ' + message);
                sokiLogger.log(accessData);
                FB.api('/me/feed?message=testing', ['publish_actions'],
                    function(res) {
                        sokiLogger.log('success!');
                        sokiLogger.log(res);
                    },
                    function(res) {
                        sokiLogger.log('failure!');
                        sokiLogger.log(res);
                    }
                );
            }
        };
    }]);