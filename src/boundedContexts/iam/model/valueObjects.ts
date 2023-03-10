import crypto from 'crypto'

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const rolesRegex = /user|seller/

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

class FirstName {
  readonly value: string
  constructor(firstName: string) {
    if (firstName.length < 1 || firstName.length > 20) {
      throw new Error('The provided first name is invalid')
    }
    this.value = firstName
  }
}

class LastName {
  readonly value: string
  constructor(lastName: string) {
    if (lastName.length < 1 || lastName.length > 20) {
      throw new Error('The provided last name is invalid')
    }
    this.value = lastName
  }
}

class Email {
  readonly value: string
  constructor(email: string) {
    if (email.length > 50) {
      throw new Error('The provided email is invalid')
    } else if (!emailRegex.test(email)) {
      throw new Error('The provided email is invalid')
    }
    this.value = email
  }
}

class PwHash {
  // regex ^\$2b\$.{56}$
  readonly value: string
  constructor(pwHash: string) {
    if (pwHash.length > 60) {
      throw new Error('The provided pwHash is invalid')
    }
    this.value = pwHash
  }
}

class Roles {
  // ts enum
  readonly value: string[]
  constructor(roles: string[]) {
    roles.forEach(role => {
      if (!rolesRegex.test(role)) {
        throw new Error('The provided role is invalid')
      }
    })
    this.value = roles
  }
}

export { Id, FirstName, LastName, Email, PwHash, Roles }
