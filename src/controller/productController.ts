import ProductService from '../services/productService'
import validateResource from '../middleware/validateResource'
import { validProduct } from '../validation/productValidation'
import ProductRepo from '../repositories/productRepository'
import express, { Request, Response } from 'express'
import upload from '../utils/initMulter'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['info', 'warn', 'error'],
})
const productService = new ProductService(new ProductRepo(prisma))
const productRouter = express.Router()

productRouter.get('/api/products/healthcheck', (_: Request, res: Response) => res.sendStatus(200))

productRouter.get('/api/products', async (req: Request, res: Response) => {
  const result = await productService.allProducts()
  res.json(result)
})

productRouter.get('/api/product/:id', async (req: Request, res: Response) => {
  const id = req.params.id as string
  try {
    const result = await productService.productById(id)
    res.json(result)
  } catch (error: any) {
    res.status(400).send(error.message)
  }
})

productRouter.post(
  '/api/product',
  upload.single('image_url'),
  validateResource(validProduct),
  async (req: Request, res: Response) => {
    const validProduct = {
      ...req.body,
      image_url: `${req.file?.filename}`,
    }
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
  upload.single('image_url'),
  validateResource(validProduct),
  async (req: Request, res: Response) => {
    const validProduct = {
      ...req.body,
      image_url: `${req.file?.filename}`,
    }
    try {
      const result = await productService.updateProduct(validProduct)
      res.json(result)
    } catch (error: any) {
      res.status(400).send(error.message)
    }
  }
)

export default productRouter
