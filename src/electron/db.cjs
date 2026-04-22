const Database = require('better-sqlite3');
const path = require('path');
const { app } = require('electron');

// In dev, store db in project root. In prod, store in userData.
const dbPath = process.env.NODE_ENV === 'development'
    ? path.join(__dirname, '../../tasks.db')
    : path.join(app.getPath('userData'), 'tasks.db');

console.log('Database path:', dbPath);

let db;
try {
    db = new Database(dbPath, { verbose: console.log });
    db.pragma('journal_mode = WAL');

    // Initialize Schema
    db.exec(`
      CREATE TABLE IF NOT EXISTS tasks (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          status TEXT DEFAULT 'pending',
          created_at TEXT,
          completed_at TEXT,
          importance INTEGER DEFAULT 5,
          urgency INTEGER DEFAULT 5,
          tags TEXT, -- JSON array
          target_date TEXT,
          push_history TEXT -- JSON array
      );
      
      CREATE TABLE IF NOT EXISTS settings (
          key TEXT PRIMARY KEY,
          value TEXT
      );
    `);
} catch (error) {
    console.error('Failed to initialize database:', error);
}

module.exports = { db };
