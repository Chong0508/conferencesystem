import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false, // Recommended for sequential business flows
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on',
    screenshot: 'on',
    video: 'on-first-retry',
  },

  /* This block starts your app automatically inside the Jenkins container */
  webServer: [
    {
      // Command to start the Spring Boot Backend
      command: 'cd ../backend && ./mvnw spring-boot:run',
      url: 'http://localhost:8080/api/health', // Ensure this returns 200 OK
      reuseExistingServer: !process.env.CI,
      timeout: 180000, // 3 minutes for Spring Boot startup
    },
    {
      // Command to start the Angular Frontend
      command: 'cd ../frontend && npx ng serve --host 0.0.0.0 --disable-host-check',
      url: 'http://localhost:4200',
      reuseExistingServer: !process.env.CI,
      timeout: 120000, // 2 minutes for Angular compilation
    }
  ],

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});