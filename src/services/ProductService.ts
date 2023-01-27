import ProductRepo from '../repositories/ProductRepository'

class ProductService {
  repo: ProductRepo

  constructor() {
    this.repo = new ProductRepo()
  }
  async addProduct(productToAdd) {
    // product valueObjects for newProduct and existingProduct ?
    const existingProduct = await this.repo.productExists(productToAdd.name)

    if (existingProduct) {
      return 'Error: This product name is already taken.'
    }

    const addedProduct = await this.repo.addProduct(productToAdd)
    return addedProduct
  }

  async allProducts() {
    return await this.repo.allProducts()
  }

  async productById(id: string) {
    return await this.repo.productById(id)
  }
}

export default ProductService
