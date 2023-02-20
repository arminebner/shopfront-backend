import crypto from 'crypto'

const jwtRegex = /^([a-zA-Z0-9-_]+)\.([a-zA-Z0-9-_]+)\.([a-zA-Z0-9-_]*)$/
const unixTimeStampRegex = /^\d{13}$/
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

class TokenId {
  readonly value: string
  constructor(id?: string) {
    if (!id) {
      this.value = crypto.randomUUID()
    } else if (!uuidRegex.test(id)) {
      throw new Error('The provided id is invalid')
    } else {
      this.value = id
    }
  }
}

class Jwt {
  readonly value: string
  constructor(jwt: string) {
    if (!jwtRegex.test(jwt)) {
      throw new Error('The provided jwt is invalid')
    }
    this.value = jwt
  }
}

class TokenDate {
  readonly value: number
  constructor(createdAt: number) {
    if (!unixTimeStampRegex.test(createdAt.toString())) {
      throw new Error('The provided timestamp is invalid')
    }
    this.value = createdAt
  }
  expiresAt(expiresAt: number) {
    return this.value + expiresAt
  }
}

export { TokenId, Jwt, TokenDate }
