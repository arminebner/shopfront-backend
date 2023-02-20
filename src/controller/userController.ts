import express, { Request, Response } from 'express'
import prisma from '../../prisma/client'
import RefreshTokenRepo from '../repositories/refreshTokenRepository'
import UserRepo from '../userBoundedContext/repositories/userRepository'
import UserService from '../userBoundedContext/services/userService'

const router = express.Router()
const userService = new UserService(new UserRepo(prisma), new RefreshTokenRepo(prisma))

router.get('/api/users/healthcheck', (_: Request, res: Response) => res.sendStatus(200))

router.post('/api/users/register', async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body

  if (!firstName || !lastName || !email || !password)
    res.status(400).json({ message: 'All fields are required' })

  const user = {
    first_name: firstName,
    last_name: lastName,
    email: email,
    password: password,
  }

  try {
    const result = await userService.addUser(user)
    res.status(201).json(result)
  } catch (error: any) {
    res.status(400).send(error.message)
  }
})

router.post('/api/users/login', async (req: Request, res: Response) => {
  const { email, password } = req.body

  if (!email || !password) return res.status(400).json({ message: 'All fields are required' })

  try {
    const result = await userService.loginUser(email, password)

    res.json({ success: `User ${result.first_name} ${result.last_name} is logged in` })
  } catch (error: any) {
    res.status(401).send(error.message)
  }
})

export default router
