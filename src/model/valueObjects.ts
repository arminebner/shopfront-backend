import config from 'config'

const configCurrency = config.get<string>('currency')

class Id {
  readonly value: string
  constructor(id: string) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      throw new Error('The provided id is invalid')
    }
    this.value = id
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

class Money {
  readonly value: number
  readonly currency: Currency
  constructor(amount: string) {
    const priceRegex = /^\d+\.\d+?$/
    if (!priceRegex.test(amount)) {
      throw new Error('The price is invalid')
    }
    this.value = parseFloat(amount) * 100
    this.currency = new Currency(configCurrency)
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

export { Id, Name, ShortDescription, Description, Money, ImageUrl }

//export types from that ?
