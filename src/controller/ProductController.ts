import express, { Request, Response } from 'express'
import ProductService from '../services/ProductService'

const router = express.Router()

router.get('/api/products', (_: Request, res: Response) => {
  const result = new ProductService().allProducts()
  res.json(result)
})

router.get('/api/product/:id', (req: Request, res: Response) => {
  const id = req.params.id as string
  const result = new ProductService().productById(id)
  res.json(result)
})

export default router
