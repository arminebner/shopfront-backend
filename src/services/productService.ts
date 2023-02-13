import { Id, Name, ShortDescription, Description, Price, ImageUrl } from '../model/valueObjects'
import FileDeletionService from '../openServices/imageDeletionService'
import log from '../utils/logger'
import Product from '../types/product'
import ProductEntity from '../model/product'
import ProductRepo from '../repositories/productRepository'
class ProductService {
  repo: ProductRepo
  fileDeletionService: FileDeletionService

  constructor(repo: ProductRepo) {
    this.repo = repo
    this.fileDeletionService = new FileDeletionService()
  }

  async addProduct(productToAdd: Product) {
    const existingProduct = await this.repo.productNameExists(productToAdd.name)

    if (existingProduct) {
      this.fileDeletionService.deleteProductImage(productToAdd.image_url)
      log.error(`${productToAdd.name}: Productname already exists`)
      throw new Error('This product name is already taken.')
    }

    const validProduct = new ProductEntity(
      new Id(productToAdd.id),
      new Name(productToAdd.name),
      new ShortDescription(productToAdd.short_description),
      new Description(productToAdd.description),
      new Price(productToAdd.price).valueToMoney(),
      new ImageUrl(productToAdd.image_url)
    )

    const addedProduct = await this.repo.addProduct(validProduct)

    return addedProduct.toJSON()
  }

  async allProducts() {
    const allProducts = await this.repo.allProducts()

    return allProducts.map(product => product.toJSON())
  }

  async productById(id: string) {
    const productById = await this.repo.productById(id)

    if (!productById) {
      log.error(`The product with the id: ${id} was not found.`)
      throw new Error(`The product with the id: ${id} was not found.`)
    }

    return productById.toJSON()
  }

  async deleteById(id: string) {
    const productById = await this.repo.productById(id)

    if (!productById) {
      log.error(`The product with the id: ${id} was not found.`)
      throw new Error(`The product with the id: ${id} was not found.`)
    }

    await this.repo.deleteById(id)

    this.fileDeletionService.deleteProductImage(productById.image_url.value)

    return id
  }

  async updateProduct(productToUpdate: Product) {
    const productById = await this.repo.productById(productToUpdate.id)

    if (!productById) {
      log.error(`The product with the id: ${productToUpdate.id} was not found.`)
      throw new Error(`The product with the id: ${productToUpdate.id} was not found.`)
    }

    const validProduct = new ProductEntity(
      new Id(productToUpdate.id),
      new Name(productToUpdate.name),
      new ShortDescription(productToUpdate.short_description),
      new Description(productToUpdate.description),
      new Price(productToUpdate.price).valueToMoney(),
      new ImageUrl(productToUpdate.image_url)
    )

    const updatedProduct = await this.repo.updateProduct(validProduct)

    return updatedProduct.toJSON()
  }
}

export default ProductService
