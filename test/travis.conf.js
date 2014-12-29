var _    = require('lodash');
var conf = require("./protractor.conf.js").config;
//delete conf.seleniumAddress;

exports.config = _.assign(conf, {
  sauceUser: process.env.SAUCE_USERNAME,
  sauceKey: process.env.SAUCE_ACCESS_KEY,
  capabilities: {
    'browserName': (process.env.TEST_BROWSER_NAME    || 'chrome'),
    'version': (process.env.TEST_BROWSER_VERSION || 'ANY'),
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'name': 'ngFacebook Tests'
  }
});