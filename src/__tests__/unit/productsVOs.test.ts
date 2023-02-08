import { describe, expect, test } from 'vitest'
import {
  Id,
  Name,
  ShortDescription,
  Description,
  Price,
  Money,
  ImageUrl,
} from '../../model/valueObjects'
import crypto from 'crypto'

function stringWithXChars(x: number) {
  return 'a'.repeat(x)
}

describe('The id', () => {
  test('must be of type uuid', () => {
    const validId = new Id(crypto.randomUUID())
    expect(validId).toBeInstanceOf(Id)
  })
  test('throws an error if not of type uuid', () => {
    expect(() => {
      new Id('not-a-uuid')
    }).toThrowError('The provided id is invalid')
  })
})

describe('The name', () => {
  test('must be between 1 and 30 chars long', () => {
    const validName = new Name('BestProductEver!')
    expect(validName).toBeInstanceOf(Name)
  })
  test('throws error if more than 30 chars long', () => {
    expect(() => {
      new Name(stringWithXChars(31))
    }).toThrowError('The provided name is invalid')
  })
  test('throws error if less than 1 or more than 30 chars long', () => {
    expect(() => {
      new Name(stringWithXChars(0))
    }).toThrowError('The provided name is invalid')
  })
})

describe('The short description', () => {
  test('must be between 1 and 100 characters long', () => {
    const validShortDescription = new ShortDescription('This is the best product ever!')
    expect(validShortDescription).toBeInstanceOf(ShortDescription)
  })
  test('throws error if more than 100 chars long', () => {
    expect(() => {
      new ShortDescription(stringWithXChars(101))
    }).toThrowError('The short description is invalid')
  })
  test('throws error if less than 1 chars long', () => {
    expect(() => {
      new ShortDescription(stringWithXChars(0))
    }).toThrowError('The short description is invalid')
  })
})

describe('The description', () => {
  test('must be between 0 and 300 characters long', () => {
    const validDescription = new Description('This is the best product ever!')
    expect(validDescription).toBeInstanceOf(Description)
  })
  test('throws error if more than 300 chars long', async () => {
    expect(() => {
      new Description(stringWithXChars(301))
    }).toThrowError('The description is invalid')
  })
})

describe('The price', () => {
  test('', () => {
    const validPrice: Price = new Price('5.5')
    expect(validPrice).toBeInstanceOf(Price)
  })
  test('throws error if not in right format', async () => {
    expect(() => {
      new Price('money')
    }).toThrowError('The price is invalid')
  })
})

describe('The money', () => {
  test(' must only contain numbers', () => {
    const validPrice = new Money(1200)
    expect(validPrice).toBeInstanceOf(Money)
    expect(validPrice.value).toBe(1200)
  })
  test('throws error if it has  a negative value', async () => {
    expect(() => {
      new Money(-1200)
    }).toThrowError('The money is invalid')
  })
})

describe('The image url', () => {
  test('can only be in format filename.jpg|jpeg|png', () => {
    const validImageUrl = new ImageUrl('test.jpeg')
    expect(validImageUrl).toBeInstanceOf(ImageUrl)
  })
  test('throws error if different', () => {
    expect(() => {
      new ImageUrl('notSupported.gif')
    }).toThrowError('The image url is invalid')
  })
})
