import UserRepo from '../repositories/userRepository'
import User from '../model/user'
import { Id, FirstName, LastName, Email } from '../model/valueObjects'
import log from '../../utils/logger'

class UserService {
  repo: UserRepo

  constructor(repo: UserRepo) {
    this.repo = repo
  }

  async addUser(user: any) {
    const validUser = new User(
      new Id(user.id),
      new FirstName(user.first_name),
      new LastName(user.last_name),
      new Email(user.email)
    )

    const addedUser = await this.repo.addUser(validUser)
    return addedUser.toJSON()
  }

  async userById(id: string) {
    const validId = new Id(id)
    const userById = await this.repo.userById(validId)

    if (!userById) {
      log.error(`The user with the id: ${id} was not found.`)
      throw new Error(`The user with the id: ${id} was not found.`)
    }

    return userById.toJSON()
  }
}

export default UserService
