const path = require('path');

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'], // <-- Remove angularKarma.framework

    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('karma-allure-reporter'),
      require('@angular-devkit/build-angular/plugins/karma') // <-- just load the plugin
    ],

    client: {
      jasmine: {},
      clearContext: false
    },

    reporters: ['progress', 'kjhtml', 'allure'],

    allureReporter: {
      outputDir: path.join(__dirname, 'allure-results'),
      useTimestamp: false
    },

    browsers: ['ChromeHeadlessNoSandbox'],

    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-gpu',
          '--disable-dev-shm-usage'
        ]
      }
    },

    singleRun: true,
    restartOnFileChange: false
  });
};
