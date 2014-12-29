var _    = require('lodash');
var conf = require("./protractor.conf.js").config;
delete conf.seleniumAddress;

exports.config = _.assign(conf, {
  sauceUser: process.env.SAUCE_USERNAME,
  sauceKey: process.env.SAUCE_ACCESS_KEY
});