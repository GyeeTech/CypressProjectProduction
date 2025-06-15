# Cypress Automation Framework

A comprehensive end-to-end testing framework built with Cypress for web application testing. This framework includes UI tests, API tests, and various assertion patterns suitable for production use.

## 🚀 Features

- **UI Testing**: Complete page object model implementation
- **API Testing**: RESTful API testing with comprehensive assertions
- **Cross-browser Testing**: Support for Chrome, Firefox, and Edge
- **Test Data Management**: Dynamic test data generation with Faker.js
- **Custom Commands**: Reusable custom Cypress commands
- **Reporting**: Detailed HTML reports with screenshots and videos
- **CI/CD Integration**: GitHub Actions workflow included
- **Parallel Execution**: Support for parallel test execution
- **Mobile Testing**: Responsive design testing capabilities

## 📁 Project Structure

```
cypress-automation-framework/
├── cypress/
│   ├── e2e/
│   │   ├── ui/              # UI test suites
│   │   ├── api/             # API test suites
│   │   └── integration/     # End-to-end integration tests
│   ├── fixtures/            # Test data files
│   ├── support/
│   │   ├── commands.js      # Custom commands
│   │   ├── e2e.js          # Global configurations
│   │   ├── page-objects/    # Page object model classes
│   │   └── utilities/       # Helper utilities
│   ├── screenshots/         # Test failure screenshots
│   ├── videos/             # Test execution videos
│   └── reports/            # Test execution reports
├── .github/workflows/       # CI/CD pipeline configurations
├── cypress.config.js       # Cypress configuration
└── package.json            # Dependencies and scripts
```

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cypress-automation-framework
```

2. Install dependencies:
```bash
npm install
```

3. Install Cypress:
```bash
npx cypress install
```

## ⚙️ Configuration

### Environment Variables

Update `cypress.config.js` with your application settings:

```javascript
env: {
  apiUrl: 'https://your-api-url.com/api',
  testEmail: 'your-test-email@example.com',
  testPassword: 'your-test-password'
}
```

### Base URL

Set your application's base URL in `cypress.config.js`:

```javascript
baseUrl: 'https://your-application-url.com'
```

## 🏃‍♂️ Running Tests

### Interactive Mode (Cypress Test Runner)
```bash
npm run cypress:open
```

### Headless Mode
```bash
# Run all tests
npm run cypress:run

# Run specific browser
npm run cypress:run:chrome
npm run cypress:run:firefox
npm run cypress:run:edge

# Run specific test suites
npm run test:ui
npm run test:api
npm run test:smoke
npm run test:regression
```

### Parallel Execution
```bash
npm run test:parallel
```

## 📊 Test Reports

### Generate Reports
```bash
npm run report:generate
```

### View Reports
```bash
npm run report:open
```

Reports include:
- Test execution summary
- Pass/fail statistics
- Screenshots of failed tests
- Video recordings
- Performance metrics

## 🧪 Test Categories

### UI Tests
- Login/Authentication flows
- Product browsing and search
- Shopping cart functionality
- Form submissions
- Navigation testing

### API Tests
- Authentication endpoints
- CRUD operations
- Error handling
- Response validation
- Performance testing

### Integration Tests
- End-to-end user journeys
- Cross-feature workflows
- Data persistence
- Session management

## 📝 Writing Tests

### Page Object Model Example

```javascript
// cypress/support/page-objects/LoginPage.js
import BasePage from './BasePage.js'

class LoginPage extends BasePage {
  constructor() {
    super()
    this.url = '/login'
  }

  get emailInput() { return cy.get('[data-qa="login-email"]') }
  get passwordInput() { return cy.get('[data-qa="login-password"]') }
  get loginButton() { return cy.get('[data-qa="login-button"]') }

  login(email, password) {
    this.emailInput.type(email)
    this.passwordInput.type(password)
    this.loginButton.click()
    return this
  }
}

export default LoginPage
```

### Test Example

```javascript
// cypress/e2e/ui/login.cy.js
import LoginPage from '../../support/page-objects/LoginPage.js'

describe('Login Tests', () => {
  let loginPage

  beforeEach(() => {
    loginPage = new LoginPage()
    loginPage.visit()
  })

  it('Should login with valid credentials', { tags: '@smoke' }, () => {
    loginPage.login('test@example.com', 'password123')
    cy.url().should('not.include', '/login')
  })
})
```

### API Test Example

```javascript
// cypress/e2e/api/products-api.cy.js
describe('Products API', () => {
  it('Should get all products', { tags: '@api' }, () => {
    cy.apiGet('/products').then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('products')
      expect(response.body.products).to.be.an('array')
    })
  })
})
```

## 🔧 Custom Commands

The framework includes numerous custom commands:

```javascript
// Authentication
cy.login(email, password)
cy.logout()

// API requests
cy.apiGet(endpoint)
cy.apiPost(endpoint, body)
cy.apiPut(endpoint, body)
cy.apiDelete(endpoint)

// UI interactions
cy.waitForElement(selector)
cy.uploadFile(selector, fileName)
cy.takeScreenshot(name)

// Assertions
cy.shouldBeVisible(selector)
cy.shouldContainText(selector, text)
```

## 🏷️ Test Tagging

Use tags to organize and run specific test groups:

```javascript
it('Should login successfully', { tags: '@smoke @critical' }, () => {
  // Test implementation
})
```

Run tagged tests:
```bash
npx cypress run --env tags=@smoke
npx cypress run --env tags=@regression
```

## 🚀 CI/CD Integration

### GitHub Actions

The framework includes a complete GitHub Actions workflow:

- **Multi-browser testing**: Chrome, Firefox, Edge
- **Parallel execution**: Faster test completion
- **Artifact collection**: Screenshots and videos on failure
- **Scheduled runs**: Daily automated testing
- **Pull request validation**: Automatic testing on PRs

### Jenkins Integration

```groovy
pipeline {
    agent any
    stages {
        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }
        stage('Test') {
            parallel {
                stage('Chrome') {
                    steps {
                        sh 'npm run cypress:run:chrome'
                    }
                }
                stage('Firefox') {
                    steps {
                        sh 'npm run cypress:run:firefox'
                    }
                }
            }
        }
        stage('Report') {
            steps {
                publishHTML([
                    allowMissing: false,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: 'cypress/reports',
                    reportFiles: 'merged-report.html',
                    reportName: 'Cypress Test Report'
                ])
            }
        }
    }
}
```

## 🔍 Best Practices

### Test Organization
- Use descriptive test names
- Group related tests in describe blocks
- Implement proper setup and teardown
- Use tags for test categorization

### Data Management
- Use fixtures for static test data
- Generate dynamic data with Faker.js
- Implement data cleanup procedures
- Avoid hardcoded test data

### Assertions
- Use specific assertions
- Include meaningful error messages
- Validate both positive and negative scenarios
- Test edge cases and boundary conditions

### Performance
- Implement proper waits
- Use custom commands for reusability
- Optimize test execution time
- Monitor test performance metrics

## 🐛 Debugging

### Debug Mode
```bash
npx cypress open --env DEBUG=true
```

### Browser DevTools
- Use `cy.debug()` to pause execution
- Add `debugger` statements in test code
- Inspect elements during test execution
- Monitor network requests and responses

### Logging
```javascript
cy.task('log', 'Custom debug message')
cy.task('table', { key: 'value', data: 'object' })
```

## 📈 Monitoring and Analytics

### Test Metrics
- Execution time tracking
- Pass/fail rate monitoring
- Flaky test identification
- Coverage analysis

### Performance Monitoring
- API response time validation
- Page load time measurement
- Resource usage tracking
- Bottleneck identification

## 🔒 Security Testing

### Authentication Testing
- Password policy validation
- Session management testing
- Authorization boundary testing
- Token expiration handling

### Input Validation
- SQL injection prevention
- XSS vulnerability testing
- CSRF protection validation
- Input sanitization verification

## 📚 Resources

- [Cypress Documentation](https://docs.cypress.io/)
- [Page Object Model Pattern](https://martinfowler.com/bliki/PageObject.html)
- [API Testing Best Practices](https://assertible.com/blog/api-testing-best-practices)
- [Continuous Integration with Cypress](https://docs.cypress.io/guides/continuous-integration/introduction)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new features
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For questions and support:
- Create an issue in the repository
- Review existing documentation
- Check Cypress community resources

---

**Happy Testing!** 🎉