import express, { Request, Response } from 'express'
import ProductService from '../services/ProductService'
import validateResource from '../middleware/validateResource'
import { validProduct, ProductInput } from './../validation/product.validation'

const router = express.Router()
const productService = new ProductService()

router.get('/api/products', async (_: Request, res: Response) => {
  const result = await productService.allProducts()
  res.json(result)
})

router.get('/api/product/:id', async (req: Request, res: Response) => {
  const id = req.params.id as string
  const result = await productService.productById(id)
  res.json(result)
})

router.post(
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

router.delete('/api/product/:id', async (req: Request, res: Response) => {
  const id = req.params.id as string
  try {
    const result = await productService.deleteById(id)
    res.json(result)
  } catch (error: any) {
    res.status(400).send(error.message)
  }
})

router.put('/api/product', validateResource(validProduct), async (req: Request, res: Response) => {
  try {
    const result = await productService.updateProduct(req.body)
    res.json(result)
  } catch (error: any) {
    res.status(400).send(error.message)
  }
})

export default router
