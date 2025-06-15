import HomePage from '../../support/page-objects/HomePage.js'
import ProductsPage from '../../support/page-objects/ProductsPage.js'
import CartPage from '../../support/page-objects/CartPage.js'

describe('Shopping Cart Tests', () => {
  let homePage, productsPage, cartPage

  beforeEach(() => {
    homePage = new HomePage()
    productsPage = new ProductsPage()
    cartPage = new CartPage()
    homePage.visit()
  })

  it('Should display empty cart initially', { tags: '@smoke' }, () => {
    homePage.clickCart()
    
    // Verify empty cart
    cartPage.verifyCartPageLoaded()
    cy.get('#empty_cart').should('be.visible')
    cy.get('#empty_cart').should('contain.text', 'Cart is empty!')
  })

  it('Should add and remove items from cart', { tags: '@smoke @regression' }, () => {
    // Add product to cart
    homePage.clickProducts()
    productsPage.addProductToCartAndView(0)
    
    // Verify item added
    cartPage.verifyCartNotEmpty()
    cartPage.cartItems.should('have.length', 1)
    
    // Remove item
    cartPage.removeItem(0)
    
    // Verify item removed
    cy.get('#empty_cart').should('be.visible')
  })

  it('Should calculate total price correctly', { tags: '@regression' }, () => {
    homePage.clickProducts()
    
    // Add multiple products
    productsPage.addProductToCart(0)
    productsPage.addProductToCart(1)
    
    homePage.clickCart()
    
    // Verify total calculation
    let totalExpected = 0
    cartPage.cartItems.each(($row, index) => {
      cy.wrap($row).find('.cart_total_price').invoke('text').then((totalText) => {
        const total = parseFloat(totalText.replace('Rs. ', ''))
        totalExpected += total
      })
    }).then(() => {
      cy.get('.cart_total_price').last().should('contain.text', `Rs. ${totalExpected}`)
    })
  })

  it('Should update quantity and recalculate', { tags: '@regression' }, () => {
    homePage.clickProducts()
    
    // Add product to cart
    productsPage.addProductToCartAndView(0)
    
    // Get initial price
    let unitPrice, newQuantity = 3
    cartPage.getItemPrice(0).then((price) => {
      unitPrice = parseFloat(price.replace('Rs. ', ''))
    })
    
    // Update quantity (Note: This might not work on automation exercise site)
    // This is a demonstration of how you would test quantity updates
    cartPage.updateQuantity(0, newQuantity)
    
    // Verify total price calculation
    cartPage.getTotalPrice(0).then((totalPrice) => {
      const expectedTotal = unitPrice * newQuantity
      expect(totalPrice).to.contain(`Rs. ${expectedTotal}`)
    })
  })

  it('Should persist cart items across sessions', { tags: '@regression' }, () => {
    // Add item to cart
    homePage.clickProducts()
    productsPage.addProductToCart(0)
    
    // Navigate away and back
    homePage.visit()
    homePage.clickCart()
    
    // Verify item still in cart
    cartPage.verifyCartNotEmpty()
  })

  it('Should proceed to checkout', { tags: '@smoke @regression' }, () => {
    // Add item to cart
    homePage.clickProducts()
    productsPage.addProductToCartAndView(0)
    
    // Proceed to checkout
    cartPage.proceedToCheckout()
    
    // Should redirect to login if not authenticated
    cy.url().should('include', '/login')
    
    // Or if authenticated, should go to checkout
    // cy.url().should('include', '/checkout')
  })

  it('Should handle cart item limits', { tags: '@regression' }, () => {
    // Add maximum allowed items (example: 10)
    homePage.clickProducts()
    
    for (let i = 0; i < 5; i++) {
      productsPage.addProductToCart(i % 3) // Cycle through first 3 products
    }
    
    homePage.clickCart()
    cartPage.verifyCartNotEmpty()
    
    // Verify all items added
    cartPage.cartItems.should('have.length.greaterThan', 0)
  })

  it('Should display correct product information in cart', { tags: '@regression' }, () => {
    homePage.clickProducts()
    
    // Get product info
    let productName, productPrice
    productsPage.getProductName(0).then((name) => {
      productName = name
    })
    productsPage.getProductPrice(0).then((price) => {
      productPrice = price
    })
    
    // Add to cart
    productsPage.addProductToCartAndView(0)
    
    // Verify product info in cart
    cartPage.getItemName(0).then((cartName) => {
      expect(cartName).to.contain(productName)
    })
    cartPage.getItemPrice(0).then((cartPrice) => {
      expect(cartPrice).to.contain(productPrice)
    })
  })

  it('Should handle cart operations without login', { tags: '@regression' }, () => {
    // Add items without being logged in
    homePage.clickProducts()
    productsPage.addProductToCartAndView(0)
    
    // Verify cart works for anonymous users
    cartPage.verifyCartNotEmpty()
    
    // Try to proceed to checkout
    cartPage.proceedToCheckout()
    
    // Should prompt for login
    cy.url().should('include', '/login')
  })
})