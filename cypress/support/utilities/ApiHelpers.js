class ApiHelpers {
  static makeRequest(method, endpoint, body = null, headers = {}) {
    return cy.request({
      method: method.toUpperCase(),
      url: `${Cypress.env('apiUrl')}${endpoint}`,
      body,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      failOnStatusCode: false
    })
  }

  static validateResponse(response, expectedStatus = 200) {
    expect(response.status).to.eq(expectedStatus)
    expect(response.body).to.not.be.empty
    return response
  }

  static validateResponseSchema(response, schema) {
    // Basic schema validation - can be extended with JSON Schema validator
    Object.keys(schema).forEach(key => {
      expect(response.body).to.have.property(key)
      if (schema[key].type) {
        expect(typeof response.body[key]).to.eq(schema[key].type)
      }
    })
    return response
  }

  static extractFromResponse(response, path) {
    return path.split('.').reduce((obj, key) => obj && obj[key], response.body)
  }

  static createAuthHeaders(token) {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }

  static logResponse(response) {
    cy.task('log', `Response Status: ${response.status}`)
    cy.task('log', `Response Body: ${JSON.stringify(response.body, null, 2)}`)
    return response
  }
}

export default ApiHelpers