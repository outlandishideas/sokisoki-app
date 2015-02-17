angular
    .module('sokisoki')
    .factory('sokiTwitter', ['$q', '$rootScope', 'sokiLogger', 'sokiAppUtil', function($q, $rootScope, sokiLogger, sokiAppUtil) {
        var oauthOptions = {
            consumerKey: 'e7zQ94khCDqEmOkT2Gluiu1OB', // YOUR Twitter CONSUMER_KEY
            consumerSecret: 'vYGYsD0yAVgfzxvrtnKmHxTkoCo4jtCsauxOSV02XYnR8slGKg', // YOUR Twitter CONSUMER_SECRET
            callbackUrl: "https://sokisoki.com" //this doesn't matter, as anything going here is intercepted
        };

        var currentData = {
            deferred: null,
            requestParams: null,
            oauth: null,
            accessParams: {}
        };

        var onError = function(data, stage) {
            sokiLogger.log("TWITTER ERROR (" + stage + ')');
            sokiLogger.log(data);
            var args = JSON.parse(data);
            $rootScope.$apply(function() {
                var d = currentData.deferred;
                currentData.deferred = null;
                d.reject(args);
            });
        };

        var promptForLogin = function(data) {
            currentData.requestParams = data.text;
            currentData.authWindow = window.open('https://api.twitter.com/oauth/authorize?'+currentData.requestParams, '_blank', 'location=no,toolbar=no');
            if (currentData.authWindow) {
                currentData.authWindow.addEventListener('loadstart', listenForLocation);
            } else {
                sokiLogger.log('login not possible');
            }
        };

        // called by promptForLogin, above, to look for query parameters
        var listenForLocation = function(e) {
            sokiLogger.log('twitter: location changed (' + e.url + ')');
            if (e.url.indexOf(oauthOptions.callbackUrl) >= 0) {
                var paramsString = e.url.substr(e.url.indexOf('?') + 1);

                var params = paramsString.split('&');
                for (var i = 0; i < params.length; i++) {
                    var y = params[i].split('=');
                    if(y[0] === 'oauth_verifier') {
                        sokiLogger.log('Twitter: found oauth_verifier');
                        currentData.authWindow.close();
                        currentData.oauth.get('https://api.twitter.com/oauth/access_token?oauth_verifier='+y[1]+'&'+currentData.requestParams, getUserInfo, function(data) {
                            onError(data.text, 'verifier');
                        });
                        break;
                    } else if (y[0] === 'denied') {
                        //todo: test this
                        currentData.authWindow.close();
                        onError(JSON.stringify(params), 'denied');
                        break;
                    }
                }
            }
        };

        var getUserInfo = function(data) {
            currentData.accessParams = {};
            var qvars_tmp = data.text.split('&');
            for (var i = 0; i < qvars_tmp.length; i++) {
                var y = qvars_tmp[i].split('=');
                currentData.accessParams[y[0]] = decodeURIComponent(y[1]);
            }
            currentData.oauth.setAccessToken([currentData.accessParams.oauth_token, currentData.accessParams.oauth_token_secret]);
            currentData.oauth.get('https://api.twitter.com/1.1/account/verify_credentials.json?skip_status=true', onComplete, function(data) {
                onError(data.text, 'get_user_info');
            });
        };

        var onComplete = function(data) {
            var args = JSON.parse(data.text);
            $rootScope.$apply(function() {
                var d = currentData.deferred;
                currentData.deferred = null;
                d.resolve(args);
            });
        };

        var oauth = sokiAppUtil.oauth();
        var service = {};

        if (typeof cordova == 'undefined') {
            service.login = function() {
                var q = $q.defer();
                q.resolve({id_str: '12349876', 'screen_name': 'rasmuswinter'});
                return q.promise;
            };
            service.getAccessData = function() {
                return {
                    key: 'abc1',
                    secret: 'def1'
                };
            };
        } else {
            service.login = function () {
                if (currentData.deferred) {
                    currentData.deferred.reject('started again');
                }
                currentData.deferred = $q.defer();
                currentData.requestParams = null;
                currentData.oauth = oauth(oauthOptions);
                currentData.oauth.get('https://api.twitter.com/oauth/request_token', promptForLogin, function (data) {
                    onError(data.text, 'request_token');
                });
                return currentData.deferred.promise;
            };
            service.getAccessData = function() {
                return {
                    key: currentData.oauth.getAccessTokenKey(),
                    secret: currentData.oauth.getAccessTokenSecret()
                };
            };
        }

        service.share = function(message, accessData) {
            var q = $q.defer();

            sokiLogger.log('Sharing on twitter: ' + message);
            var oa = oauth(oauthOptions);
            oa.setAccessToken(accessData.key, accessData.secret);
            oa.post('https://api.twitter.com/1.1/statuses/update.json', {status: message},
                function(res) {
                    sokiLogger.log('success');
                    sokiLogger.log(res);
                    q.resolve(res);
                },
                function(err) {
                    sokiLogger.log('failure');
                    sokiLogger.log(err);
                    q.reject(err);
                }
            );

            return q.promise;
        };
        return service;
    }]);