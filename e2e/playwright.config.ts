import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  /* Business flows need to run sequentially to avoid state conflicts */
  fullyParallel: false, 
  
  /* Reporter configuration for Jenkins visibility */
  reporter: 'html',
  
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on',
    screenshot: 'on',
    video: 'on-first-retry',
  },

  /**
   * webServer ensures that both services are alive before tests run.
   */
  webServer: [
    {
      // 1. Spring Boot Backend
      command: 'cd ../backend && ./mvnw spring-boot:run',
      /* Confirmed working endpoint */
      url: 'http://localhost:8080/users', 
      /* FIX: Reuse the server already running in your Docker container */
      reuseExistingServer: true, 
      timeout: 180000,
    },
    {
      // 2. Angular Frontend
      /** * SUCCESS: Using the explicit project and allowed-hosts syntax 
       * that you just verified in your local terminal.
       */
      command: 'cd ../frontend && npx ng serve --project=frontend --host=0.0.0.0 --allowed-hosts=all',
      url: 'http://localhost:4200',
      /* Reuses existing frontend if it's already serving */
      reuseExistingServer: true,
      timeout: 120000,
    }
  ],

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});