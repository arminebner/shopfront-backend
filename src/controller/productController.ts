import { validProduct } from '../validation/productValidation'
import config from 'config'
import express, { Request, Response } from 'express'
import prisma from '../../prisma/client'
import ProductRepo from '../repositories/productRepository'
import ProductService from '../services/productService'
import upload from '../utils/initMulter'
import userRoles from '../types/userRole'
import validateResource from '../middleware/validateResource'
import verifyJwt from '../middleware/verirfyJwt'
import verifyRoles from '../middleware/verifyRoles'

const allowedRoles = config.get<userRoles>('allowedRoles')
const productService = new ProductService(new ProductRepo(prisma))
const productRouter = express.Router()

productRouter.get('/api/products/healthcheck', (_: Request, res: Response) => res.sendStatus(200))

productRouter.get('/api/products', async (req: Request, res: Response) => {
  const result = await productService.allProducts({})
  res.json(result)
})

productRouter.get('/api/products/category/:category', async (req: Request, res: Response) => {
  const category = req.params.category as string
  const result = await productService.allProducts({ category })
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

productRouter.get('/api/products/user/:id', verifyJwt, async (req: Request, res: Response) => {
  const id = req.params.id as string
  try {
    const result = await productService.allProducts({ userId: id })
    res.json(result)
  } catch (error: any) {
    res.status(400).send(error.message)
  }
})

productRouter.post(
  '/api/product',
  verifyJwt,
  verifyRoles(allowedRoles.seller),
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

productRouter.put(
  '/api/product',
  verifyJwt,
  verifyRoles(allowedRoles.seller),
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

productRouter.delete(
  '/api/product/:id',
  verifyJwt,
  verifyRoles(allowedRoles.seller),
  async (req: Request, res: Response) => {
    const id = req.params.id as string
    try {
      const result = await productService.deleteById(id)
      res.json(result)
    } catch (error: any) {
      res.status(400).send(error.message)
    }
  }
)

export default productRouter
