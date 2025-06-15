import ApiHelpers from '../../support/utilities/ApiHelpers.js'
import TestDataGenerator from '../../support/utilities/TestDataGenerator.js'

describe('Authentication API Tests', () => {
  let testData, generatedUser

  beforeEach(() => {
    cy.fixture('testData.json').then((data) => {
      testData = data
    })
    generatedUser = TestDataGenerator.generateUser()
  })

  it('Should verify login with valid credentials', { tags: '@api @smoke' }, () => {
    const loginData = {
      email: testData.api.validCredentials.email,
      password: testData.api.validCredentials.password
    }

    cy.apiPost('/verifyLogin', loginData).then((response) => {
      ApiHelpers.validateResponse(response, 200)
      
      expect(response.body).to.have.property('responseCode', 200)
      expect(response.body).to.have.property('message', 'User exists!')
    })
  })

  it('Should reject login with invalid credentials', { tags: '@api @regression' }, () => {
    const loginData = {
      email: 'invalid@email.com',
      password: 'wrongpassword'
    }

    cy.apiPost('/verifyLogin', loginData).then((response) => {
      expect(response.status).to.equal(200)
      expect(response.body).to.have.property('responseCode', 404)
      expect(response.body).to.have.property('message', 'User not found!')
    })
  })

  it('Should create new account successfully', { tags: '@api @regression' }, () => {
    const accountData = {
      name: generatedUser.firstName,
      email: generatedUser.email,
      password: generatedUser.password,
      title: 'Mr',
      birth_date: '1',
      birth_month: 'January',
      birth_year: '1990',
      firstname: generatedUser.firstName,
      lastname: generatedUser.lastName,
      company: generatedUser.company,
      address1: generatedUser.address1,
      address2: generatedUser.address2,
      country: 'United States',
      zipcode: generatedUser.zipcode,
      state: generatedUser.state,
      city: generatedUser.city,
      mobile_number: generatedUser.mobileNumber
    }

    cy.apiPost('/createAccount', accountData).then((response) => {
      ApiHelpers.validateResponse(response, 201)
      
      expect(response.body).to.have.property('responseCode', 201)
      expect(response.body).to.have.property('message', 'User created!')
    })
  })

  it('Should prevent duplicate account creation', { tags: '@api @regression' }, () => {
    const existingAccountData = {
      name: 'Test User',
      email: testData.api.validCredentials.email,
      password: 'password123'
    }

    cy.apiPost('/createAccount', existingAccountData).then((response) => {
      expect(response.body).to.have.property('responseCode', 400)
      expect(response.body).to.have.property('message', 'Email already exists!')
    })
  })

  it('Should get user details by email', { tags: '@api @regression' }, () => {
    const userData = {
      email: testData.api.validCredentials.email
    }

    cy.apiPost('/getUserDetailByEmail', userData).then((response) => {
      ApiHelpers.validateResponse(response, 200)
      
      expect(response.body).to.have.property('responseCode', 200)
      expect(response.body).to.have.property('user')
      
      const user = response.body.user
      expect(user).to.have.property('id')
      expect(user).to.have.property('name')
      expect(user).to.have.property('email', testData.api.validCredentials.email)
    })
  })

  it('Should handle non-existent user lookup', { tags: '@api @regression' }, () => {
    const userData = {
      email: 'nonexistent@email.com'
    }

    cy.apiPost('/getUserDetailByEmail', userData).then((response) => {
      expect(response.body).to.have.property('responseCode', 404)
      expect(response.body).to.have.property('message', 'Account not found with this email, try another email!')
    })
  })

  it('Should validate API request formats', { tags: '@api @regression' }, () => {
    // Test with missing email field
    const incompleteData = {
      password: 'password123'
    }

    cy.apiPost('/verifyLogin', incompleteData).then((response) => {
      expect(response.status).to.not.equal(200)
    })
  })

  it('Should handle empty request body', { tags: '@api @regression' }, () => {
    cy.apiPost('/verifyLogin', {}).then((response) => {
      expect(response.body).to.have.property('responseCode')
      expect(response.body.responseCode).to.not.equal(200)
    })
  })

  it('Should validate authentication response structure', { tags: '@api @regression' }, () => {
    const loginData = {
      email: testData.api.validCredentials.email,
      password: testData.api.validCredentials.password
    }

    cy.apiPost('/verifyLogin', loginData).then((response) => {
      ApiHelpers.validateResponse(response, 200)
      
      // Validate response schema
      const expectedSchema = {
        responseCode: { type: 'number' },
        message: { type: 'string' }
      }
      
      ApiHelpers.validateResponseSchema(response, expectedSchema)
    })
  })

  it('Should test rate limiting', { tags: '@api @performance' }, () => {
    const loginData = {
      email: 'test@email.com',
      password: 'wrongpassword'
    }

    // Make multiple rapid requests
    const requests = []
    for (let i = 0; i < 10; i++) {
      requests.push(cy.apiPost('/verifyLogin', loginData))
    }

    // All requests should be handled (may implement rate limiting later)
    requests.forEach((request, index) => {
      request.then((response) => {
        expect(response.status).to.be.oneOf([200, 429]) // 429 = Too Many Requests
        cy.task('log', `Rate limit test request ${index + 1}: ${response.status}`)
      })
    })
  })
})