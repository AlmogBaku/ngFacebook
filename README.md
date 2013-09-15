Angular Facebook
================
Angular service to handle facebook

Installation
------------
1. Include the [*Facebook SDK for javascript*](https://developers.facebook.com/docs/reference/javascript/), **BUT DO NOT** initialize the sdk.
1. Include `ngFacebook` in your application dependencies


Configuration
-----
You *must* configure your `facebook application ID` in your app, for example:

    app.config(function(FacebookProvider) {
      $facebookProvider.setAppId(11111111111);
    });

### Additional configurations
You can also configure the next properties.

Use `set` and `get`. For example `$facebookProvider.setAppId(11111)`


1. `permissions(<string>)` for permissions which required by your app.

    Example:

        $facebookProvider.setPermissions("email,user_likes");

1. `customInit(<object>)` custom initial p.

    Example to set:

        $facebookProvider.setCustomInit({
          channelUrl : '//WWW.YOUR_DOMAIN.COM/channel.html'
        });


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


Authors
-------
[AlmogBaku](http://www.AlmogBaku.com "AlmogBaku") - by [GoDisco](http://www.godisco.net)
