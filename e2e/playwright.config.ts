import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false, 
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on',
    screenshot: 'on',
    video: 'on-first-retry',
  },

  webServer: [
    {
      command: 'cd ../backend && ./mvnw spring-boot:run',
      url: 'http://localhost:8080/api/health', 
      // CHANGE THIS TO TRUE
      reuseExistingServer: true, 
      timeout: 180000,
    },
    {
      command: 'cd ../frontend && npx ng serve --host 0.0.0.0 --disable-host-check',
      url: 'http://localhost:4200',
      // CHANGE THIS TO TRUE
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