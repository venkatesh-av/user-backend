const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

let db;

const initializeDatabase = async () => {
  if (db) {
    return db;
  }

  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS User (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS Address (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      address TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES User(id)
    );
  `);

  return db;
};

const getDatabase = () => {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase first.');
  }
  return db;
};

module.exports = { initializeDatabase, getDatabase };