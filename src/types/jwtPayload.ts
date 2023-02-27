export default interface JwtPayload {
  userInfo: {
    userId: string
    userName: string
    roles: string[]
  }
}
