import ProductRepo from '../repositories/ProductRepository'

class ProductService {
  repo: ProductRepo

  constructor() {
    this.repo = new ProductRepo()
  }

  async addProduct(productToAdd) {
    // product valueObjects for newProduct and existingProduct ?
    const existingProduct = await this.repo.productNameExists(productToAdd.name)

    if (existingProduct) {
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
      throw new Error(`The product with the id: ${id} was not found.`)
    }

    return productById
  }

  async deleteById(id: string) {
    const productById = await this.repo.productById(id)

    if (!productById) {
      throw new Error(`The product with the id: ${id} was not found.`)
    }

    await this.repo.deleteById(id)

    return id
  }
}

export default ProductService
