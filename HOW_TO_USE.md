# How To Use - Cypress Automation Framework

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager
- Git (for version control)

### Step 1: Initial Setup

1. **Clone or Download the Framework**
```bash
git clone <your-repository-url>
cd cypress-automation-framework
```

2. **Install Dependencies**
```bash
npm install
```

3. **Verify Installation**
```bash
npx cypress verify
```

### Step 2: Configure Your Application

1. **Update Base URL**
   - Open `cypress.config.js`
   - Change the `baseUrl` to your application URL:
   ```javascript
   baseUrl: 'https://your-application-url.com'
   ```

2. **Configure API Endpoints**
   - Update the `apiUrl` in the env section:
   ```javascript
   env: {
     apiUrl: 'https://your-api-url.com/api'
   }
   ```

3. **Update Test Data**
   - Edit `cypress/fixtures/testData.json` with your application's test data
   - Add valid user credentials, product information, etc.

## 📝 Writing Your First Test

### UI Test Example

1. **Create a new test file:**
```bash
touch cypress/e2e/ui/my-first-test.cy.js
```

2. **Write your test:**
```javascript
import HomePage from '../../support/page-objects/HomePage.js'

describe('My First Test Suite', () => {
  let homePage

  beforeEach(() => {
    homePage = new HomePage()
    homePage.visit()
  })

  it('Should load homepage successfully', { tags: '@smoke' }, () => {
    homePage.verifyHomePageLoaded()
    cy.title().should('contain', 'Your App Title')
  })
})
```

### API Test Example

1. **Create API test file:**
```bash
touch cypress/e2e/api/my-api-test.cy.js
```

2. **Write API test:**
```javascript
describe('My API Tests', () => {
  it('Should get user data', { tags: '@api' }, () => {
    cy.apiGet('/users/1').then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('id', 1)
      expect(response.body).to.have.property('name')
    })
  })
})
```

## 🏃‍♂️ Running Tests

### Interactive Mode (Recommended for Development)
```bash
npm run cypress:open
```
- Opens Cypress Test Runner
- Great for debugging and development
- Real-time test execution with browser interaction

### Headless Mode (CI/CD and Quick Runs)
```bash
# Run all tests
npm run cypress:run

# Run specific test types
npm run test:ui        # UI tests only
npm run test:api       # API tests only
npm run test:smoke     # Smoke tests only
npm run test:regression # Regression tests only

# Run in specific browsers
npm run cypress:run:chrome
npm run cypress:run:firefox
npm run cypress:run:edge
```

### Running Specific Tests
```bash
# Run single test file
npx cypress run --spec "cypress/e2e/ui/login.cy.js"

# Run tests with specific tags
npx cypress run --env tags=@smoke
npx cypress run --env tags=@regression

# Run tests in specific folder
npx cypress run --spec "cypress/e2e/ui/**/*"
```

## 📊 Generating and Viewing Reports

### Generate HTML Reports
```bash
# After running tests, generate report
npm run report:generate

# Open the report in browser
npm run report:open
```

### Report Contents Include:
- ✅ Test execution summary with pass/fail statistics
- 📊 Interactive charts and graphs
- 📸 Screenshots of failed tests (embedded)
- 🎥 Video recordings of test execution
- ⏱️ Execution time and performance metrics
- 📋 Detailed test logs and error messages

## 🏗️ Framework Structure Guide

### Adding New Page Objects

1. **Create new page object:**
```bash
touch cypress/support/page-objects/MyNewPage.js
```

2. **Extend BasePage:**
```javascript
import BasePage from './BasePage.js'

class MyNewPage extends BasePage {
  constructor() {
    super()
    this.url = '/my-new-page'
  }

  // Selectors
  get myButton() { return cy.get('[data-testid="my-button"]') }
  get myInput() { return cy.get('#my-input') }

  // Actions
  clickMyButton() {
    this.myButton.click()
    return this
  }

  typeInInput(text) {
    this.myInput.type(text)
    return this
  }

  // Assertions
  verifyPageLoaded() {
    this.myButton.should('be.visible')
    return this
  }
}

export default MyNewPage
```

### Adding Custom Commands

1. **Add to `cypress/support/commands.js`:**
```javascript
Cypress.Commands.add('myCustomCommand', (parameter) => {
  // Your custom logic here
  cy.get('[data-testid="element"]').should('contain', parameter)
})
```

2. **Use in tests:**
```javascript
cy.myCustomCommand('expected text')
```

### Adding Test Data

1. **Static data in fixtures:**
```javascript
// cypress/fixtures/myTestData.json
{
  "users": [
    {
      "username": "testuser",
      "password": "testpass"
    }
  ]
}
```

2. **Dynamic data with TestDataGenerator:**
```javascript
import TestDataGenerator from '../../support/utilities/TestDataGenerator.js'

const newUser = TestDataGenerator.generateUser()
```

## 🏷️ Test Organization Best Practices

### Use Descriptive Tags
```javascript
it('Should login with valid credentials', { tags: '@smoke @critical @login' }, () => {
  // Test implementation
})
```

### Organize Test Suites
```
cypress/e2e/
├── ui/
│   ├── authentication/
│   │   ├── login.cy.js
│   │   └── signup.cy.js
│   ├── shopping/
│   │   ├── cart.cy.js
│   │   └── checkout.cy.js
├── api/
│   ├── auth-api.cy.js
│   └── products-api.cy.js
└── integration/
    └── end-to-end.cy.js
```

## 🔧 Debugging Tests

### Debug Mode
```bash
# Open with debug mode
npx cypress open --env DEBUG=true
```

### Debugging Techniques
```javascript
// Pause execution
cy.debug()

// Add breakpoint
debugger

// Log custom messages
cy.task('log', 'Debug message here')

// Take screenshot for debugging
cy.takeScreenshot('debug-screenshot')

// Inspect element
cy.get('[data-testid="element"]').debug()
```

## 🚀 CI/CD Integration

### GitHub Actions (Already Configured)
The framework includes a complete GitHub Actions workflow that:
- Runs tests on multiple browsers
- Executes tests in parallel
- Generates reports automatically
- Uploads screenshots and videos on failures

### Jenkins Integration Example
```groovy
pipeline {
    agent any
    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }
        stage('Run Tests') {
            steps {
                sh 'npm run cypress:run'
            }
        }
        stage('Generate Reports') {
            steps {
                sh 'npm run report:generate'
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
    post {
        always {
            archiveArtifacts artifacts: 'cypress/screenshots/**/*', allowEmptyArchive: true
            archiveArtifacts artifacts: 'cypress/videos/**/*', allowEmptyArchive: true
        }
    }
}
```

## 📈 Monitoring and Maintenance

### Regular Maintenance Tasks

1. **Update Dependencies**
```bash
npm update
npm audit fix
```

2. **Clean Up Old Reports**
```bash
rm -rf cypress/screenshots/*
rm -rf cypress/videos/*
rm -rf cypress/reports/*
```

3. **Review Flaky Tests**
- Check test reports for inconsistent results
- Update selectors if application changes
- Improve wait strategies for dynamic content

### Performance Monitoring
```javascript
// Monitor API response times
it('Should respond within acceptable time', () => {
  const startTime = Date.now()
  
  cy.apiGet('/products').then((response) => {
    const responseTime = Date.now() - startTime
    expect(responseTime).to.be.lessThan(2000) // 2 seconds
    cy.task('log', `API Response Time: ${responseTime}ms`)
  })
})
```

## 🔍 Troubleshooting Common Issues

### Issue: Tests failing due to timing
**Solution:** Use proper waits
```javascript
// Instead of cy.wait(5000)
cy.get('[data-testid="element"]', { timeout: 10000 }).should('be.visible')
```

### Issue: Element not found
**Solution:** Use better selectors
```javascript
// Prefer data attributes
cy.get('[data-testid="submit-button"]')
// Over CSS classes
cy.get('.btn-primary')
```

### Issue: API tests failing
**Solution:** Check network and endpoints
```javascript
cy.apiGet('/endpoint').then((response) => {
  cy.task('log', `Response: ${JSON.stringify(response.body)}`)
})
```

## 📚 Next Steps

1. **Customize for Your Application**
   - Update page objects to match your UI
   - Add application-specific custom commands
   - Configure test data for your use cases

2. **Expand Test Coverage**
   - Add more UI test scenarios
   - Include comprehensive API testing
   - Implement visual regression testing

3. **Integrate with Your Workflow**
   - Set up CI/CD pipeline
   - Configure test scheduling
   - Set up notifications for test failures

4. **Team Training**
   - Share this guide with your team
   - Conduct framework walkthrough sessions
   - Establish coding standards and practices

## 🆘 Getting Help

- **Framework Issues:** Check the README.md for detailed documentation
- **Cypress Documentation:** https://docs.cypress.io/
- **Best Practices:** Review the existing test examples in the framework
- **Community Support:** Cypress Discord and GitHub discussions

---

**Happy Testing!** 🎉

Remember: Start small with a few basic tests, then gradually expand your test suite as you become more comfortable with the framework.