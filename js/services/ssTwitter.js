angular
    .module('sokisoki')
    .factory('ssTwitter', ['$q', '$rootScope', 'ssOauth', function($q, $rootScope, ssOauth) {
        if (typeof cordova == 'undefined') {
            return {
                login: function() {
                    var q = $q.defer();
                    q.resolve({id_str: '12349876', 'screen_name': 'rasmuswinter'});
                    return q.promise;
                }
            }
        }

        var options = {
            consumerKey: 'e7zQ94khCDqEmOkT2Gluiu1OB', // YOUR Twitter CONSUMER_KEY
            consumerSecret: 'vYGYsD0yAVgfzxvrtnKmHxTkoCo4jtCsauxOSV02XYnR8slGKg', // YOUR Twitter CONSUMER_SECRET
            callbackUrl: "http://localhost" //this doesn't matter, as anything going here is intercepted
        };

        var currentData = {
            deferred: null,
            requestParams: null,
            oauth: ssOauth(options),
            accessParams: {}
        };

        var onError = function(data) {
            console.log("ERROR: "+JSON.stringify(data));
            var args = JSON.parse(data.text);
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
                console.log('login not possible');
            }
        };

        // called by promptForLogin, above, to look for query parameters
        var listenForLocation = function(e) {
            console.log('twitter: location changed');
            console.log(e.url);
            if (e.url.indexOf(options.callbackUrl) >= 0) {
                var params = e.url.substr(e.url.indexOf('?') + 1);

                params = params.split('&');
                for (var i = 0; i < params.length; i++) {
                    var y = params[i].split('=');
                    if(y[0] === 'oauth_verifier') {
                        currentData.authWindow.close();
                        currentData.oauth.get('https://api.twitter.com/oauth/access_token?oauth_verifier='+y[1]+'&'+currentData.requestParams, getUserInfo, onError);
                        break;
                    } else if (y[0] === 'denied') {
                        //todo: test this
                        currentData.authWindow.close();
                        onError(params);
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
            currentData.oauth.get('https://api.twitter.com/1.1/account/verify_credentials.json?skip_status=true', onComplete, onError);
        };

        var onComplete = function(data) {
            var args = JSON.parse(data.text);
            $rootScope.$apply(function() {
                var d = currentData.deferred;
                currentData.deferred = null;
                d.resolve(args);
            });
        };

        return {
            login: function() {
                if (currentData.deferred) {
                    currentData.deferred.reject('started again');
                }
                currentData.deferred = $q.defer();
                currentData.requestParams = null;
                currentData.oauth.get('https://api.twitter.com/oauth/request_token', promptForLogin, onError);
                return currentData.deferred.promise;
            }
        };
    }]);