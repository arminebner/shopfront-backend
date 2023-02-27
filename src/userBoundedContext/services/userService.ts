import { Id, FirstName, LastName, Email, PwHash, Roles } from '../model/valueObjects'
import * as jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import log from '../../utils/logger'
import User from '../model/user'
import UserRepo from '../repositories/userRepository'
import RefreshTokenRepo from '../../repositories/refreshTokenRepository'
import RefreshTokenEntity from '../../common/model/refreshTokenEntity'
import { Jwt, TokenDate, TokenId, Password } from '../../common/model/valueObjects'
import JwtPayload from '../../types/jwtPayload'

class UserService {
  private userRepo: UserRepo
  private refreshTokenRepo: RefreshTokenRepo

  constructor(userRepo: UserRepo, refreshTokenRepo: RefreshTokenRepo) {
    this.userRepo = userRepo
    this.refreshTokenRepo = refreshTokenRepo
  }

  async registerUser(user: any) {
    const validPassword = new Password(user.password)
    const validEmail = new Email(user.email)
    const userWithEmail = await this.userRepo.userByEmail(validEmail)

    if (userWithEmail) {
      log.error(`The user with the email: ${user.email} already exists.`)
      throw new Error(`The user with the email: ${user.email} already exists.`)
    }

    const pwHash = await bcrypt.hash(validPassword.value, 10)

    const roles = user.seller ? ['user', 'seller'] : ['user']

    const validUser = new User(
      new Id(user.id),
      new FirstName(user.first_name),
      new LastName(user.last_name),
      new Email(user.email),
      new PwHash(pwHash),
      new Roles(roles)
    )

    const addedUser = await this.userRepo.registerUser(validUser)

    return addedUser.toJSON()
  }

  async loginUser(email: string, password: string) {
    const validEmail = new Email(email)
    const userByEmail = await this.userRepo.userByEmail(validEmail)

    if (!userByEmail) {
      log.error(`The user with the email: ${email} was not found.`)
      throw new Error(`The user with the email: ${email} was not found.`)
    }

    const pwMatch = await bcrypt.compare(password, userByEmail.pwHash.value)

    if (!pwMatch) {
      log.error(`401 unauthorized`)
      throw new Error(`401 unauthorized`)
    }

    const accessToken = jwt.sign(
      {
        userInfo: {
          userId: userByEmail.id.value,
          userName: `${userByEmail.firstName.value} ${userByEmail.lastName.value}`,
          roles: userByEmail.roles.value,
        },
      },
      process.env.ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: '30s',
      }
    )
    const refreshToken = jwt.sign(
      {
        userInfo: {
          userId: userByEmail.id.value,
        },
      },
      process.env.REFRESH_TOKEN_SECRET as string,
      {
        expiresIn: '1d',
      }
    )

    const oneDay = 86400000
    const createdAt = Date.now()
    const validTokenDate = new TokenDate(createdAt)

    const validRefreshToken = new RefreshTokenEntity(
      new TokenId(),
      new Id(userByEmail.id.value),
      new Jwt(refreshToken),
      validTokenDate,
      validTokenDate.expiresAt(oneDay)
    )

    const savedRefreshToken = await this.refreshTokenRepo.addToken(validRefreshToken)

    return { accessToken: accessToken, refreshToken: savedRefreshToken.refreshToken.value }
  }

  async refreshAccess(refreshToken: string) {
    const validJwt = new Jwt(refreshToken)
    const existingRefreshToken = await this.refreshTokenRepo.tokenByTokenstring(validJwt)
    if (!existingRefreshToken) {
      log.error(`Unauthorized`)
      throw new Error(`Unauthorized`)
    }

    const existingUserById = await this.userRepo.userById(existingRefreshToken.userId)
    let accessToken = null

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string, (error, decodedToken) => {
      if (error || existingUserById?.id.value !== (decodedToken as JwtPayload).userInfo.userId) {
        throw new Error('Unauthorized')
      }
      accessToken = jwt.sign(
        {
          userInfo: {
            userId: existingUserById.id.value,
            userName: `${existingUserById.firstName.value} ${existingUserById.lastName.value}`,
            roles: existingUserById.roles.value,
          },
        },
        process.env.ACCESS_TOKEN_SECRET as string,
        {
          expiresIn: '30s',
        }
      )
    })
    return { accessToken }
  }

  async logoutUser(refreshToken: string) {
    const validJwt = new Jwt(refreshToken)
    await this.refreshTokenRepo.deleteToken(validJwt)
  }

  async userById(id: string) {
    const validId = new Id(id)
    const userById = await this.userRepo.userById(validId)

    if (!userById) {
      log.error(`The user with the id: ${id} was not found.`)
      throw new Error(`The user with the id: ${id} was not found.`)
    }

    return userById.toJSON()
  }

  async userByToken(refreshToken: string) {
    const validJwt = new Jwt(refreshToken)
    const existingRefreshToken = await this.refreshTokenRepo.tokenByTokenstring(validJwt)
    if (!existingRefreshToken) {
      log.error(`Unauthorized`)
      throw new Error(`Unauthorized`)
    }

    const existingUserById = await this.userRepo.userById(existingRefreshToken.userId)

    return existingUserById?.toJSON()
  }
}

export default UserService
