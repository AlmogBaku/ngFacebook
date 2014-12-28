exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  baseUrl: 'http://localhost:8081/test/',
  sauceUser: 'ngFacebook',
  sauceKey: 'da67f9c2-bb80-424b-8879-cac1feae30cd',
  framework: 'cucumber',
  specs: [
    'features/*.feature'
  ],
  cucumberOpts: {
    require: 'specs/*.js',
    format: 'summary'
  }
};