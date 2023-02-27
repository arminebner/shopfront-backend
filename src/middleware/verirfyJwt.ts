import { Request, Response, NextFunction } from 'express'
import * as jwt from 'jsonwebtoken'
import JwtPayload from '../types/jwtPayload'

const verifyJwt = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  if (!authHeader) return res.sendStatus(401)

  const token = authHeader.split(' ')[1]

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (error, decodedToken) => {
    if (error) {
      console.log(error)
      return res.sendStatus(403)
    }
    if (decodedToken) {
      req.userId = (decodedToken as JwtPayload).userInfo.userId
      req.userName = (decodedToken as JwtPayload).userInfo.userName
      req.roles = (decodedToken as JwtPayload).userInfo.roles
      next()
    }
  })
}

export default verifyJwt
