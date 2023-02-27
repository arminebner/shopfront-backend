import { describe, expect, test } from 'vitest'
import crypto from 'crypto'
import {
  Id,
  FirstName,
  LastName,
  Email,
  PwHash,
  Roles,
} from '../../userBoundedContext/model/valueObjects'

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function stringWithXChars(x: number) {
  return 'a'.repeat(x)
}

describe('The id', () => {
  test('must be of type uuid', () => {
    const validId = new Id(crypto.randomUUID())
    expect(validId).toBeInstanceOf(Id)
  })
  test('gets populated with random uuid if input empty string', () => {
    const randomId = new Id('')
    expect(randomId.value).toMatch(uuidRegex)
  })
  test('throws an error if not of type uuid', () => {
    expect(() => {
      new Id('not-a-uuid')
    }).toThrowError('The provided id is invalid')
  })
})

describe('The first name', () => {
  test('must be between 1 and 20 chars long', () => {
    const validFirstName = new FirstName('BestName')
    expect(validFirstName).toBeInstanceOf(FirstName)
  })
  test('throws error if more than 20 chars long', () => {
    expect(() => {
      new FirstName(stringWithXChars(21))
    }).toThrowError('The provided first name is invalid')
  })
  test('throws error if less than 1 char long', () => {
    expect(() => {
      new FirstName(stringWithXChars(0))
    }).toThrowError('The provided first name is invalid')
  })
})

describe('The last name', () => {
  test('must be between 1 and 20 chars long', () => {
    const validLastName = new LastName('BestLastName')
    expect(validLastName).toBeInstanceOf(LastName)
  })
  test('throws error if more than 20 chars long', () => {
    expect(() => {
      new LastName(stringWithXChars(21))
    }).toThrowError('The provided last name is invalid')
  })
  test('throws error if less than 1 char long', () => {
    expect(() => {
      new LastName(stringWithXChars(0))
    }).toThrowError('The provided last name is invalid')
  })
})

describe('The email', () => {
  test('must be in a valid email format', () => {
    const validEmail = new Email('testuser@test.de')
    expect(validEmail).toBeInstanceOf(Email)
  })
  test('throws error if format is invalid', () => {
    expect(() => {
      new LastName(stringWithXChars(21))
    }).toThrowError('The provided last name is invalid')
  })
})

describe('The password hash', () => {
  test('must be a string', () => {
    const validPwHash = new PwHash('sdf798sd7f97sd9f87s')
    expect(validPwHash).toBeInstanceOf(PwHash)
  })
})

describe('The user roles', () => {
  test('are either user|seller', () => {
    const validRole = new Roles(['user', 'seller'])
    expect(validRole.value).toEqual(['user', 'seller'])
    expect(validRole).toBeInstanceOf(Roles)
  })
  test('throws error for unsupported roles', () => {
    expect(() => {
      new Roles(['user', 'some-role'])
    }).toThrowError('The provided role is invalid')
  })
})
