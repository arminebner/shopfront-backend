import express, { Request, Response } from 'express'
import productRouter from './productController'
import userRouter from './userController'

const router = express.Router()

router.get('/healthcheck', (_: Request, res: Response) => res.sendStatus(200))

router.use(productRouter)
router.use(userRouter)

export default router
