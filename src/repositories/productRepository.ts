import { PrismaClient } from '@prisma/client'
import ProductEntity from '../model/product'
import {
  Id,
  Name,
  ShortDescription,
  Description,
  Money,
  ImageUrl,
  Category,
  Quantity,
} from '../model/valueObjects'
class ProductRepo {
  prisma: PrismaClient

  constructor(client: PrismaClient) {
    this.prisma = client
  }

  async addProduct(validProduct: ProductEntity) {
    const data = await this.prisma.product.create({
      data: {
        id: validProduct.id.value,
        name: validProduct.name.value,
        short_description: validProduct.short_description.value,
        description: validProduct.description.value,
        image_url: validProduct.image_url.value,
        price: (validProduct.price as Money).value,
        quantity: validProduct.quantity.value,
        category: validProduct.category.value,
        user_id: validProduct.user_id.value,
      },
    })

    return productFromData(data)
  }

  async productById(id: string) {
    const productById = await this.prisma.product.findUnique({
      where: {
        id,
      },
    })
    return productById ? productFromData(productById) : undefined
  }

  async allProducts() {
    const allProducts = await this.prisma.product.findMany({})
    return allProducts.map(p => productFromData(p))
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

  async updateProduct(productToUpdate: ProductEntity) {
    const data = await this.prisma.product.update({
      where: {
        id: productToUpdate.id.value,
      },
      data: {
        id: productToUpdate.id.value,
        name: productToUpdate.name.value,
        short_description: productToUpdate.short_description.value,
        description: productToUpdate.description.value,
        image_url: productToUpdate.image_url.value,
        price: (productToUpdate.price as Money).value,
        quantity: productToUpdate.quantity.value,
        category: productToUpdate.category.value,
        user_id: productToUpdate.user_id.value,
      },
    })
    return productFromData(data)
  }
}

function productFromData(data: any) {
  return new ProductEntity(
    new Id(data.id),
    new Name(data.name),
    new ShortDescription(data.short_description),
    new Description(data.description),
    new Money(data.price),
    new ImageUrl(data.image_url),
    new Quantity(data.quantity),
    new Category(data.category),
    new Id(data.user_id)
  )
}

export default ProductRepo
