import config from 'config'
import crypto from 'crypto'

const configCurrency = config.get<string>('currency')
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const categoryRegex = /^(Category1|Category2|Category3)$/

class Id {
  readonly value: string
  constructor(id: string) {
    if (!id) {
      this.value = crypto.randomUUID()
    } else if (!uuidRegex.test(id)) {
      throw new Error('The provided id is invalid')
    } else {
      this.value = id
    }
  }
}

class Name {
  readonly value: string
  constructor(name: string) {
    if (name.length < 1 || name.length > 30) {
      throw new Error('The provided name is invalid')
    }
    this.value = name
  }
}

class ShortDescription {
  readonly value: string
  constructor(shortDescription: string) {
    if (shortDescription.length < 1 || shortDescription.length > 100) {
      throw new Error('The short description is invalid')
    }
    this.value = shortDescription
  }
}

class Description {
  readonly value: string
  constructor(description: string) {
    if (description.length > 300) {
      throw new Error('The description is invalid')
    }
    this.value = description
  }
}

class Price {
  readonly value: string
  readonly currency: Currency
  constructor(amount: string) {
    const priceRegex = /^\d+\.\d+?$/
    if (!priceRegex.test(amount)) {
      throw new Error('The price is invalid')
    }
    this.value = amount
    this.currency = new Currency(configCurrency)
  }
  valueToMoney() {
    return new Money(parseFloat(this.value) * 100)
  }
}

class Money {
  readonly value: number
  constructor(amount: number) {
    if (amount < 0) {
      throw new Error('The money is invalid')
    }
    this.value = amount
  }
  valueToPrice() {
    return new Price((this.value / 100).toFixed(2))
  }
}

class Currency {
  readonly value: string
  constructor(currency: string) {
    const validCurrencyCode = /^[A-Z]{3}$/
    if (!validCurrencyCode.test(currency)) {
      throw new Error('The currency is invalid')
    }
    this.value = configCurrency
  }
}

class ImageUrl {
  readonly value: string
  constructor(url: string) {
    const urlRegex = /^[A-Za-z0-9_-]+\.(jpg|jpeg|png)$/
    if (!urlRegex.test(url)) {
      throw new Error('The image url is invalid')
    }
    this.value = url
  }
}

class Quantity {
  readonly value: number
  constructor(quantity: number) {
    if (typeof quantity !== 'number') {
      throw new Error('The quantity is not of type number')
    } else if (quantity < 0) {
      throw new Error('The quantity is invalid')
    }
    this.value = quantity
  }
}

class Category {
  readonly value: string
  constructor(category: string) {
    if (!categoryRegex.test(category)) {
      throw new Error('The category is invalid')
    }
    this.value = category
  }
}

export { Id, Name, ShortDescription, Description, Price, Money, ImageUrl, Quantity, Category }
