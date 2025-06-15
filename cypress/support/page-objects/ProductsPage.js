import BasePage from './BasePage.js'

class ProductsPage extends BasePage {
  constructor() {
    super()
    this.url = '/products'
  }

  // Selectors
  get productsContainer() { return cy.get('.features_items') }
  get productItems() { return cy.get('.productinfo') }
  get searchInput() { return cy.get('#search_product') }
  get searchButton() { return cy.get('#submit_search') }
  get viewProductLinks() { return cy.get('.choose a[href*="product_details"]') }
  get addToCartButtons() { return cy.get('.add-to-cart') }
  get continueShoppingButton() { return cy.get('.modal-footer .btn-success') }
  get viewCartButton() { return cy.get('.modal-footer .btn-block') }

  // Actions
  searchProduct(productName) {
    this.searchInput.type(productName)
    this.searchButton.click()
    return this
  }

  viewProduct(index = 0) {
    this.viewProductLinks.eq(index).click()
    return this
  }

  addProductToCart(index = 0) {
    this.productItems.eq(index).find('.add-to-cart').click()
    this.continueShoppingButton.click()
    return this
  }

  addProductToCartAndView(index = 0) {
    this.productItems.eq(index).find('.add-to-cart').click()
    this.viewCartButton.click()
    return this
  }

  hoverOnProduct(index = 0) {
    this.productItems.eq(index).trigger('mouseover')
    return this
  }

  getProductName(index = 0) {
    return this.productItems.eq(index).find('p').invoke('text')
  }

  getProductPrice(index = 0) {
    return this.productItems.eq(index).find('h2').invoke('text')
  }

  // Assertions
  verifyProductsPageLoaded() {
    this.productsContainer.should('be.visible')
    this.productItems.should('have.length.greaterThan', 0)
    return this
  }

  verifySearchResults(searchTerm) {
    this.productItems.each(($product) => {
      cy.wrap($product).find('p').should('contain.text', searchTerm)
    })
    return this
  }

  verifyProductCount(expectedCount) {
    this.productItems.should('have.length', expectedCount)
    return this
  }
}

export default ProductsPage