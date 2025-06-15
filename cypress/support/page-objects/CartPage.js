import BasePage from './BasePage.js'

class CartPage extends BasePage {
  constructor() {
    super()
    this.url = '/view_cart'
  }

  // Selectors
  get cartTable() { return cy.get('#cart_info_table') }
  get cartItems() { return cy.get('tbody tr') }
  get proceedToCheckoutButton() { return cy.get('.check_out') }
  get emptyCartMessage() { return cy.get('#empty_cart') }
  get removeButtons() { return cy.get('.cart_quantity_delete') }
  get quantityInputs() { return cy.get('.cart_quantity_input') }

  // Actions
  removeItem(index = 0) {
    this.removeButtons.eq(index).click()
    return this
  }

  updateQuantity(index, quantity) {
    this.quantityInputs.eq(index).clear().type(quantity)
    return this
  }

  proceedToCheckout() {
    this.proceedToCheckoutButton.click()
    return this
  }

  getItemName(index = 0) {
    return this.cartItems.eq(index).find('.cart_description h4').invoke('text')
  }

  getItemPrice(index = 0) {
    return this.cartItems.eq(index).find('.cart_price p').invoke('text')
  }

  getItemQuantity(index = 0) {
    return this.cartItems.eq(index).find('.cart_quantity button').invoke('text')
  }

  getTotalPrice(index = 0) {
    return this.cartItems.eq(index).find('.cart_total_price').invoke('text')
  }

  // Assertions
  verifyCartPageLoaded() {
    this.cartTable.should('be.visible')
    return this
  }

  verifyCartNotEmpty() {
    this.cartItems.should('have.length.greaterThan', 0)
    return this
  }

  verifyCartEmpty() {
    this.emptyCartMessage.should('be.visible')
    return this
  }

  verifyItemInCart(itemName) {
    this.cartItems.should('contain.text', itemName)
    return this
  }
}

export default CartPage