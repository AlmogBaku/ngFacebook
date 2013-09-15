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
      customInit:     {}
    };


    this.setAppId = function(appId) {
      config.appId=appId;
      return this;
    };
    this.getAppId = function() {
      return config.appId;
    };
    this.setPermissions = function(permissions) {
      config.permissions=permissions;
      return this;
    };
    this.getPermissions = function() {
      return config.permissions;
    };
    this.setCustomInit = function(customInit) {
      config.customInit=customInit;
      return this;
    };
    this.getCustomInit = function() {
      return config.customInit;
    };

    this.$get = ['$q', '$rootScope', '$window', function($q, $rootScope, $window) {
      var $facebook=$q.defer();
      $facebook.config=function(property) {
        return config[property];
      }

      //Initialization
      $facebook.init = function() {
        if($facebook.config('appId')==null)
          throw "$facebookProvider: `appId` cannot be null";

        $window.FB.init(
          angular.extend({ appId: $facebook.config('appId') }, $facebook.config("customInit"))
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
          });
        });
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

      var login_deferred=$q.defer();
      var login_deferred_id=0;
      login_deferred.id=0;
      $facebook._reset_login_deferred = function() {
        $facebook.clearCache();
        login_deferred=$q.defer();
        login_deferred.id=login_deferred_id++;
      };

      $facebook.setCache("connected", null);
      $facebook.isConnected = function() {
        return $facebook.getCache("connected");
      };
      $rootScope.$on("fb.auth.authResponseChange", function(event, response, FB) {
        $facebook.clearCache();

        if(response.status=="connected") {
          $facebook.setCache("connected", true);
          login_deferred.resolve(FB);
        } else {
          $facebook.setCache("connected", false);
          login_deferred.reject(response.status);
        }
      });

      $rootScope.$on("fb.auth.login", $facebook._reset_login_deferred);
      $rootScope.$on("fb.auth.logout", $facebook._reset_login_deferred);

      $facebook.getAuthResponse = function () {
        return FB.getAuthResponse();
      };
      $facebook.getLoginStatus = function (force) {
        var deferred=$q.defer();

        return $facebook.promise.then(function(FB) {
          FB.getLoginStatus(function(response) {
            if(response.error)  deferred.reject(response.error)
            else                deferred.resolve(response);
            $rootScope.$broadcast("fb.auth.authResponseChange", response, FB);
          }, force);
          return deferred.promise;
        });
      };
      $facebook.login = function () {
        var deferred=$q.defer();

        return $facebook.promise.then(function(FB) {
          FB.login(function(response) {
            if(response.error)  deferred.reject(response.error)
            else                deferred.resolve(response);
          }, { scope: $facebook.config("permissions") });
          return deferred.promise;
        });
      };
      $facebook.logout = function () {
        var deferred=$q.defer();

        return $facebook.promise.then(function(FB) {
          FB.logout(function(response) {
            if(response.error)  deferred.reject(response.error)
            else                deferred.resolve(response);
          });
          return deferred.promise;
        });
      };
      $facebook.ui = function (params) {
        var deferred=$q.defer();

        return $facebook.promise.then(function(FB) {
          FB.ui(params, function(response) {
            if(response.error)  deferred.reject(response.error)
            else                deferred.resolve(response);
          });
          return deferred.promise;
        });
      };
      $facebook.api = function () {
        var deferred=$q.defer();
        var args=arguments;
        args[args.length++] = function(response) {
          if(response.error)  deferred.reject(response.error)
          else                deferred.resolve(response);
        };

        return login_deferred.promise.then(function(FB) {
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

      return $facebook;
    }];
  })
  .run(['$rootScope', '$window', '$facebook', function($rootScope, $window, $facebook) {
    $window.fbAsyncInit = function() {
      $facebook.init();
    };
  }])
;