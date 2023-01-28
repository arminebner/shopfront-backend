import { afterAll, afterEach, describe, expect, test } from 'vitest'
import { Decimal } from '@prisma/client/runtime'
import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'
import ProductService from '../services/ProductService'

const productService = new ProductService()
const prisma = new PrismaClient()

function createProduct(amount: number) {
  const array = Array.from({ length: amount }, (_, i) => i + 1)
  const products = []

  array.forEach(element => {
    products.push({
      id: uuidv4(),
      name: `Product${element}: ${Date.now()}`,
      image_url: 'https://picsum.photos',
      price: new Decimal(5.5),
    })
  })

  return products
}

afterEach(async () => {
  const deleteProducts = prisma.product.deleteMany()
  await prisma.$transaction([deleteProducts])
})

afterAll(async () => {
  await prisma.$disconnect()
})

describe('The product service', () => {
  test('adds a product', async () => {
    const products = createProduct(1)
    const addedProduct = await productService.addProduct(products[0])

    expect(addedProduct).toEqual(products[0])
  })

  test('throws error for existing productname', async () => {
    const product = createProduct(1)
    await productService.addProduct(product[0])

    try {
      await productService.addProduct(product[0])
    } catch (error) {
      expect(error.message).toBe('This product name is already taken.')
    }
  })

  test('returns all products', async () => {
    const products = createProduct(2)
    await productService.addProduct(products[0])
    await productService.addProduct(products[1])

    const allProducts = await productService.allProducts()

    expect(allProducts).toEqual(products)
  })

  test('returns a product by id', async () => {
    const products = createProduct(2)
    await productService.addProduct(products[0])
    await productService.addProduct(products[1])

    const productById = await productService.productById(products[0].id)

    expect(productById).toEqual(products[0])
  })

  test('throws error, if product id was not found', async () => {
    const id = uuidv4()
    try {
      await productService.productById(id)
    } catch (error) {
      expect(error.message).toBe(`The product with the id: ${id} was not found.`)
    }
  })

  test('deletes a product', async () => {
    const products = createProduct(2)
    await productService.addProduct(products[0])
    await productService.addProduct(products[1])

    await productService.deleteById(products[0].id)
    const remainingProducts = await productService.allProducts()

    expect(remainingProducts).not.toContain(products[0].id)
  })

  test('updates a product', async () => {
    const product = createProduct(1)
    await productService.addProduct(product[0])
    const productToUpdate = {
      id: product[0].id,
      name: `UPDATED_Product: ${Date.now()}`,
      image_url: 'https://picsum.photos',
      price: new Decimal(10),
    }

    const updatedProduct = await productService.updateProduct(productToUpdate)

    expect(updatedProduct).toEqual(productToUpdate)
  })
})
