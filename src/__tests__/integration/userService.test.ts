import { afterAll, afterEach, describe, expect, test } from 'vitest'
import { PrismaClient } from '@prisma/client'
import UserService from '../../boundedContexts/iam/services/userService'
import UserRepo from '../../boundedContexts/iam/repositories/userRepository'
import crypto from 'crypto'
import RefreshTokenRepo from '../../boundedContexts/iam/repositories/refreshTokenRepository'

const prisma = new PrismaClient()
const userService = new UserService(new UserRepo(prisma), new RefreshTokenRepo(prisma))

afterEach(async () => {
  const deleteUsers = prisma.user.deleteMany()
  await prisma.$transaction([deleteUsers])
})

afterAll(async () => {
  await prisma.$disconnect()
})

function createUser() {
  return {
    id: crypto.randomUUID(),
    first_name: 'Test',
    last_name: 'User',
    email: 'testuser@test.de',
  }
}

describe('The user service', () => {
  test('adds a user with default role user', async () => {
    const user = createUser()
    const addedUser = await userService.registerUser({
      ...user,
      password: '983w747na8worzon439rzfona4rv',
    })
    expect(addedUser).toEqual({ ...user, roles: ['user'] })
  })

  test('adds a user on demand a seller', async () => {
    const user = createUser()
    const addedUser = await userService.registerUser({
      ...user,
      password: '983w747na8worzon439rzfona4rv',
      seller: true,
    })

    expect(addedUser).toEqual({ ...user, roles: ['user', 'seller'] })
  })

  test('throws error, if user with email already exists', async () => {
    const user1 = createUser()
    const user2 = createUser()

    await userService.registerUser({ ...user1, password: '983w747na8worzon439rzfona4rv' })

    try {
      await userService.registerUser({ ...user2, password: '983w747na8worzon439rzfona4rv' })
    } catch (error: any) {
      expect(error.message).toBe('The user with the email: testuser@test.de already exists.')
    }
  })

  test('gets a user by id', async () => {
    const user1 = createUser()
    const user2 = createUser()

    await userService.registerUser({ ...user1, password: '983w747na8worzon439rzfona4rv' })
    await userService.registerUser({
      ...user2,
      email: 'other@mail.de',
      password: '983w747na8worzon439rzfona4rv',
    })

    const user2ById = await userService.userById(user2.id)

    expect(user2ById).toEqual({ ...user2, email: 'other@mail.de', roles: ['user'] })
  })

  // TODO logs a user in
  /*   test('creates and sends access and refresh token', async () => {
    const id1 = crypto.randomUUID()
    const user1 = {
      id: id1,
      first_name: 'Test',
      last_name: 'User',
      email: 'testuser@test.de',
    }
    await userService.registerUser({ ...user1, password: '983w747na8worzon439rzfona4rv' })

    const tokens = await userService.loginUser('testuser@test.de', '983w747na8worzon439rzfona4rv')

    console.log(tokens)

    expect(tokens.accessToken).toBeInstanceOf(Jwt)
  }) */
  // TODO refreshs token
  // TODO get logged in user via userService.userByToken
  // TODO logs a user out
})
