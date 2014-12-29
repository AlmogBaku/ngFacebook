exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  baseUrl: 'http://localhost:'+(process.env.HTTP_PORT || 8081)+'/test/',
  framework: 'cucumber',
  specs: [
    'features/*.feature'
  ],
  cucumberOpts: {
    require: 'specs/*.js',
    format: 'summary'
  }
};