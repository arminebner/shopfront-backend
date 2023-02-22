import { PrismaClient } from '@prisma/client'
import RefreshTokenEntity from '../common/model/refreshTokenEntity'
import { TokenId, Jwt, TokenDate } from '../common/model/valueObjects'
import { Id } from '../model/valueObjects'

class RefreshTokenRepo {
  prisma: PrismaClient

  constructor(client: PrismaClient) {
    this.prisma = client
  }

  async addToken(refreshToken: RefreshTokenEntity): Promise<RefreshTokenEntity> {
    const data = await this.prisma.refreshToken.create({
      data: {
        id: refreshToken.id.value,
        user_id: refreshToken.userId.value,
        refresh_token: refreshToken.refreshToken.value,
        created_at: refreshToken.createdAt.value,
        expires_at: refreshToken.expiresAt,
      },
    })
    return tokenFromData(data)
  }

  async tokenByTokenstring(tokenString: string): Promise<RefreshTokenEntity> {
    const data = await this.prisma.refreshToken.findUnique({
      where: {
        refresh_token: tokenString,
      },
    })
    return tokenFromData(data)
  }

  async deleteToken(tokenString: string) {
    const data = await this.prisma.refreshToken.delete({
      where: {
        refresh_token: tokenString,
      },
    })
  }
}

function tokenFromData(data: any) {
  return new RefreshTokenEntity(
    new TokenId(data.id),
    new Id(data.user_id),
    new Jwt(data.refresh_token),
    new TokenDate(data.created_at),
    data.expires_at
  )
}

export default RefreshTokenRepo
