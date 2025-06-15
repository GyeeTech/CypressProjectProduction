class BasePage {
  constructor() {
    this.url = ''
  }

  visit() {
    cy.visit(this.url)
    return this
  }

  getTitle() {
    return cy.title()
  }

  getUrl() {
    return cy.url()
  }

  waitForPageLoad() {
    cy.get('body').should('be.visible')
    return this
  }

  scrollTo(position) {
    cy.scrollTo(position)
    return this
  }

  scrollToElement(selector) {
    cy.get(selector).scrollIntoView()
    return this
  }

  takeScreenshot(name) {
    cy.screenshot(name)
    return this
  }

  waitForElement(selector, timeout = 10000) {
    cy.get(selector, { timeout }).should('be.visible')
    return this
  }
}

export default BasePage