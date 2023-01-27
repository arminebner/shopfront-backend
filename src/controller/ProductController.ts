import express, { Request, Response } from 'express'
import ProductService from '../services/ProductService'

const router = express.Router()
const productService = new ProductService()

router.get('/api/products', async (_: Request, res: Response) => {
  const result = await productService.allProducts()
  res.json(result)
})

router.get('/api/product/:id', async (req: Request, res: Response) => {
  const id = req.params.id as string
  const result = productService.productById(id)
  res.json(result)
})

router.post('/api/product', async (req: Request, res: Response) => {
  const result = await productService.addProduct(req.body)
  res.json(result)
})

export default router
