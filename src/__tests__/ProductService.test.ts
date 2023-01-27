import { afterAll, describe, expect, test } from 'vitest'
import { Decimal } from '@prisma/client/runtime'
import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'
import ProductService from '../services/ProductService'

const productId = uuidv4()
const productId2 = uuidv4()
const product = {
  id: productId,
  name: 'product1',
  image_url: 'https://picsum.photos',
  price: new Decimal(5.5),
}
const product2 = {
  id: productId2,
  name: 'product2',
  image_url: 'https://picsum.photos',
  price: new Decimal(9.99),
}
const manyProducts = [
  {
    id: productId,
    name: 'product1',
    image_url: 'https://picsum.photos',
    price: new Decimal(5.5),
  },
  {
    id: productId2,
    name: 'product2',
    image_url: 'https://picsum.photos',
    price: new Decimal(9.99),
  },
]
const productService = new ProductService()

afterAll(async () => {
  const prisma = new PrismaClient()
  const deleteProducts = prisma.product.deleteMany()

  await prisma.$transaction([deleteProducts])
  await prisma.$disconnect()
})

describe('The product service', () => {
  test('adds a product', async () => {
    const addedProduct = await productService.addProduct(product)

    expect(addedProduct).toEqual(product)
  })

  test('does not add a product with existing productname', async () => {
    await productService.addProduct(product)
    await productService.addProduct(product)
    const allProducts = await productService.allProducts()

    expect(allProducts).toEqual([product])
  })

  test('returns all products', async () => {
    await productService.addProduct(product)
    await productService.addProduct(product2)

    const allProducts = await productService.allProducts()

    expect(allProducts).toEqual(manyProducts)
  })

  test('returns a product by id', async () => {
    const productById = await productService.productById(productId)

    expect(productById).toEqual(product)
  })
})

// flag vitest to not run in paraalel with --no-threads ?
