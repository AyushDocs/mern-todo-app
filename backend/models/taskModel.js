import Database from "better-sqlite3";

const db = new Database("todo.db");

const getTasksByUserId = (userId) => {
  const rows = db.prepare("SELECT * FROM tasks WHERE userId = ?").all(userId);
  return rows;
};

const getTaskById = (id) => {
  const row = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id);
  return row;
};

const createTask = (title, description, userId, completed = false) => {
  const completedInt = completed ? 1 : 0;
  const info = db.prepare(
    "INSERT INTO tasks (title, description, userId, completed) VALUES (?, ?, ?, ?)"
  ).run(title, description, userId, completedInt);
  return { id: info.lastInsertRowid, title, description, userId, completed, createdAt: new Date() };
};

const deleteTaskById = (id) => {
  db.prepare("DELETE FROM tasks WHERE id = ?").run(id);
};

const defaultExport = { getTasksByUserId, getTaskById, createTask, deleteTaskById };

export default defaultExport;
export { getTasksByUserId, getTaskById, createTask, deleteTaskById };