import Database from "better-sqlite3";

const db = new Database("todo.db");

const getUserByEmail = (email) => {
  const row = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  return row;
};

const getUserById = (id) => {
  const row = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
  return row;
};

const getUserByResetToken = (resetToken) => {
  const row = db.prepare("SELECT * FROM users WHERE resetToken = ?").get(resetToken);
  return row;
};

const createUser = (name, email, password, resetToken = null) => {
  const info = db.prepare(
    "INSERT INTO users (name, email, password, resetToken) VALUES (?, ?, ?, ?)"
  ).run(name, email, password, resetToken);
  return { id: info.lastInsertRowid, name, email, password, resetToken };
};

const updateUserResetToken = (id, resetToken) => {
  db.prepare("UPDATE users SET resetToken = ? WHERE id = ?").run(resetToken, id);
};

const defaultExport = { getUserByEmail, getUserById, getUserByResetToken, createUser, updateUserResetToken };

export default defaultExport;
export { getUserByEmail, getUserById, getUserByResetToken, createUser, updateUserResetToken };