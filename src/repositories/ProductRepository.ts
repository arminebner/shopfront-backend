import { PrismaClient } from '@prisma/client'

class ProductRepo {
  prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }

  async addProduct(productToAdd) {
    const addedProduct = await this.prisma.product.create({
      data: {
        id: productToAdd.id,
        name: productToAdd.name,
        image_url: productToAdd.image_url,
        price: productToAdd.price,
      },
    })
    return addedProduct
  }

  async productById(id: string) {
    const productById = await this.prisma.product.findUnique({
      where: {
        id,
      },
    })
    return productById
  }

  async allProducts() {
    return this.prisma.product.findMany({})
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

  async updateProduct(productToUpdate) {
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
    return updatedProduct
  }
}

export default ProductRepo
