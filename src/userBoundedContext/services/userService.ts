import { Id, FirstName, LastName, Email, PwHash } from '../model/valueObjects'
import * as jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import log from '../../utils/logger'
import User from '../model/user'
import UserRepo from '../repositories/userRepository'
import RefreshTokenRepo from '../../repositories/refreshTokenRepository'
import RefreshTokenEntity from '../../common/model/refreshTokenEntity'
import { Jwt, TokenDate, TokenId } from '../../common/model/valueObjects'

class UserService {
  private userRepo: UserRepo
  private refreshTokenRepo: RefreshTokenRepo

  constructor(userRepo: UserRepo, refreshTokenRepo: RefreshTokenRepo) {
    this.userRepo = userRepo
    this.refreshTokenRepo = refreshTokenRepo
  }

  // TODO change to registerUser
  async addUser(user: any) {
    // TODO validate PW through VO (not of user, but maybe common?)
    const validEmail = new Email(user.email)
    const userWithEmail = await this.userRepo.userByEmail(validEmail)

    if (userWithEmail) {
      log.error(`The user with the email: ${user.email} already exists.`)
      throw new Error(`The user with the email: ${user.email} already exists.`)
    }

    const pwHash = await bcrypt.hash(user.password, 10)

    const validUser = new User(
      new Id(user.id),
      new FirstName(user.first_name),
      new LastName(user.last_name),
      new Email(user.email),
      new PwHash(pwHash)
    )

    const addedUser = await this.userRepo.addUser(validUser)

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
      { userId: userByEmail.id },
      process.env.ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: '30s',
      }
    )
    const refreshToken = jwt.sign(
      { userId: userByEmail.id },
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

    console.log(savedRefreshToken)

    return userByEmail.toJSON()
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
}

export default UserService
