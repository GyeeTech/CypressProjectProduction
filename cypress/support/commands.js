// Custom commands for the automation framework

// Authentication commands
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login')
  cy.get('[data-qa="login-email"]').type(email)
  cy.get('[data-qa="login-password"]').type(password)
  cy.get('[data-qa="login-button"]').click()
  cy.url().should('not.include', '/login')
})

Cypress.Commands.add('logout', () => {
  cy.get('a[href="/logout"]').click()
  cy.url().should('include', '/login')
})

// Navigation commands
Cypress.Commands.add('navigateToPage', (page) => {
  const pages = {
    'home': '/',
    'products': '/products',
    'cart': '/view_cart',
    'login': '/login',
    'contact': '/contact_us',
    'signup': '/login'
  }
  cy.visit(pages[page] || page)
})

// Form filling commands
Cypress.Commands.add('fillContactForm', (contactData) => {
  cy.get('[data-qa="name"]').type(contactData.name)
  cy.get('[data-qa="email"]').type(contactData.email)
  cy.get('[data-qa="subject"]').type(contactData.subject)
  cy.get('[data-qa="message"]').type(contactData.message)
})

Cypress.Commands.add('fillSignupForm', (userData) => {
  cy.get('[data-qa="signup-name"]').type(userData.name)
  cy.get('[data-qa="signup-email"]').type(userData.email)
  cy.get('[data-qa="signup-button"]').click()
})

// Product commands
Cypress.Commands.add('addProductToCart', (productIndex = 0) => {
  cy.get('.productinfo')
    .eq(productIndex)
    .find('.add-to-cart')
    .click()
  cy.get('.modal-footer .btn-success').click()
})

Cypress.Commands.add('searchProduct', (productName) => {
  cy.get('#search_product').type(productName)
  cy.get('#submit_search').click()
})

// Assertion commands
Cypress.Commands.add('shouldBeVisible', (selector) => {
  cy.get(selector).should('be.visible')
})

Cypress.Commands.add('shouldContainText', (selector, text) => {
  cy.get(selector).should('contain.text', text)
})

Cypress.Commands.add('shouldHaveAttribute', (selector, attribute, value) => {
  cy.get(selector).should('have.attr', attribute, value)
})

// Wait commands
Cypress.Commands.add('waitForElement', (selector, timeout = 10000) => {
  cy.get(selector, { timeout }).should('be.visible')
})

Cypress.Commands.add('waitForAPI', (alias) => {
  cy.wait(alias).then((interception) => {
    expect(interception.response.statusCode).to.be.oneOf([200, 201, 202])
  })
})

// API commands
Cypress.Commands.add('apiRequest', (method, url, body = null, headers = {}) => {
  return cy.request({
    method,
    url: `${Cypress.env('apiUrl')}${url}`,
    body,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    failOnStatusCode: false
  })
})

Cypress.Commands.add('apiGet', (endpoint, headers = {}) => {
  return cy.apiRequest('GET', endpoint, null, headers)
})

Cypress.Commands.add('apiPost', (endpoint, body, headers = {}) => {
  return cy.apiRequest('POST', endpoint, body, headers)
})

Cypress.Commands.add('apiPut', (endpoint, body, headers = {}) => {
  return cy.apiRequest('PUT', endpoint, body, headers)
})

Cypress.Commands.add('apiDelete', (endpoint, headers = {}) => {
  return cy.apiRequest('DELETE', endpoint, null, headers)
})

// File upload commands
Cypress.Commands.add('uploadFile', (selector, fileName, fileType = 'image/png') => {
  cy.get(selector).attachFile({
    filePath: fileName,
    mimeType: fileType
  })
})

// Database commands (mock)
Cypress.Commands.add('resetDatabase', () => {
  // Mock database reset - replace with actual DB operations
  cy.task('log', 'Database reset completed')
})

// Screenshot commands
Cypress.Commands.add('takeScreenshot', (name) => {
  cy.screenshot(name || `screenshot-${Date.now()}`)
})

// Local storage commands
Cypress.Commands.add('setLocalStorage', (key, value) => {
  cy.window().then((win) => {
    win.localStorage.setItem(key, value)
  })
})

Cypress.Commands.add('getLocalStorage', (key) => {
  return cy.window().then((win) => {
    return win.localStorage.getItem(key)
  })
})

// Cookie commands
Cypress.Commands.add('setCookie', (name, value, options = {}) => {
  cy.setCookie(name, value, options)
})

Cypress.Commands.add('getCookieValue', (name) => {
  return cy.getCookie(name).then((cookie) => {
    return cookie ? cookie.value : null
  })
})

// Table commands
Cypress.Commands.add('getTableRow', (tableSelector, rowIndex) => {
  return cy.get(`${tableSelector} tbody tr`).eq(rowIndex)
})

Cypress.Commands.add('getTableCell', (tableSelector, row, column) => {
  return cy.get(`${tableSelector} tbody tr`).eq(row).find('td').eq(column)
})

// Iframe commands
Cypress.Commands.add('getIframeBody', (iframeSelector) => {
  return cy
    .get(iframeSelector)
    .its('0.contentDocument.body')
    .should('not.be.empty')
    .then(cy.wrap)
})

// Date commands
Cypress.Commands.add('selectDate', (datePickerSelector, date) => {
  cy.get(datePickerSelector).click()
  cy.get('.datepicker').contains(date).click()
})

// Drag and drop commands
Cypress.Commands.add('dragAndDrop', (source, target) => {
  cy.get(source).trigger('mousedown', { which: 1 })
  cy.get(target).trigger('mousemove').trigger('mouseup')
})