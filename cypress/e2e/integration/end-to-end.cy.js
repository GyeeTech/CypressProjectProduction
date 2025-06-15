import HomePage from '../../support/page-objects/HomePage.js'
import LoginPage from '../../support/page-objects/LoginPage.js'
import ProductsPage from '../../support/page-objects/ProductsPage.js'
import CartPage from '../../support/page-objects/CartPage.js'
import TestDataGenerator from '../../support/utilities/TestDataGenerator.js'

describe('End-to-End User Journey Tests', () => {
  let homePage, loginPage, productsPage, cartPage, testData, newUser

  beforeEach(() => {
    homePage = new HomePage()
    loginPage = new LoginPage()
    productsPage = new ProductsPage()
    cartPage = new CartPage()
    newUser = TestDataGenerator.generateUser()
    
    cy.fixture('testData.json').then((data) => {
      testData = data
    })
  })

  it('Complete user registration and shopping flow', { tags: '@e2e @smoke' }, () => {
    // Step 1: Visit homepage
    homePage.visit()
    homePage.verifyHomePageLoaded()

    // Step 2: Register new user
    homePage.clickLogin()
    loginPage.signup(newUser.firstName, newUser.email)
    
    // Fill registration form
    cy.get('[data-qa="title"]').check()
    cy.get('[data-qa="password"]').type(newUser.password)
    cy.get('[data-qa="days"]').select('15')
    cy.get('[data-qa="months"]').select('January')
    cy.get('[data-qa="years"]').select('1990')
    
    cy.get('[data-qa="first_name"]').type(newUser.firstName)
    cy.get('[data-qa="last_name"]').type(newUser.lastName)
    cy.get('[data-qa="company"]').type(newUser.company)
    cy.get('[data-qa="address"]').type(newUser.address1)
    cy.get('[data-qa="country"]').select('United States')
    cy.get('[data-qa="state"]').type(newUser.state)
    cy.get('[data-qa="city"]').type(newUser.city)
    cy.get('[data-qa="zipcode"]').type(newUser.zipcode)
    cy.get('[data-qa="mobile_number"]').type(newUser.mobileNumber)
    
    cy.get('[data-qa="create-account"]').click()

    // Verify account created
    cy.get('[data-qa="account-created"]').should('be.visible')
    cy.get('[data-qa="continue-button"]').click()

    // Step 3: Browse and add products to cart
    homePage.clickProducts()
    productsPage.verifyProductsPageLoaded()
    
    // Add multiple products
    productsPage.addProductToCart(0)
    productsPage.addProductToCart(1)
    
    // Step 4: View cart and verify items
    homePage.clickCart()
    cartPage.verifyCartNotEmpty()
    cartPage.cartItems.should('have.length', 2)

    // Step 5: Proceed to checkout
    cartPage.proceedToCheckout()
    
    // Verify checkout page
    cy.url().should('include', '/checkout')
    cy.get('.checkout-information').should('be.visible')

    // Step 6: Complete order (mock)
    cy.get('[data-qa="comment-text"]').type('Test order comment')
    cy.get('.btn-default.check_out').click()

    // Fill payment details
    cy.get('[data-qa="name-on-card"]').type(testData.checkout.cardDetails.nameOnCard)
    cy.get('[data-qa="card-number"]').type(testData.checkout.cardDetails.cardNumber)
    cy.get('[data-qa="cvc"]').type(testData.checkout.cardDetails.cvc)
    cy.get('[data-qa="expiry-month"]').type(testData.checkout.cardDetails.expiryMonth)
    cy.get('[data-qa="expiry-year"]').type(testData.checkout.cardDetails.expiryYear)
    
    cy.get('[data-qa="pay-button"]').click()

    // Verify order completion
    cy.get('[data-qa="order-placed"]').should('be.visible')
    
    // Step 7: Download invoice (if available)
    cy.get('.btn-default.check_out').click()

    // Step 8: Clean up - delete account
    cy.get('a[href="/delete_account"]').click()
    cy.get('[data-qa="account-deleted"]').should('be.visible')
    cy.get('[data-qa="continue-button"]').click()
  })

  it('Existing user login and purchase flow', { tags: '@e2e @regression' }, () => {
    const user = testData.users.validUser

    // Step 1: Login with existing user
    homePage.visit()
    cy.login(user.email, user.password)

    // Verify successful login
    cy.get('a[href="/logout"]').should('be.visible')

    // Step 2: Search for specific product
    homePage.clickProducts()
    productsPage.searchProduct('dress')
    
    // Verify search results
    cy.get('h2').should('contain.text', 'Searched Products')
    productsPage.productItems.should('have.length.greaterThan', 0)

    // Step 3: Add searched product to cart
    productsPage.addProductToCartAndView(0)

    // Step 4: Verify cart and proceed
    cartPage.verifyCartNotEmpty()
    cartPage.proceedToCheckout()

    // Step 5: Complete checkout flow
    cy.url().should('include', '/checkout')
    
    // Verify address information is pre-filled
    cy.get('#address1').should('contain.text', user.address1)
    cy.get('#address2').should('contain.text', user.city)

    // Step 6: Logout
    cy.logout()
    cy.url().should('include', '/login')
  })

  it('Guest user browsing and cart abandonment', { tags: '@e2e @regression' }, () => {
    // Step 1: Browse as guest
    homePage.visit()
    homePage.verifyHomePageLoaded()

    // Step 2: Browse products
    homePage.clickProducts()
    productsPage.verifyProductsPageLoaded()

    // Step 3: Add products to cart without login
    productsPage.addProductToCart(0)
    productsPage.addProductToCart(1)

    // Step 4: Try to checkout without login
    homePage.clickCart()
    cartPage.verifyCartNotEmpty()
    cartPage.proceedToCheckout()

    // Should be redirected to login
    cy.url().should('include', '/login')

    // Step 5: Verify cart persists after login redirect
    cy.get('.modal-body').should('contain.text', 'Register / Login account to proceed on checkout.')
    cy.get('.modal-footer .btn-success').click()

    // Login
    const user = testData.users.validUser
    loginPage.login(user.email, user.password)

    // Verify cart still has items
    homePage.clickCart()
    cartPage.verifyCartNotEmpty()
  })

  it('Product review and rating flow', { tags: '@e2e @regression' }, () => {
    const user = testData.users.validUser

    // Login
    homePage.visit()
    cy.login(user.email, user.password)

    // Browse to product details
    homePage.clickProducts()
    productsPage.viewProduct(0)

    // Add review
    cy.get('#name').type(user.name)
    cy.get('#email').type(user.email)
    cy.get('#review').type('This is a great product! Highly recommended.')
    cy.get('#button-review').click()

    // Verify review submission
    cy.get('.alert-success').should('contain.text', 'Thank you for your review.')

    // Logout
    cy.logout()
  })

  it('Newsletter subscription flow', { tags: '@e2e @regression' }, () => {
    const testEmail = TestDataGenerator.generateEmail()

    // Visit homepage
    homePage.visit()

    // Subscribe to newsletter
    homePage.subscribeToNewsletter(testEmail)

    // Verify subscription
    cy.get('.alert-success').should('be.visible')
    cy.get('.alert-success').should('contain.text', 'You have been successfully subscribed!')
  })

  it('Contact form submission flow', { tags: '@e2e @regression' }, () => {
    const contactData = TestDataGenerator.generateContactForm()

    // Navigate to contact page
    homePage.visit()
    homePage.clickContact()

    // Fill and submit contact form
    cy.fillContactForm(contactData)
    
    // Upload file
    cy.get('input[name="upload_file"]').attachFile('sample.txt')
    
    cy.get('input[name="submit"]').click()

    // Verify submission
    cy.get('.status').should('contain.text', 'Success! Your details have been submitted successfully.')

    // Return home
    cy.get('#form-section .btn-success').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })
})