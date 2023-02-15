import { afterAll, afterEach, describe, expect, test } from 'vitest'
import { PrismaClient } from '@prisma/client'
import UserService from '../../userBoundedContext/services/userService'
import UserRepo from '../../userBoundedContext/repositories/userRepository'
import crypto from 'crypto'

const prisma = new PrismaClient()
const userService = new UserService(new UserRepo(prisma))

afterEach(async () => {
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

    const addedUser = await userService.addUser(user)

    expect(addedUser).toEqual(user)
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

    await userService.addUser(user1)
    await userService.addUser(user2)

    const user2ById = await userService.userById(id2)

    expect(user2ById).toEqual(user2)
  })
})
