import HomePage from '../../support/page-objects/HomePage.js'
import LoginPage from '../../support/page-objects/LoginPage.js'
import TestDataGenerator from '../../support/utilities/TestDataGenerator.js'

describe('Login Functionality Tests', () => {
  let homePage, loginPage, testData

  beforeEach(() => {
    homePage = new HomePage()
    loginPage = new LoginPage()
    cy.fixture('testData.json').then((data) => {
      testData = data
    })
    homePage.visit()
  })

  it('Should display login page correctly', { tags: '@smoke' }, () => {
    homePage.clickLogin()
    
    loginPage
      .verifyLoginPageLoaded()
      .verifyLoginPageLoaded()
    
    // Verify page elements
    loginPage.loginForm.should('be.visible')
    loginPage.signupForm.should('be.visible')
    loginPage.loginEmailInput.should('be.visible')
    loginPage.loginPasswordInput.should('be.visible')
    loginPage.loginButton.should('be.visible')
  })

  it('Should login with valid credentials', { tags: '@smoke @regression' }, () => {
    const user = testData.users.validUser
    
    homePage.clickLogin()
    loginPage.login(user.email, user.password)
    
    // Verify successful login
    cy.url().should('not.include', '/login')
    cy.get('a[href="/logout"]').should('be.visible')
    cy.get('.navbar-nav').should('contain.text', `Logged in as ${user.name}`)
  })

  it('Should show error for invalid credentials', { tags: '@regression' }, () => {
    const invalidUser = testData.users.invalidUser
    
    homePage.clickLogin()
    loginPage.login(invalidUser.email, invalidUser.password)
    
    // Verify error message
    loginPage.verifyLoginError('Your email or password is incorrect!')
    cy.url().should('include', '/login')
  })

  it('Should show error for empty fields', { tags: '@regression' }, () => {
    homePage.clickLogin()
    loginPage.loginButton.click()
    
    // Verify validation errors
    loginPage.loginEmailInput.then(($input) => {
      expect($input[0].validationMessage).to.not.be.empty
    })
  })

  it('Should navigate to signup from login page', { tags: '@smoke' }, () => {
    const user = TestDataGenerator.generateUser()
    
    homePage.clickLogin()
    loginPage.signup(user.firstName, user.email)
    
    // Verify navigation to signup page
    cy.url().should('include', '/signup')
    cy.get('.signup-form').should('be.visible')
  })

  it('Should logout successfully', { tags: '@smoke @regression' }, () => {
    const user = testData.users.validUser
    
    // Login first
    cy.login(user.email, user.password)
    
    // Logout
    cy.logout()
    
    // Verify logout
    cy.url().should('include', '/login')
    cy.get('a[href="/login"]').should('be.visible')
  })

  it('Should handle multiple login attempts', { tags: '@regression' }, () => {
    homePage.clickLogin()
    
    // Multiple failed attempts
    for (let i = 0; i < 3; i++) {
      loginPage.clearLoginForm()
      loginPage.login('invalid@email.com', 'wrongpassword')
      loginPage.verifyLoginError('Your email or password is incorrect!')
    }
    
    // Successful login after failed attempts
    const user = testData.users.validUser
    loginPage.clearLoginForm()
    loginPage.login(user.email, user.password)
    cy.url().should('not.include', '/login')
  })
})