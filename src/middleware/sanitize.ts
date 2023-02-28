import { Request, Response, NextFunction } from 'express'
import xss from 'xss'

function sanitize(req: Request, res: Response, next: NextFunction) {
  if (req.body) {
    for (const key in req.body) {
      req.body[key] = xss(req.body[key] as string)
    }
  }

  if (req.query) {
    for (const key in req.query) {
      req.query[key] = xss(req.query[key] as string)
    }
  }

  if (req.params) {
    for (const key in req.params) {
      req.params[key] = xss(req.params[key])
    }
  }

  next()
}

export default sanitize
