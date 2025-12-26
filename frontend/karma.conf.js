// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('karma-allure-reporter') // --- ADDED THIS ---
    ],
    client: {
      jasmine: {
        // Configuration options for Jasmine
      },
    },
    jasmineHtmlReporter: {
      suppressAll: true 
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/frontend'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' }
      ]
    },

    // --- ADDED ALLURE REPORTER CONFIG ---
    reporters: ['progress', 'kjhtml', 'allure'], 
    allureReporter: {
      reportDir: 'allure-results', // This generates results in frontend/allure-results
      useTimestamp: false
    },
    // ------------------------------------
    
    // --- UPDATED FOR DOCKER/JENKINS ---
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
    // ----------------------------------

    restartOnFileChange: true,
    singleRun: true // Ensures the process exits after tests finish in CI
  });
};