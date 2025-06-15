// Component testing support file
import { mount } from 'cypress/react18'

Cypress.Commands.add('mount', mount)

// Example component testing command
Cypress.Commands.add('mountWithProps', (component, props = {}) => {
  return cy.mount(component, { props })
})