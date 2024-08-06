const db = require('../database');

module.exports = class User {
  constructor(userId, UserName, Email, Password, Role, ProfilePicture, ContactNumber) {
    this.userId = userId;
    this.UserName = UserName;
    this.Email = Email;
    this.Password = Password;
    this.Role = Role;
    this.ProfilePicture = ProfilePicture;
    this.ContactNumber = ContactNumber;
  }

  // create new User
  addUser() {
    return db.execute(
      'INSERT INTO Users (UserName, Email, Password, Role, ProfilePicture, ContactNumber) VALUES (?,?,?,?,?,?)',
      [this.UserName, this.Email, this.Password, this.Role, this.ProfilePicture, this.ContactNumber]
    );
  }

  // fetch All User
  static fecthAllUsers() {
    return db.execute('SELECT * FROM Users');
  }

  // fetch Single User
  static async findById(id) {
    return await db.execute('SELECT * FROM Users WHERE UserId = ?', [id]);
  }
};
