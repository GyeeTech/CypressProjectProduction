import HomePage from '../../support/page-objects/HomePage.js'
import ProductsPage from '../../support/page-objects/ProductsPage.js'
import CartPage from '../../support/page-objects/CartPage.js'

describe('Products Functionality Tests', () => {
  let homePage, productsPage, cartPage, testData

  beforeEach(() => {
    homePage = new HomePage()
    productsPage = new ProductsPage()
    cartPage = new CartPage()
    cy.fixture('testData.json').then((data) => {
      testData = data
    })
    homePage.visit()
  })

  it('Should display products page correctly', { tags: '@smoke' }, () => {
    homePage.clickProducts()
    
    productsPage.verifyProductsPageLoaded()
    
    // Verify search functionality exists
    productsPage.searchInput.should('be.visible')
    productsPage.searchButton.should('be.visible')
    
    // Verify products are displayed
    productsPage.productItems.should('have.length.greaterThan', 0)
  })

  it('Should search for products successfully', { tags: '@smoke @regression' }, () => {
    const searchTerm = testData.products.searchTerms[0]
    
    homePage.clickProducts()
    productsPage.searchProduct(searchTerm)
    
    // Verify search results
    cy.get('h2').should('contain.text', 'Searched Products')
    productsPage.productItems.should('have.length.greaterThan', 0)
    
    // Verify search term appears in results
    productsPage.productItems.each(($product) => {
      cy.wrap($product).should('contain.text', searchTerm)
    })
  })

  it('Should add product to cart successfully', { tags: '@smoke @regression' }, () => {
    homePage.clickProducts()
    
    // Get first product name for verification
    let productName
    productsPage.getProductName(0).then((name) => {
      productName = name
    })
    
    // Add product to cart
    productsPage.addProductToCartAndView(0)
    
    // Verify cart page
    cartPage.verifyCartPageLoaded()
    cartPage.verifyCartNotEmpty()
    
    // Verify product is in cart
    cartPage.getItemName(0).then((cartItemName) => {
      expect(cartItemName).to.contain(productName)
    })
  })

  it('Should add multiple products to cart', { tags: '@regression' }, () => {
    homePage.clickProducts()
    
    // Add multiple products
    productsPage.addProductToCart(0)
    productsPage.addProductToCart(1)
    productsPage.addProductToCart(2)
    
    // Go to cart
    homePage.clickCart()
    
    // Verify multiple items in cart
    cartPage.verifyCartNotEmpty()
    cartPage.cartItems.should('have.length', 3)
  })

  it('Should view product details', { tags: '@regression' }, () => {
    homePage.clickProducts()
    productsPage.viewProduct(0)
    
    // Verify product details page
    cy.url().should('include', '/product_details')
    cy.get('.product-information').should('be.visible')
    cy.get('.product-information h2').should('be.visible')
    cy.get('.product-information p').should('contain.text', 'Category:')
    cy.get('.product-information span span').should('be.visible') // Price
  })

  it('Should handle product quantity in cart', { tags: '@regression' }, () => {
    homePage.clickProducts()
    
    // View product details and add with quantity
    productsPage.viewProduct(0)
    cy.get('#quantity').clear().type('3')
    cy.get('.btn-cart').click()
    cy.get('.modal-footer .btn-block').click()
    
    // Verify quantity in cart
    cartPage.verifyCartPageLoaded()
    cartPage.getItemQuantity(0).then((quantity) => {
      expect(quantity).to.equal('3')
    })
  })

  it('Should filter products by category', { tags: '@regression' }, () => {
    homePage.selectCategory('Women')
    homePage.selectSubCategory('Dress')
    
    // Verify category page
    cy.url().should('include', '/category_products')
    cy.get('h2').should('contain.text', 'Women - Dress Products')
    productsPage.productItems.should('have.length.greaterThan', 0)
  })

  it('Should handle empty search results', { tags: '@regression' }, () => {
    homePage.clickProducts()
    productsPage.searchProduct('nonexistentproduct12345')
    
    // Verify no results message
    cy.get('h2').should('contain.text', 'Searched Products')
    productsPage.productItems.should('have.length', 0)
  })

  it('Should verify product information consistency', { tags: '@regression' }, () => {
    homePage.clickProducts()
    
    // Get product info from products page
    let productName, productPrice
    productsPage.getProductName(0).then((name) => {
      productName = name
    })
    productsPage.getProductPrice(0).then((price) => {
      productPrice = price
    })
    
    // View product details
    productsPage.viewProduct(0)
    
    // Verify consistency
    cy.get('.product-information h2').should('contain.text', productName)
    cy.get('.product-information span span').should('contain.text', productPrice)
  })
})