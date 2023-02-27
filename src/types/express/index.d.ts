declare namespace Express {
  export interface Request {
    userId?: string
    userName?: string
    roles?: string[]
  }
}
