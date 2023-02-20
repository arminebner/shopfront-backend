import {
  Id,
  Name,
  ShortDescription,
  Description,
  Price,
  ImageUrl,
  Quantity,
  Category,
} from '../model/valueObjects'
import FileDeletionService from '../openServices/imageDeletionService'
import log from '../utils/logger'
import ProductEntity from '../model/product'
import ProductRepo from '../repositories/productRepository'
class ProductService {
  private repo: ProductRepo
  fileDeletionService: FileDeletionService

  constructor(repo: ProductRepo) {
    this.repo = repo
    this.fileDeletionService = new FileDeletionService()
  }

  async addProduct(productToAdd: any) {
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
      new ImageUrl(productToAdd.image_url),
      new Quantity(parseInt(productToAdd.quantity)),
      new Category(productToAdd.category),
      new Id(productToAdd.user_id)
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

  async updateProduct(productToUpdate: any) {
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
      new ImageUrl(productToUpdate.image_url),
      new Quantity(parseInt(productToUpdate.quantity)),
      new Category(productToUpdate.category),
      new Id(productToUpdate.user_id)
    )

    const updatedProduct = await this.repo.updateProduct(validProduct)

    return updatedProduct.toJSON()
  }
}

export default ProductService
