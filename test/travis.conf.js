var _    = require('lodash');
var conf = require("./protractor.conf.js").config;
delete conf.seleniumAddress;

exports.config = _.assign(conf, {
  capabilities: {
    'username': process.env.SAUCE_USERNAME,
    'accessKey': process.env.SAUCE_ACCESS_KEY,
    'browserName': 'chrome',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'name': 'App Tests'
  }
});