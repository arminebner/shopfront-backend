import { Email, FirstName, Id, LastName, PwHash, Roles } from './valueObjects'

class UserEntity {
  constructor(
    public id: Id,
    public firstName: FirstName,
    public lastName: LastName,
    public email: Email,
    public pwHash: PwHash,
    public roles: Roles
  ) {}

  toJSON() {
    return {
      id: this.id.value,
      first_name: this.firstName.value,
      last_name: this.lastName.value,
      email: this.email.value,
      roles: this.roles.value,
    }
  }
}

export default UserEntity
