import { describe, expect, test } from 'vitest'
import { TokenDate, Jwt } from '../../common/model/valueObjects'

describe('The Jwt VO', () => {
  test('must be in the format of a jwt', () => {
    const validJwt = new Jwt('1.1.1')
    expect(validJwt).toBeInstanceOf(Jwt)
  })
  test('throws error if in other format', () => {
    expect(() => {
      new Jwt('some.other-format')
    }).toThrowError('The provided jwt is invalid')
  })
})

describe('The TokenDate VO', () => {
  test('must be a unix timestamp in milliseconds', () => {
    const validToken = new TokenDate(Date.now())
    expect(validToken).toBeInstanceOf(TokenDate)
  })
  test('throws error if in other format', () => {
    expect(() => {
      //@ts-ignore
      new TokenDate('someInput')
    }).toThrowError('The provided timestamp is invalid')
  })
  test('takes a lifetime and computed expiration date', () => {
    const createdAt = Date.now()
    const oneDay = 86400000
    const validToken = new TokenDate(createdAt)
    expect(validToken.expiresAt(oneDay)).toEqual(createdAt + oneDay)
  })
})
