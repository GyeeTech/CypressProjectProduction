import { faker } from '@faker-js/faker'

class TestDataGenerator {
  static generateUser() {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 12 }),
      company: faker.company.name(),
      address1: faker.location.streetAddress(),
      address2: faker.location.secondaryAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zipcode: faker.location.zipCode(),
      country: faker.location.country(),
      mobileNumber: faker.phone.number()
    }
  }

  static generateEmail() {
    return faker.internet.email()
  }

  static generatePassword() {
    return faker.internet.password({ length: 12 })
  }

  static generateContactForm() {
    return {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      subject: faker.lorem.sentence(),
      message: faker.lorem.paragraph()
    }
  }

  static generateCreditCard() {
    return {
      nameOnCard: faker.person.fullName(),
      cardNumber: faker.finance.creditCardNumber(),
      cvc: faker.finance.creditCardCVV(),
      expiryMonth: faker.date.future().getMonth() + 1,
      expiryYear: faker.date.future().getFullYear()
    }
  }

  static generateProduct() {
    return {
      name: faker.commerce.productName(),
      category: faker.commerce.department(),
      price: faker.commerce.price(),
      description: faker.commerce.productDescription()
    }
  }

  static generateRandomString(length = 10) {
    return faker.string.alphanumeric(length)
  }

  static generateRandomNumber(min = 1, max = 100) {
    return faker.number.int({ min, max })
  }

  static generateDate(format = 'YYYY-MM-DD') {
    return faker.date.future().toISOString().split('T')[0]
  }
}

export default TestDataGenerator