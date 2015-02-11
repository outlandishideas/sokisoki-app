angular
    .module('sokisoki')
    .factory('ssFacebook', ['$q', function($q) {
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
            }
        };
    }]);