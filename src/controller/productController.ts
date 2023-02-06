import { PrismaClient } from '@prisma/client'
import ProductService from '../services/productService'
import validateResource from '../middleware/validateResource'
import { validProduct, ProductInput } from '../validation/product.validation'
import Product from '../types/product'
import ProductRepo from '../repositories/productRepository'
import express, { Request, Response } from 'express'

const productRouter = express.Router()

const client = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})
client.$connect()

const productService = new ProductService(new ProductRepo(client))

productRouter.get('/api/products/healthcheck', (_: Request, res: Response) => res.sendStatus(200))

productRouter.get('/api/products', async (req: Request, res: Response) => {
  const result = await productService.allProducts()
  res.json(result)
})

productRouter.post(
  '/api/product',
  validateResource(validProduct),
  async (req: Request<{}, {}, ProductInput>, res: Response) => {
    const validProduct = req.body
    try {
      const result = await productService.addProduct(validProduct)
      res.json(result)
    } catch (error: any) {
      res.status(400).send(error.message)
    }
  }
)

productRouter.delete('/api/product/:id', async (req: Request, res: Response) => {
  const id = req.params.id as string
  try {
    const result = await productService.deleteById(id)
    res.json(result)
  } catch (error: any) {
    res.status(400).send(error.message)
  }
})

productRouter.put(
  '/api/product',
  validateResource(validProduct),
  async (req: Request, res: Response) => {
    try {
      const result = await productService.updateProduct(req.body)
      res.json(result)
    } catch (error: any) {
      res.status(400).send(error.message)
    }
  }
)

export default productRouter
