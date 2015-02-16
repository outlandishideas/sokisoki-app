angular
    .module('sokisoki')
    .factory('sokiFacebook', ['$q', function($q, sokiLogger) {
        return {
            login: function() {
                var q = $q.defer();

                facebookConnectPlugin.login(['public_profile'],
                    function (res) {
                        facebookConnectPlugin.api('/me?fields=name&access_token='+res.accessToken,
                            null,
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
            share: function(message, accessData) {
                //todo
                sokiLogger.log('Sharing on facebook: ' + message);
                sokiLogger.log(accessData);
            }
        };
    }]);