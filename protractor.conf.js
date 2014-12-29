exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  baseUrl: 'http://localhost:'+(process.env.HTTP_PORT || 8081)+'/test/',
  framework: 'cucumber',
  specs: [
    'test/features/*.feature'
  ],
  cucumberOpts: {
    require: 'test/specs/*.js',
    format: 'pretty'
  },
  sauceUser: process.env.SAUCE_USERNAME,
  sauceKey: process.env.SAUCE_ACCESS_KEY,
  capabilities: {
    'browserName': (process.env.TEST_BROWSER_NAME    || 'chrome'),
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'name': 'ngFacebook Tests'
  }
};

if(process.env.TRAVIS_BUILD_NUMBER) {
  delete exports.config.seleniumAddress;
}