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
    setTimeout(function() {
      next();
    }, 3000);
  });
  this.Then('facebook sdk should be loaded', function(next) {
    browser.driver.executeScript(function() {
      return window.FB;
    }).then(function(FB) {
      expect(FB).to.exist;
      next();
    });
  });

  this.Given('an anonymous state', function(next) {
    browser.driver.executeScript(function() {
      window.addEventListener('fb.load', function () {
        window.FB.logout();
      });
    }).then(function() {
      setTimeout(function() {
        next();
      }, 500);
    });
  });
  this.When('I login with facebook user "$user" with password "$pass"', function(user, pass, next) {
    element(by.id('login-btn')).click()
      .then(function() {
        return browser.getAllWindowHandles();
      })
      .then(function(handles) {
        return browser.switchTo().window(handles[1]);
      })
      .then(function() {
        browser.driver.findElement(by.id('email')).sendKeys(user);
        browser.driver.findElement(by.id('pass')).sendKeys(pass);
        return browser.driver.findElement(by.id('loginbutton')).click();
      })
      .then(function(){
        var deferred = protractor.promise.defer();

        function continuePromise() {
          setTimeout(function() {
            deferred.fulfill();
          }, 1500);
        }
        browser.driver.isElementPresent(by.id('platformDialogForm')).then(function(exists) {
          if(exists) {
            deferred.fulfill(browser.driver.findElement(by.css('button[name=__CONFIRM__]')).click().then());
          } else {
            continuePromise();
          }
        }).thenCatch(continuePromise);
        return deferred.promise;
      })
      .then(browser.getAllWindowHandles)
      .then(function(handles) {
        return browser.switchTo().window(handles[0]);
      })
      .then(function() {
        setTimeout(function() {
          next();
        }, 500);
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
};