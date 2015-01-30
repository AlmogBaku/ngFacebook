Angular Facebook [![Build Status](https://travis-ci.org/GoDisco/ngFacebook.svg?branch=master)](https://travis-ci.org/GoDisco/ngFacebook)
==================
Angular service to handle facebook

Installation
------------
1. Download the package:
   1. download using npm: `npm install ng-facebook`
   1. download using the [zip file](https://github.com/GoDisco/ngFacebook/archive/master.zip)
   1. download using bower: `bower install ng-facebook`
1. Modify your application to include `ngFacebook` in your application dependencies
1. Configure the ngFacebook module using the configuration steps outlined in the section titled "Configuration" below.
1. Load the [*Facebook SDK for javascript*](https://developers.facebook.com/docs/reference/javascript/), **BUT DO NOT** call `FB.init` or set `window.fbAsyncInit`. These steps are automatically done by the ngFacebook module.

Example:

```javascript
angular.module('<your-app>', ['ngFacebook'])

.config( function( $facebookProvider ) {
  $facebookProvider.setAppId('<your-facebook-app-id>');
})

.run( function( $rootScope ) {
  // Cut and paste the "Load the SDK" code from the facebook javascript sdk page.
  
  // Load the facebook SDK asynchronously
  (function(){
     ...
   }());
})

;

var DemoCtrl = function ($scope, $facebook) {
  ...
  function refresh() {
    $facebook.api("/me").then( 
      function(response) {
        $scope.welcomeMsg = "Welcome " + response.name;
      },
      function(err) {
        $scope.welcomeMsg = "Please log in";
      });
  }
};

```

For more details check out this [plunker which uses ngFacebook](http://plnkr.co/edit/HcYBFKbqFcgQGhyCGQMw?p=preview).

Configuration
-----
You *must* configure your `facebook application ID` in your app, for example:

    app.config(function(FacebookProvider) {
      $facebookProvider.setAppId(11111111111);
    });

### Additional configurations
You can also configure the following properties. Both `set` and `get` methods are available for each property.


1. `permissions(<string>)` - permissions required by your app.

    Example:

        $facebookProvider.setPermissions("email,user_likes");

1. `customInit(<object>)` - the parameters to pass to `FB.init()`. The 'appId' parameter is automatically specified using the value passed to '$facebookProvider.setAppId()', however the remaining parameters are configurable.

    Example to set:

        $facebookProvider.setCustomInit({
          channelUrl : '//WWW.YOUR_DOMAIN.COM/channel.html',
          xfbml      : true
        });
        
1. `version(<string>)` - specify the version of the api (_v1.0 by default_).

    Example to set:

        $facebookProvider.setVersion("v2.2");


Using
-----
### Methods
1. `$facebook.config(property)`   - Return the config property.
1. `$facebook.getAuthResponse()`  - Return the `AuthResponse`(assuming you already connected)
1. `$facebook.getLoginStatus()`   - Return *promise* of the result.
1. `$facebook.login()`   - Logged in to your app by facebook. Return *promise* of the result.
1. `$facebook.logout()`   - Logged out from facebook. Return *promise* of the result.
1. `$facebook.ui(params)`   - Do UI action(see facebook sdk docs). Return *promise* of the result.
1. `$facebook.api(args...)`   - Do API action(see facebook sdk docs). Return *promise* of the result.
1. `$facebook.cachedApi(args...)`   - Do API action(see above), but the result will cached. Return *promise* of the result.
1. `$facebook.setVersion(version)` - Set another SDK version
1. `$facebook.getVersion()` - Get current SDK version
    Example:

        app.controller('indexCtrl', function($scope, $facebook) {
          $scope.user=$facebook.cachedApi('/me');
        });

### Events
The service will broadcast the facebook sdk events with the prefix `fb.`.

In return you will get the next arguments to your `$on` handler: `event,response,FB` (`FB` is the facebook native js sdk).

1. `fb.auth.login`
1. `fb.auth.logout`
1. `fb.auth.prompt`
1. `fb.auth.sessionChange`
1. `fb.auth.statusChange`
1. `fb.auth.authResponseChange`
1. `fb.xfbml.render`
1. `fb.edge.create`
1. `fb.edge.remove`
1. `fb.comment.create`
1. `fb.comment.remove`
1. `fb.message.send`

*For additional information about the events see the sdk docs.*

License
--------
This project is released over [MIT license](http://opensource.org/licenses/MIT "MIT License")


Sponsors
------
Thanks to our sponsors for this project:

1. [GoDisco](http://www.godisco.net)
1. [JetBrains](http://www.jetbrains.com/) - for providing the great IDE [PhpStorm](http://www.jetbrains.com/phpstorm/)


Authors
-------

1. [Almog Baku](http://www.AlmogBaku.com "AlmogBaku") - by [GoDisco](http://www.godisco.net)
1. [Amir Valiani](https://github.com/avaliani "Avaliani")
1. [Tal Gleichger](http://gleichger.com/ "talgleichger") - by [GoDisco](http://www.godisco.net)
