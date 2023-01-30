import ProductRepo from '../repositories/ProductRepository'
import Product from '../types/Product'
import log from '../utils/logger'

class ProductService {
  repo: ProductRepo

  constructor() {
    this.repo = new ProductRepo()
  }

  async addProduct(productToAdd: Product) {
    // product valueObjects for newProduct and existingProduct ?
    const existingProduct = await this.repo.productNameExists(productToAdd.name)

    if (existingProduct) {
      log.error(`${productToAdd.name}: Productname already exists`)
      throw new Error('This product name is already taken.')
    }

    return await this.repo.addProduct(productToAdd)
  }

  async allProducts() {
    return await this.repo.allProducts()
  }

  async productById(id: string) {
    const productById = await this.repo.productById(id)

    if (!productById) {
      log.error(`The product with the id: ${id} was not found.`)
      throw new Error(`The product with the id: ${id} was not found.`)
    }

    return productById
  }

  async deleteById(id: string) {
    const productById = await this.repo.productById(id)

    if (!productById) {
      log.error(`The product with the id: ${id} was not found.`)
      throw new Error(`The product with the id: ${id} was not found.`)
    }

    await this.repo.deleteById(id)

    return id
  }

  async updateProduct(productToUpdate: Product) {
    const productById = await this.repo.productById(productToUpdate.id)

    if (!productById) {
      log.error(`The product with the id: ${productToUpdate.id} was not found.`)
      throw new Error(`The product with the id: ${productToUpdate.id} was not found.`)
    }

    const result = await this.repo.updateProduct(productToUpdate)

    return result
  }
}

export default ProductService
