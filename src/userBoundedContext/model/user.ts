import { Email, FirstName, Id, LastName } from './valueObjects'

class UserEntity {
  constructor(
    public id: Id,
    public firstName: FirstName,
    public lastName: LastName,
    public email: Email
  ) {}

  toJSON() {
    return {
      id: this.id.value,
      first_name: this.firstName.value,
      last_name: this.lastName.value,
      email: this.email.value,
    }
  }
}

export default UserEntity
