import { defineConfig } from 'cypress';

export default defineConfig({
  defaultCommandTimeout: 10000,
  viewportWidth: 1024,
  viewportHeight: 768,
  env: {
    BACKEND_CONTAINER_NAME: 'backend',
  },
  e2e: {
    baseUrl: 'https://localhost:3000',
    specPattern: 'cypress/tests/**/*.cy.{js,jsx,ts,tsx}',
  },
});
