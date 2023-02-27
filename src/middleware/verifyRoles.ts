import { Request, Response, NextFunction } from 'express'

function verifyRoles(...roles: string[]) {
  // TODO unit test?
  return (req: Request, res: Response, next: NextFunction) => {
    const allowedRoles = [...roles]
    const result = req.roles?.map(role => allowedRoles.includes(role)).find(val => val === true)
    if (!result) return res.sendStatus(401)
    next()
  }
}

export default verifyRoles
