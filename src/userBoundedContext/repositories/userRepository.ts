import { PrismaClient } from '@prisma/client'
import UserEntity from '../model/user'
import { Email, FirstName, Id, LastName, PwHash } from '../model/valueObjects'

class UserRepo {
  prisma: PrismaClient

  constructor(client: PrismaClient) {
    this.prisma = client
  }

  async addUser(validUser: UserEntity) {
    const data = await this.prisma.user.create({
      data: {
        id: validUser.id.value,
        first_name: validUser.firstName.value,
        last_name: validUser.lastName.value,
        email: validUser.email.value,
        pw_hash: validUser.pwHash.value,
      },
    })
    return userFromData(data)
  }

  async userById(id: Id) {
    const data = await this.prisma.user.findUnique({
      where: {
        id: id.value,
      },
    })
    return data ? userFromData(data) : undefined
  }

  async userByEmail(email: Email) {
    const data = await this.prisma.user.findUnique({
      where: {
        email: email.value,
      },
    })
    return data ? userFromData(data) : undefined
  }
}

function userFromData(data: any) {
  return new UserEntity(
    new Id(data.id),
    new FirstName(data.first_name),
    new LastName(data.last_name),
    new Email(data.email),
    new PwHash(data.pw_hash)
  )
}

export default UserRepo
