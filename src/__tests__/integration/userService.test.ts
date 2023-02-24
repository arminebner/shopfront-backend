import { afterAll, afterEach, describe, expect, test } from 'vitest'
import { PrismaClient } from '@prisma/client'
import UserService from '../../userBoundedContext/services/userService'
import UserRepo from '../../userBoundedContext/repositories/userRepository'
import crypto from 'crypto'
import RefreshTokenRepo from '../../repositories/refreshTokenRepository'
import { Jwt } from '../../common/model/valueObjects'

const prisma = new PrismaClient()
const userService = new UserService(new UserRepo(prisma), new RefreshTokenRepo(prisma))

afterEach(async () => {
  //TODO delete only the user created in THIS test
  const deleteUsers = prisma.user.deleteMany()
  await prisma.$transaction([deleteUsers])
})

afterAll(async () => {
  await prisma.$disconnect()
})

describe('The user service', () => {
  test('adds a user', async () => {
    const user = {
      id: crypto.randomUUID(),
      first_name: 'Test',
      last_name: 'User',
      email: 'testuser@test.de',
    }

    const addedUser = await userService.registerUser({
      ...user,
      password: '983w747na8worzon439rzfona4rv',
    })

    expect(addedUser).toEqual({ ...user })
  })

  test('throws error, if user with email already exists', async () => {
    const id1 = crypto.randomUUID()
    const id2 = crypto.randomUUID()
    const user1 = {
      id: id1,
      first_name: 'Test',
      last_name: 'User',
      email: 'testuser@test.de',
      password: '983w747na8worzon439rzfona4rv',
    }
    const user2 = {
      id: id2,
      first_name: 'Test2',
      last_name: 'User2',
      email: 'testuser@test.de',
      password: '983w747na8worzon439rzfona4rv',
    }

    await userService.registerUser(user1)

    try {
      await userService.registerUser(user2)
    } catch (error: any) {
      expect(error.message).toBe('The user with the email: testuser@test.de already exists.')
    }
  })

  test('gets a user by id', async () => {
    const id1 = crypto.randomUUID()
    const id2 = crypto.randomUUID()
    const user1 = {
      id: id1,
      first_name: 'Test',
      last_name: 'User',
      email: 'testuser@test.de',
    }
    const user2 = {
      id: id2,
      first_name: 'Test',
      last_name: 'User',
      email: 'testuser_2@test.de',
    }

    await userService.registerUser({ ...user1, password: '983w747na8worzon439rzfona4rv' })
    await userService.registerUser({ ...user2, password: '983w747na8worzon439rzfona4rv' })

    const user2ById = await userService.userById(id2)

    expect(user2ById).toEqual(user2)
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