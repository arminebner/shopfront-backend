import { Request, Response, NextFunction } from 'express'
import * as jwt from 'jsonwebtoken'

interface JwtPayload {
  userId: string
}

const verifyJwt = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  if (!authHeader) return res.sendStatus(403)

  const token = authHeader.split(' ')[1]

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (error, decodedToken) => {
    if (error) {
      console.log(error)
      return res.sendStatus(403)
    }
    if (decodedToken) {
      req.userId = (decodedToken as JwtPayload).userId
      next()
    }
  })
}

export default verifyJwt
