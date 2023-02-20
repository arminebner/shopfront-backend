import { Id } from '../../model/valueObjects'
import { TokenDate, TokenId, Jwt } from './valueObjects'

class RefreshTokenEntity {
  constructor(
    public id: TokenId,
    public userId: Id,
    public refreshToken: Jwt,
    public createdAt: TokenDate,
    public expiresAt: number
  ) {}

  toJSON() {
    return {
      id: this.id.value,
      userId: this.userId.value,
      refreshToken: this.refreshToken.value,
      createdAt: this.createdAt.value,
      expiresAt: this.expiresAt,
    }
  }
}

export default RefreshTokenEntity
