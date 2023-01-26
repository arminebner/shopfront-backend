import express, { Request, Response } from 'express'
import productController from './ProductController'

const router = express.Router()

router.get('/healthcheck', (_: Request, res: Response) => res.sendStatus(200))

router.use(productController)

export default router
