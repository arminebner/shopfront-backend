import { Request, Response, NextFunction } from 'express'

export default function errorHander(err: Error, req: Request, res: Response, next: NextFunction) {
  res.status(500).send(err.message)
  next()
}
