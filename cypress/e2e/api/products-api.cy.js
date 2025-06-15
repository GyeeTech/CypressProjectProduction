import ApiHelpers from '../../support/utilities/ApiHelpers.js'

describe('Products API Tests', () => {
  let testData

  beforeEach(() => {
    cy.fixture('testData.json').then((data) => {
      testData = data
    })
  })

  it('Should get all products list', { tags: '@api @smoke' }, () => {
    cy.apiGet('/productsList').then((response) => {
      // Validate response
      ApiHelpers.validateResponse(response, 200)
      
      // Validate response structure
      expect(response.body).to.have.property('responseCode', 200)
      expect(response.body).to.have.property('products')
      expect(response.body.products).to.be.an('array')
      expect(response.body.products.length).to.be.greaterThan(0)
      
      // Validate first product structure
      const firstProduct = response.body.products[0]
      expect(firstProduct).to.have.property('id')
      expect(firstProduct).to.have.property('name')
      expect(firstProduct).to.have.property('price')
      expect(firstProduct).to.have.property('brand')
      expect(firstProduct).to.have.property('category')
    })
  })

  it('Should search for products via API', { tags: '@api @regression' }, () => {
    const searchData = {
      search_product: 'dress'
    }

    cy.apiPost('/searchProduct', searchData).then((response) => {
      ApiHelpers.validateResponse(response, 200)
      
      // Validate search results
      expect(response.body).to.have.property('responseCode', 200)
      expect(response.body).to.have.property('products')
      
      // Verify search results contain the search term
      response.body.products.forEach((product) => {
        expect(product.name.toLowerCase()).to.include('dress')
      })
    })
  })

  it('Should handle empty search results', { tags: '@api @regression' }, () => {
    const searchData = {
      search_product: 'nonexistentproduct12345'
    }

    cy.apiPost('/searchProduct', searchData).then((response) => {
      ApiHelpers.validateResponse(response, 200)
      
      // Validate empty results
      expect(response.body).to.have.property('responseCode', 200)
      expect(response.body).to.have.property('products')
      expect(response.body.products).to.be.an('array')
      expect(response.body.products.length).to.equal(0)
    })
  })

  it('Should validate product data types', { tags: '@api @regression' }, () => {
    cy.apiGet('/productsList').then((response) => {
      ApiHelpers.validateResponse(response, 200)
      
      const products = response.body.products
      
      products.forEach((product) => {
        // Validate data types
        expect(product.id).to.be.a('number')
        expect(product.name).to.be.a('string')
        expect(product.price).to.be.a('string')
        expect(product.brand).to.be.a('string')
        expect(product.category).to.be.an('object')
        
        // Validate category structure
        expect(product.category).to.have.property('usertype')
        expect(product.category).to.have.property('category')
      })
    })
  })

  it('Should handle invalid API endpoints', { tags: '@api @regression' }, () => {
    cy.apiGet('/invalidEndpoint').then((response) => {
      expect(response.status).to.not.equal(200)
    })
  })

  it('Should validate API response time', { tags: '@api @performance' }, () => {
    const startTime = Date.now()
    
    cy.apiGet('/productsList').then((response) => {
      const endTime = Date.now()
      const responseTime = endTime - startTime
      
      ApiHelpers.validateResponse(response, 200)
      
      // Validate response time (should be less than 2 seconds)
      expect(responseTime).to.be.lessThan(2000)
      
      cy.task('log', `API Response Time: ${responseTime}ms`)
    })
  })

  it('Should validate products have required fields', { tags: '@api @regression' }, () => {
    cy.apiGet('/productsList').then((response) => {
      ApiHelpers.validateResponse(response, 200)
      
      const requiredFields = ['id', 'name', 'price', 'brand', 'category']
      
      response.body.products.forEach((product, index) => {
        requiredFields.forEach((field) => {
          expect(product).to.have.property(field, `Product ${index} missing ${field}`)
        })
      })
    })
  })

  it('Should test concurrent API requests', { tags: '@api @performance' }, () => {
    const requests = []
    
    // Make 5 concurrent requests
    for (let i = 0; i < 5; i++) {
      requests.push(cy.apiGet('/productsList'))
    }
    
    // Validate all responses
    requests.forEach((request, index) => {
      request.then((response) => {
        ApiHelpers.validateResponse(response, 200)
        cy.task('log', `Concurrent request ${index + 1} completed successfully`)
      })
    })
  })

  it('Should validate API error handling', { tags: '@api @regression' }, () => {
    // Test with malformed request
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/searchProduct`,
      body: 'invalid json',
      headers: {
        'Content-Type': 'application/json'
      },
      failOnStatusCode: false
    }).then((response) => {
      // Should handle malformed requests gracefully
      expect(response.status).to.not.equal(200)
    })
  })
})