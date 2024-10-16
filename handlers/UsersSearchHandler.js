import ListUsersHandler from "./ListUsersHandler";

class UsersSearchHandler {
  constructor() {
    this.allUsers = [];
    this.limit = 10;
    this.hasMoreUsers = true;
    this.textLength = 0;
  }

  async searchUsers(text) {
    if (text.length < this.textLength) {
      this.hasMoreUsers = true;
    }
    if (this.hasMoreUsers) {
      try {
        const allUsers = await ListUsersHandler({ username: text });
        this.allUsers = allUsers;
        if (this.allUsers.length < this.limit) {
          this.hasMoreUsers = false;
          this.textLength = text.length;
        }
        return this.allUsers;
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    } else {
      return this.allUsers.filter((user) => user.username.includes(text));
    }
  }

  cleanSearch() {
    this.allUsers = [];
    this.hasMoreUsers = true;
    this.textLength = 0;
  }
}

export default UsersSearchHandler;
