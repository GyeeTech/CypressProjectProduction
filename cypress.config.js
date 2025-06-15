import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    // Base URL for the application
    baseUrl: 'https://automationexercise.com',
    
    // Test files location
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    
    // Support file
    supportFile: 'cypress/support/e2e.js',
    
    // Screenshots and videos
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    video: true,
    screenshotOnRunFailure: true,
    
    // Viewport settings
    viewportWidth: 1280,
    viewportHeight: 720,
    
    // Timeouts
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    
    // Retry settings
    retries: {
      runMode: 2,
      openMode: 0
    },
    
    // Test isolation
    testIsolation: true,
    
    // Reporter configuration
    reporter: 'cypress-mochawesome-reporter',
    reporterOptions: {
      reportDir: 'cypress/reports',
      charts: true,
      reportPageTitle: 'Cypress Test Report',
      embeddedScreenshots: true,
      inlineAssets: true
    },
    
    // Environment variables
    env: {
      // API endpoints
      apiUrl: 'https://automationexercise.com/api',
      
      // Test data
      testEmail: 'test@example.com',
      testPassword: 'password123',
      
      // Timeouts
      shortWait: 2000,
      mediumWait: 5000,
      longWait: 10000,
      
      // Browser settings
      hideXHRInCommandLog: true,
      
      // Test tags
      tags: '@smoke,@regression'
    },
    
    setupNodeEvents(on, config) {
      // Cypress mochawesome reporter plugin
      require('cypress-mochawesome-reporter/plugin')(on);
      
      // Task for logging
      on('task', {
        log(message) {
          console.log(message)
          return null
        },
        table(message) {
          console.table(message)
          return null
        }
      })
      
      // Custom tasks for file operations
      on('task', {
        readFileMaybe(filename) {
          if (fs.existsSync(filename)) {
            return fs.readFileSync(filename, 'utf8')
          }
          return null
        }
      })
      
      return config
    }
  },
  
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
    specPattern: 'src/**/*.{cy,spec}.{js,ts,jsx,tsx}',
    supportFile: 'cypress/support/component.js'
  }
})