import express, { Request, Response } from 'express'
import prisma from '../../../../prisma/client'
import RefreshTokenRepo from '../repositories/refreshTokenRepository'
import UserRepo from '../repositories/userRepository'
import UserService from '../services/userService'
import verifyJwt from '../../../middleware/verirfyJwt'

const router = express.Router()
const userService = new UserService(new UserRepo(prisma), new RefreshTokenRepo(prisma))

router.get('/api/users/healthcheck', (_: Request, res: Response) => res.sendStatus(200))

router.get('/api/users/user', verifyJwt, async (req: Request, res: Response) => {
  const cookies = req.cookies

  if (!cookies?.jwt) return res.sendStatus(204)
  const refreshToken = cookies.jwt
  try {
    const result = await userService.userByToken(refreshToken)
    res.json(result)
  } catch (error: any) {
    res.status(400).send(error.message)
  }
})

router.post('/api/users/register', async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, seller } = req.body

  if (!firstName || !lastName || !email || !password)
    res.status(400).json({ message: 'All fields are required' })

  const user = {
    first_name: firstName,
    last_name: lastName,
    email: email,
    password: password,
    seller: seller,
  }

  try {
    const result = await userService.registerUser(user)
    res.status(201).json(result)
  } catch (error: any) {
    res.status(400).send(error.message)
  }
})

router.post('/api/users/access', async (req: Request, res: Response) => {
  const { email, password } = req.body

  if (!email || !password) return res.status(400).json({ message: 'All fields are required' })

  try {
    const result = await userService.loginUser(email, password)

    res.cookie('jwt', result.refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    })
    res.json({ accessToken: result.accessToken })
  } catch (error: any) {
    res.status(401).send(error.message)
  }
})

router.get('/api/users/refreshAccess', async (req: Request, res: Response) => {
  const cookies = req.cookies

  if (!cookies?.jwt) return res.sendStatus(204)
  const refreshToken = cookies.jwt

  try {
    const result = await userService.refreshAccess(refreshToken)
    res.json({ accessToken: result.accessToken })
  } catch (error: any) {
    res.status(400).send(error.message)
  }
})

router.get('/api/users/logout', async (req: Request, res: Response) => {
  const cookies = req.cookies
  if (!cookies?.jwt) return res.sendStatus(204)
  const refreshToken = cookies.jwt

  try {
    await userService.logoutUser(refreshToken)
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true })
    res.sendStatus(204)
  } catch (error: any) {
    res.status(400).send(error.message)
  }
})

export default router
