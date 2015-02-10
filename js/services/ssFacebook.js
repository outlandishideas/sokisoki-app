angular
    .module('sokisoki')
    .factory('ssFacebook', ['$q', function($q) {
        return {
            login: function() {
                var q = $q.defer();

                facebookConnectPlugin.login([],
                    function (res) {
                        q.resolve(res);
                    }, function (res) {
                        q.reject(res);
                    });

                return q.promise;
            }
        };
    }]);