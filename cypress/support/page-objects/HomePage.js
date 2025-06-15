import BasePage from './BasePage.js'

class HomePage extends BasePage {
  constructor() {
    super()
    this.url = '/'
  }

  // Selectors
  get header() { return cy.get('header') }
  get logo() { return cy.get('.logo img') }
  get navigationMenu() { return cy.get('.navbar-nav') }
  get homeLink() { return cy.get('a[href="/"]') }
  get productsLink() { return cy.get('a[href="/products"]') }
  get cartLink() { return cy.get('a[href="/view_cart"]') }
  get loginLink() { return cy.get('a[href="/login"]') }
  get contactLink() { return cy.get('a[href="/contact_us"]') }
  get featuredItems() { return cy.get('.features_items') }
  get categorySection() { return cy.get('.left-sidebar') }
  get footer() { return cy.get('footer') }
  get subscriptionInput() { return cy.get('#susbscribe_email') }
  get subscriptionButton() { return cy.get('#subscribe') }

  // Actions
  clickProducts() {
    this.productsLink.click()
    return this
  }

  clickCart() {
    this.cartLink.click()
    return this
  }

  clickLogin() {
    this.loginLink.click()
    return this
  }

  clickContact() {
    this.contactLink.click()
    return this
  }

  subscribeToNewsletter(email) {
    this.subscriptionInput.type(email)
    this.subscriptionButton.click()
    return this
  }

  selectCategory(category) {
    cy.get('.panel-group').contains(category).click()
    return this
  }

  selectSubCategory(subCategory) {
    cy.get('.panel-body').contains(subCategory).click()
    return this
  }

  // Assertions
  verifyHomePageLoaded() {
    this.logo.should('be.visible')
    this.navigationMenu.should('be.visible')
    this.featuredItems.should('be.visible')
    return this
  }

  verifyNavigationMenu() {
    this.homeLink.should('be.visible')
    this.productsLink.should('be.visible')
    this.cartLink.should('be.visible')
    this.loginLink.should('be.visible')
    this.contactLink.should('be.visible')
    return this
  }
}

export default HomePage