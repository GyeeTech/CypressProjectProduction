// Import commands
import './commands'

// Import plugins
import 'cypress-mochawesome-reporter/register'
import 'cypress-real-events/support'
import 'cypress-file-upload'
import 'cypress-xpath'

// Global configuration
Cypress.on('uncaught:exception', (err, runnable) => {
  // Prevent Cypress from failing on uncaught exceptions
  return false
})

// Before each test
beforeEach(() => {
  // Clear cookies and local storage
  cy.clearCookies()
  cy.clearLocalStorage()
  
  // Set viewport
  cy.viewport(1280, 720)
})

// After each test
afterEach(() => {
  // Take screenshot on failure
  if (Cypress.currentTest.state === 'failed') {
    cy.screenshot(`failed-${Cypress.currentTest.title}`)
  }
})

// Global error handling
Cypress.on('fail', (error, runnable) => {
  debugger
  throw error
})