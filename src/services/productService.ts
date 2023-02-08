import ProductRepo from '../repositories/productRepository'
import Product from '../types/product'
import log from '../utils/logger'
import fs from 'fs'
import path from 'path'
import config from 'config'
import ProductEntity from '../model/product'
import {
  Id,
  Name,
  ShortDescription,
  Description,
  Price,
  Money,
  ImageUrl,
} from '../model/valueObjects'

const host = config.get<string>('host')

class ProductService {
  repo: ProductRepo

  constructor(repo: ProductRepo) {
    this.repo = repo
  }

  deleteProductImageFromFS(imageUrl: string) {
    const storagePath = path.join(__dirname, '..', 'public', 'images')
    const pathToImage = `${storagePath}/${imageUrl}`

    fs.stat(pathToImage, (error: any, stat) => {
      if (error) {
        log.error(`${pathToImage} does not exist`)
      } else {
        fs.unlink(pathToImage, error => {
          if (error) throw error
        })
        log.info('File deleted successfully')
      }
    })
  }

  toJSON(product: ProductEntity) {
    return {
      id: product.id.value,
      name: product.name.value,
      short_description: product.short_description.value,
      description: product.description.value,
      price: (product.price as Money).valueToPrice().value,
      image_url: `${host}/${product.image_url.value}`,
    }
  }

  async addProduct(productToAdd: Product) {
    const existingProduct = await this.repo.productNameExists(productToAdd.name)

    if (existingProduct) {
      this.deleteProductImageFromFS(productToAdd.image_url)
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

    return this.toJSON(addedProduct)
  }

  async allProducts() {
    const allProducts = await this.repo.allProducts()

    return allProducts.map(product => this.toJSON(product))
  }

  async productById(id: string) {
    const productById = await this.repo.productById(id)

    if (!productById) {
      log.error(`The product with the id: ${id} was not found.`)
      throw new Error(`The product with the id: ${id} was not found.`)
    }

    return this.toJSON(productById)
  }

  async deleteById(id: string) {
    const productById = await this.repo.productById(id)

    if (!productById) {
      log.error(`The product with the id: ${id} was not found.`)
      throw new Error(`The product with the id: ${id} was not found.`)
    }

    await this.repo.deleteById(id)

    this.deleteProductImageFromFS(productById.image_url.value)

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

    return this.toJSON(updatedProduct)
  }
}

export default ProductService
