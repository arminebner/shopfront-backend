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
        id: id,
      },
    })
    return productById
  }

  async allProducts() {
    return this.prisma.product.findMany({})
  }

  async productExists(name: string) {
    const productById = await this.prisma.product.findFirst({
      select: {
        id: true,
        name: true,
        image_url: true,
        price: true,
      },
      where: {
        name: name,
      },
    })
    return productById
  }
}

export default ProductRepo
