import { JasmineAllureReporter } from 'jasmine-allure2-reporter';

// This registers the reporter globally for all Jasmine tests
jasmine.getEnv().addReporter(new JasmineAllureReporter({
  allureReportDir: 'allure-results' 
} as any));