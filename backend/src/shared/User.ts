import { Entity, Fields } from "remult"

@Entity("users", {
  allowApiCrud: true
})
export class User {
  @Fields.autoIncrement()
  id = 0;

  @Fields.string<User>({
    validate: (user) => {
      // Regular expression for email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!user.userEmail || !emailRegex.test(user.userEmail)) throw "Invalid email format";
    }
  })
  userEmail = "";

  @Fields.string<User>({
    validate: (user) => {
      if (!user.userName || user.userName.length < 3) throw "Username is too short or empty";
    }
  })
  userName = "";

  @Fields.string<User>({
    validate: (user) => {
      if (!user.password || user.password.length < 3) throw "Password is too short or empty";
    }
  })
  password = "";

  @Fields.updatedAt()
  updatedAt?: Date;

  @Fields.createdAt()
  createdAt?: Date;

  @Fields.string<User>()
  refreshToken = "";

  // Method to update createdAt if empty
  updateCreatedAtIfEmpty() {
    if (!this.createdAt) {
      this.createdAt = new Date();
    }
  }

  // Method to update updatedAt when updating the entity
  updateUpdatedAt() {
    this.updatedAt = new Date();
  }
}
