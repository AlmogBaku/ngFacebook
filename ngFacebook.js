/**
 * Angular Facebook service
 * ---------------------------
 *
 * Authored by  AlmogBaku (GoDisco)
 *              almog@GoDisco.net
 *              http://www.GoDisco.net/
 *
 * 9/8/13 10:25 PM
 */

angular.module('ngFacebook', [])
  .provider('$facebook', function() {
    var config = {
      permissions:    'email',
      appId:          null,
      version:        'v2.0',
      customInit:     {}
    };

    this.setAppId = function(appId) {
      config.appId=appId;
      return this;
    };
    this.getAppId = function() {
      return config.appId;
    };
    this.setVersion = function(version) {
      config.version=version;
      return this;
    };
    this.getVersion = function() {
      return config.version;
    };
    this.setPermissions = function(permissions) {
      if(permissions instanceof Array) {
        permissions.join(',');
      }
      config.permissions=permissions;
      return this;
    };
    this.getPermissions = function() {
      return config.permissions;
    };
    this.setCustomInit = function(customInit) {
      if(angular.isDefined(customInit.appId)) {
        this.setAppId(customInit.appId);
      }
      config.customInit=customInit;
      return this;
    };
    this.getCustomInit = function() {
      return config.customInit;
    };

    this.$get = ['$q', '$rootScope', '$window', function($q, $rootScope, $window) {
      var $facebook=$q.defer();
      $facebook.config = function(property) {
        return config[property];
      };

      //Initialization
      $facebook.init = function() {
        if($facebook.config('appId')==null)
          throw "$facebookProvider: `appId` cannot be null";

        $window.FB.init(
          angular.extend({ appId: $facebook.config('appId'), version: $facebook.config('version') }, $facebook.config("customInit"))
        );
        $rootScope.$broadcast("fb.load", $window.FB);
      };

      $rootScope.$on("fb.load", function(e, FB) {
        $facebook.resolve(FB);

        //Define action events
        angular.forEach([
          'auth.login', 'auth.logout', 'auth.prompt',
          'auth.sessionChange', 'auth.statusChange', 'auth.authResponseChange',
          'xfbml.render', 'edge.create', 'edge.remove', 'comment.create',
          'comment.remove', 'message.send'
        ],function(event) {
          FB.Event.subscribe(event, function(response) {
            $rootScope.$broadcast("fb."+event, response, FB);
            if(!$rootScope.$$phase) $rootScope.$apply();
          });
        });

        // Make sure 'fb.auth.authResponseChange' fires even if the user is not logged in.
        $facebook.getLoginStatus();
        $facebook.canvasSetAutoResize();
      });

      /**
       * Internal cache
       */
      $facebook._cache={};
      $facebook.setCache = function(attr,val) {
        $facebook._cache[attr]=val;
      };
      $facebook.getCache = function(attr) {
        if(angular.isUndefined($facebook._cache[attr])) return false;
        return $facebook._cache[attr];
      };
      $facebook.clearCache = function() {
        $facebook._cache = {};
      };

      /**
       * Authentication
       */

      var firstAuthResp=$q.defer();
      var firstAuthRespReceived=false;
      function resolveFirstAuthResp(FB) {
        if (!firstAuthRespReceived) {
          firstAuthRespReceived=true;
          firstAuthResp.resolve(FB);
        }
      }

      $facebook.setCache("connected", null);
      $facebook.isConnected = function() {
        return $facebook.getCache("connected");
      };
      $rootScope.$on("fb.auth.authResponseChange", function(event, response, FB) {
        $facebook.clearCache();

        if(response.status=="connected") {
          $facebook.setCache("connected", true);
        } else {
          $facebook.setCache("connected", false);
        }
        resolveFirstAuthResp(FB);
      });

      $facebook.getAuthResponse = function () {
        return FB.getAuthResponse();
      };
      $facebook.getLoginStatus = function (force) {
        var deferred=$q.defer();

        return $facebook.promise.then(function(FB) {
          FB.getLoginStatus(function(response) {
            if(response.error)  deferred.reject(response.error);
            else {
                deferred.resolve(response);
                if($facebook.isConnected()==null)
                    $rootScope.$broadcast("fb.auth.authResponseChange", response, FB);
            }
            if(!$rootScope.$$phase) $rootScope.$apply();
          }, force);
          return deferred.promise;
        });
      };
      $facebook.login = function (permissions, rerequest) {
        if(permissions==undefined) permissions=$facebook.config("permissions");
        var deferred=$q.defer();

        var loginOptions = { scope: permissions };
        if (rerequest) {
          loginOptions.auth_type = 'rerequest';
        }

        return $facebook.promise.then(function(FB) {
          FB.login(function(response) {
            if(response.error)  deferred.reject(response.error);
            else                deferred.resolve(response);
            if(!$rootScope.$$phase) $rootScope.$apply();
          }, loginOptions);
          return deferred.promise;
        });
      };
      $facebook.logout = function () {
        var deferred=$q.defer();

        return $facebook.promise.then(function(FB) {
          FB.logout(function(response) {
            if(response.error)  deferred.reject(response.error);
            else                deferred.resolve(response);
            if(!$rootScope.$$phase) $rootScope.$apply();
          });
          return deferred.promise;
        });
      };
      $facebook.ui = function (params) {
        var deferred=$q.defer();

        return $facebook.promise.then(function(FB) {
          FB.ui(params, function(response) {
            if(response && response.error_code) {
              deferred.reject(response.error_message);
            } else {
              deferred.resolve(response);
            }
            if(!$rootScope.$$phase) $rootScope.$apply();
          });
          return deferred.promise;
        });
      };
      $facebook.api = function () {
        var deferred=$q.defer();
        var args=arguments;
        args[args.length++] = function(response) {
          if(response.error)        deferred.reject(response.error);
          if(response.error_msg)    deferred.reject(response);
          else                      deferred.resolve(response);
          if(!$rootScope.$$phase) $rootScope.$apply();
        };

        return firstAuthResp.promise.then(function(FB) {
          FB.api.apply(FB, args);
          return deferred.promise;
        });
      };

      /**
       * API cached request - cached request api with promise
       *
       * @param path
       * @returns $q.defer.promise
       */
      $facebook.cachedApi = function() {
        if(typeof arguments[0] !== 'string')
          throw "$facebook.cacheApi can works only with graph requests!";

        var promise = $facebook.getCache(arguments[0]);
        if(promise) return promise;

        var result = $facebook.api.apply($facebook, arguments);
        $facebook.setCache(arguments[0], result);

        return result;
      };

      $facebook.canvasSetAutoGrow = function () {
        return FB.Canvas.setAutoGrow();
      };

      $facebook.canvasScrollTop = function (x,y) {
        return FB.Canvas.scrollTo(x,y);
      };

      $facebook.canvasSetAutoResize = function () {
        setInterval(function() {
          if (!FB)
            return;
          var height = angular.element(document.querySelector('body'))[0].offsetHeight;
          return FB.Canvas.setSize({ height: height });
        }, 500);
      };

      return $facebook;
    }];
  })
  .run(['$rootScope', '$window', '$facebook', function($rootScope, $window, $facebook) {
    $window.fbAsyncInit = function() {
      $facebook.init();
      if(!$rootScope.$$phase) $rootScope.$apply();
    };
  }])
;
