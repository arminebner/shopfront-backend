import { afterAll, afterEach, beforeEach, describe, expect, test } from 'vitest'
import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'
import ProductService from '../../services/productService'
import Product from '../../types/product'
import ProductRepo from '../../repositories/productRepository'
import UserService from '../../userBoundedContext/services/userService'
import UserRepo from '../../userBoundedContext/repositories/userRepository'
import RefreshTokenRepo from '../../repositories/refreshTokenRepository'

const prisma = new PrismaClient()
const productService = new ProductService(new ProductRepo(prisma))

const userId1 = crypto.randomUUID()
const userId2 = crypto.randomUUID()

async function createUser(userId: string) {
  const userService = new UserService(new UserRepo(prisma), new RefreshTokenRepo(prisma))
  const user = {
    id: userId,
    first_name: 'Test',
    last_name: 'User',
    email: `testuser${Date.now()}@test.de`,
    password: '983w747na8worzon439rzfona4rv',
    roles: ['user'],
  }
  return await userService.registerUser(user)
}

function createProduct(userId: string, amount: number, category?: string) {
  const array = Array.from({ length: amount }, (_, i) => i + 1)
  const products: Product[] = []

  array.forEach(element => {
    products.push({
      id: crypto.randomUUID(),
      name: `Product${Math.random()}`,
      short_description: 'Lorem ipsum dolor sit amet, consetetur sadipsc',
      description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy',
      image_url: 'file_name.jpg',
      price: '5.50',
      quantity: 1,
      category: category ? category : 'Category1',
      user_id: userId,
    })
  })

  return products
}

beforeEach(async () => {
  await createUser(userId1)
})

afterEach(async () => {
  const deleteProducts = prisma.product.deleteMany()
  const deleteUsers = prisma.user.deleteMany()
  await prisma.$transaction([deleteProducts])
  await prisma.$transaction([deleteUsers])
})

afterAll(async () => {
  await prisma.$disconnect()
})

describe('The product service', () => {
  test('adds a product', async () => {
    const products = createProduct(userId1, 1)
    const addedProduct = await productService.addProduct(products[0])

    expect(addedProduct).toEqual({
      ...products[0],
      image_url: 'http://localhost:5000/images/file_name.jpg',
    })
  })

  test('throws error for existing productname', async () => {
    const product = createProduct(userId1, 1)
    await productService.addProduct(product[0])

    try {
      await productService.addProduct(product[0])
    } catch (error: any) {
      expect(error.message).toBe('This product name is already taken.')
    }
  })

  test('returns all products', async () => {
    const products = createProduct(userId1, 2)
    await productService.addProduct(products[0])
    await productService.addProduct(products[1])

    const mappedProducts = products.map(product => {
      return {
        ...product,
        image_url: `http://localhost:5000/images/${product.image_url}`,
      }
    })

    const filter = { category: 'All' }

    try {
      const allProducts = await productService.allProducts(filter)
      expect(allProducts).toEqual(mappedProducts)
    } catch (error) {
      console.log(error)
    }
  })

  test('returns all products filtered for category', async () => {
    const product1 = createProduct(userId1, 1)
    const product2 = createProduct(userId1, 1, 'Category2')

    await productService.addProduct(product1[0])
    await productService.addProduct(product2[0])

    const mappedProduct2 = product2.map(product => {
      return {
        ...product,
        image_url: `http://localhost:5000/images/${product.image_url}`,
      }
    })

    const filter = { category: 'Category2' }

    try {
      const allProducts = await productService.allProducts(filter)
      expect(allProducts).toEqual(mappedProduct2)
    } catch (error) {
      console.log(error)
    }
  })

  test('returns all products per userId', async () => {
    await createUser(userId2)
    const user1Products = createProduct(userId1, 1)
    const user2Products = createProduct(userId2, 1)
    await productService.addProduct(user1Products[0])
    await productService.addProduct(user2Products[0])

    const mappedUser2Products = user2Products.map(product => {
      return {
        ...product,
        image_url: `http://localhost:5000/images/${product.image_url}`,
      }
    })

    const filter = { userId: userId2 }

    try {
      const allUser2Products = await productService.allProducts(filter)
      expect(allUser2Products).toEqual(mappedUser2Products)
    } catch (error) {
      console.log(error)
    }
  })

  test('returns a product by id', async () => {
    const products = createProduct(userId1, 2)
    await productService.addProduct(products[0])
    await productService.addProduct(products[1])

    const mappedProduct = {
      ...products[0],
      image_url: `http://localhost:5000/images/${products[0].image_url}`,
    }

    const productById = await productService.productById(products[0].id)

    expect(productById).toEqual(mappedProduct)
  })

  test('throws error, if product id was not found', async () => {
    const id = crypto.randomUUID()
    try {
      await productService.productById(id)
    } catch (error: any) {
      expect(error.message).toBe(`The product with the id: ${id} was not found.`)
    }
  })

  test('deletes a product', async () => {
    const products = createProduct(userId1, 2)
    await productService.addProduct(products[0])
    await productService.addProduct(products[1])

    const filter = {
      userId: '',
      category: '',
    }

    try {
      await productService.deleteById(products[0].id)
      const remainingProducts = await productService.allProducts(filter)
      expect(remainingProducts).not.toContain(products[0].id)
    } catch (error) {
      console.log(error)
    }
  })

  test('updates a product', async () => {
    const product = createProduct(userId1, 1)
    await productService.addProduct(product[0])
    const productToUpdate = {
      id: product[0].id,
      name: `UPDATED_Product: ${Date.now()}`,
      short_description: 'Lorem ipsum dolor sit amet, consetetur sadipsc',
      description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy',
      image_url: 'file_name.jpg',
      price: '10.00',
      quantity: 4,
      category: 'Category3',
      user_id: userId1,
    }

    const updatedProduct = await productService.updateProduct(productToUpdate)

    expect(updatedProduct).toEqual({
      ...productToUpdate,
      image_url: `http://localhost:5000/images/${product[0].image_url}`,
    })
  })
})
