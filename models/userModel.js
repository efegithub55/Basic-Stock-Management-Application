const db = require("../config/database");
const bcrypt = require("bcrypt");

class User {
  constructor({ id, username, email, password, createdAt }) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.createdAt = createdAt;
  }

  // Tüm kullanıcıları çekme metodu
  static async findAll() {
    try {
      const [rows] = await db.query("SELECT * FROM users");
      return rows.map((user) => new User(user));
    } catch (err) {
      console.error("User.findAll hata:", err);
      throw err;
    }
  }
  // Kullanıcı ID ile kullanıcı verisi çekme metodu
  static async findById(id) {
    try {
      const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
      return rows.map((user) => new User(user));
    } catch (err) {
      console.error("User.findById hata:", err);
    }
  }

  // Kullanıcı email ile kullanıcı verisi çekme metodu
  static async findByEmail(email) {
    try {
      const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
        email,
      ]);
      return rows.map((user) => new User(user));
    } catch (err) {
      console.error("User.findByEmail hata:", err);
    }
  }

  // Kullanıcı adı ile kullanıcı verisi çekme metodu
  static async findByUsername(username) {
    try {
      const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [
        username,
      ]);
      return rows.map((user) => new User(user));
    } catch (err) {
      console.error("User.findByUsername hata:", err);
    }
  }

  // Kullanıcı ekleme metodu
  static async create(username, password, email) {
    try {
      db.query(
        "INSERT INTO users (`username`,`password`,`email`) VALUES (?, ?, ?)",
        [username, password, email]
      );
    } catch (err) {
      console.error("User.create hata:", err);
    }
  }

  static async update(id, userData) {
    try {
      const newUsername = userData.username || this.username;
      const newEmail = userData.email || this.email;
      let newPassword = this.password;

      if (userData.password) {
        newPassword = await bcrypt.hash(userData.password, 10);
      }

      await db.query(
        "UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?",
        [newUsername, newEmail, newPassword, id]
      );

      this.username = newUsername;
      this.password = newPassword;
      this.email = newEmail;

      return this;
    } catch (err) {
      console.error("User.update hata:", err);
      throw err;
    }
  }

  // Kullanıcı kaydı silme metodu
  static async delete(id) {
    try {
      await db.query("DELETE FROM users WHERE id = ?", [id]);
    } catch (err) {
      console.error("User.delete hata:", err);
    }
  }
}

module.exports = User;
