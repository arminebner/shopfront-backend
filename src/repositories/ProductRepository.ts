import { PrismaClient } from '@prisma/client'
import { P } from 'pino'
import { map } from 'zod'
import Product from '../types/Product'

class ProductRepo {
  prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }

  async addProduct(productToAdd: Product) {
    const addedProduct = await this.prisma.product.create({
      data: {
        id: productToAdd.id,
        name: productToAdd.name,
        short_description: productToAdd.short_description,
        description: productToAdd.description,
        image_url: productToAdd.image_url,
        price: productToAdd.price,
      },
    })

    return mapDecimalToString(addedProduct)
  }

  async productById(id: string) {
    const productById = await this.prisma.product.findUnique({
      where: {
        id,
      },
    })
    return productById ? mapDecimalToString(productById) : undefined
  }

  async allProducts() {
    const allProducts = await this.prisma.product.findMany({})
    return allProducts.map(p => mapDecimalToString(p))
  }

  async productNameExists(name: string) {
    const productById = await this.prisma.product.findFirst({
      select: {
        id: true,
        name: true,
        image_url: true,
        price: true,
      },
      where: {
        name,
      },
    })
    return productById
  }

  async deleteById(id: string) {
    await this.prisma.product.delete({
      where: {
        id,
      },
    })
  }

  async updateProduct(productToUpdate: Product) {
    const updatedProduct = await this.prisma.product.update({
      where: {
        id: productToUpdate.id,
      },
      data: {
        id: productToUpdate.id,
        name: productToUpdate.name,
        image_url: productToUpdate.image_url,
        price: productToUpdate.price,
      },
    })
    return mapDecimalToString(updatedProduct)
  }
}

function mapDecimalToString(product: Product): Product {
  return {
    ...product,
    price: product.price.toString(),
  }
}

export default ProductRepo
