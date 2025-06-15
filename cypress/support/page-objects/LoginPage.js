import BasePage from './BasePage.js'

class LoginPage extends BasePage {
  constructor() {
    super()
    this.url = '/login'
  }

  // Selectors
  get loginForm() { return cy.get('.login-form') }
  get signupForm() { return cy.get('.signup-form') }
  get loginEmailInput() { return cy.get('[data-qa="login-email"]') }
  get loginPasswordInput() { return cy.get('[data-qa="login-password"]') }
  get loginButton() { return cy.get('[data-qa="login-button"]') }
  get signupNameInput() { return cy.get('[data-qa="signup-name"]') }
  get signupEmailInput() { return cy.get('[data-qa="signup-email"]') }
  get signupButton() { return cy.get('[data-qa="signup-button"]') }
  get loginErrorMessage() { return cy.get('.login-form p') }
  get signupErrorMessage() { return cy.get('.signup-form p') }

  // Actions
  login(email, password) {
    this.loginEmailInput.type(email)
    this.loginPasswordInput.type(password)
    this.loginButton.click()
    return this
  }

  signup(name, email) {
    this.signupNameInput.type(name)
    this.signupEmailInput.type(email)
    this.signupButton.click()
    return this
  }

  clearLoginForm() {
    this.loginEmailInput.clear()
    this.loginPasswordInput.clear()
    return this
  }

  clearSignupForm() {
    this.signupNameInput.clear()
    this.signupEmailInput.clear()
    return this
  }

  // Assertions
  verifyLoginPageLoaded() {
    this.loginForm.should('be.visible')
    this.signupForm.should('be.visible')
    return this
  }

  verifyLoginError(errorMessage) {
    this.loginErrorMessage.should('contain.text', errorMessage)
    return this
  }

  verifySignupError(errorMessage) {
    this.signupErrorMessage.should('contain.text', errorMessage)
    return this
  }
}

export default LoginPage