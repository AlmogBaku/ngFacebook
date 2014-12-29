// Use the external Chai As Promised to deal with resolving promises in expectations.
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

var expect = chai.expect;

// Chai expect().to.exist syntax makes default jshint unhappy.
// jshint expr:true

module.exports = function() {
  this.Given('angular webpage with ngFacebook', function(next) {
    browser.get('index.html');
    next();
  });
  this.Then('facebook sdk should be loaded', function(next) {
    var fbRoot = by.id('fb-root');
    browser.wait(function() {
      return browser.driver.isElementPresent(fbRoot);
    }, 10000);
    browser.driver.isElementPresent(fbRoot).then(function(exists) {
      expect(exists).to.equal(true);
    });
    next();
  });

  this.Given('an anonymous state', function(next) {
    browser.driver.executeScript(function() {
      window.addEventListener('fb.load', function () {
        window.FB.logout();
      });
    }).then(function() {
      setTimeout(function() {
        next();
      }, 1000);
    });
  });
  this.When('I login with facebook user "$user" with password "$pass"', function(user, pass, next) {
    var parentWindow;
    element(by.id('login-btn')).click()
      .then(browser.getAllWindowHandles)
      .then(function(handles) {
        parentWindow = handles[0];
        return browser.switchTo().window(handles[1]);
      })
      .then(function() {
        browser.driver.findElement(by.id('email')).sendKeys(user);
        browser.driver.findElement(by.id('pass')).sendKeys(pass);
        return browser.driver.findElement(by.id('loginbutton')).click();
      })
      .then(browser.getAllWindowHandles)
      .then(function(handles){
        var deferred = protractor.promise.defer();

        if(handles.length===1) {
          deferred.fulfill();
        }

        //wait for window to be ready
        setTimeout(function() {
          browser.driver.isElementPresent(by.id('platformDialogForm')).then(function (exists) {
            if (exists) {
              deferred.fulfill(browser.driver.findElement(by.css('button[name=__CONFIRM__]')).click());
            } else {
              deferred.fulfill();
            }
          }).thenCatch(deferred.fulfill);
        }, 500);

        return deferred.promise;
      })
      .then(function() {
        return browser.switchTo().window(parentWindow);
      })
      .then(function() {
        setTimeout(next, 1000);
      });
  });
  this.Then('I should be logged in', function(next) {
    element(by.id('login-btn')).getText().then(function(text) {
      expect(text).to.equal('Logout');
    });
    next();
  });
  this.Then('my name is "$fullname"', function(fullname, next) {
    element(by.css('.message')).getText().then(function(text) {
      expect(text).to.equal('You are Logged in as '+fullname);
    });
    next();
  });

  this.When('I getting the list of my friends', function(next) {
    element(by.id('friends-btn')).click()
      .then(function() {
        setTimeout(next, 1000)
      });
  });
  this.Then('I should see "$friend" as a friend of mine', function(friend, next) {
    element(by.id('friend-list')).getText().then(function(text) {
      var friendlist = text.split('\n')
      expect(friendlist).to.contain(friend);
    });
    next();
  });
};