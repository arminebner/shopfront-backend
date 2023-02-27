import ProductService from '../services/productService'
import validateResource from '../middleware/validateResource'
import { validProduct } from '../validation/productValidation'
import ProductRepo from '../repositories/productRepository'
import express, { Request, Response } from 'express'
import upload from '../utils/initMulter'
import prisma from '../../prisma/client'
import verifyJwt from '../middleware/verirfyJwt'
import verifyRoles from '../middleware/verifyRoles'
import config from 'config'
import userRoles from '../types/userRole'

const allowedRoles = config.get<userRoles>('allowedRoles')
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
  verifyJwt,
  verifyRoles(allowedRoles.seller),
  upload.single('image_url'),
  validateResource(validProduct),
  async (req: Request, res: Response) => {
    const validProduct = {
      ...req.body,
      image_url: `${req.file?.filename}`,
      // TODO: set user_id to user id from jwt cookie payload
      user_id: 'de3d5302-5ba2-40f4-b9f4-c8537ffc0671',
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
      // TODO: set user_id to user id from jwt cookie payload
      user_id: 'de3d5302-5ba2-40f4-b9f4-c8537ffc0671',
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
