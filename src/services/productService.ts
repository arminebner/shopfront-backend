import ProductRepo from '../repositories/productRepository'
import Product from '../types/product'
import log from '../utils/logger'
import fs from 'fs'
import path from 'path'
import config from 'config'
import ProductEntity from '../model/product'
import { Id, Name, ShortDescription, Description, Money, ImageUrl } from '../model/valueObjects'

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

  mapImageUrls(product: Product) {
    return {
      ...product,
      image_url: `${host}/${product.image_url}`,
    }
  }

  async addProduct(productToAdd: Product) {
    const existingProduct = await this.repo.productNameExists(productToAdd.name)

    if (existingProduct) {
      this.deleteProductImageFromFS(productToAdd.image_url)
      log.error(`${productToAdd.name}: Productname already exists`)
      throw new Error('This product name is already taken.')
    }

    const productEntity = new ProductEntity(
      new Id(productToAdd.id),
      new Name(productToAdd.name),
      new ShortDescription(productToAdd.short_description),
      new Description(productToAdd.description),
      new Money(productToAdd.price),
      new ImageUrl(productToAdd.image_url)
    )

    return await this.repo.addProduct(productToAdd)
  }

  async allProducts() {
    const allProducts = await this.repo.allProducts()

    return allProducts.map(product => this.mapImageUrls(product))
  }

  async productById(id: string) {
    const productById = await this.repo.productById(id)

    if (!productById) {
      log.error(`The product with the id: ${id} was not found.`)
      throw new Error(`The product with the id: ${id} was not found.`)
    }

    return this.mapImageUrls(productById)
  }

  async deleteById(id: string) {
    const productById = await this.repo.productById(id)

    if (!productById) {
      log.error(`The product with the id: ${id} was not found.`)
      throw new Error(`The product with the id: ${id} was not found.`)
    }

    await this.repo.deleteById(id)

    this.deleteProductImageFromFS(productById.image_url)

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
