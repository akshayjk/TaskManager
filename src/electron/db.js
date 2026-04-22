import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';
import { fileURLToPath } from 'url';

const __dirname_esm = path.dirname(fileURLToPath(import.meta.url));




let dbInstance = null;
let currentDbPath = null;

export function initDB(customPath) {
    // If a specific path is provided, use it.
    // Otherwise, default to Project Root (Dev) or UserData (Prod).
    let dbPath = customPath;

    if (!dbPath) {
        dbPath = process.env.NODE_ENV === 'development'
            ? path.join(__dirname_esm, '../../tasks.db')
            : path.join(app.getPath('userData'), 'tasks.db');
    }

    // Close existing connection if any
    if (dbInstance) {
        console.log('Closing existing database connection...');
        dbInstance.close();
    }

    console.log('Initializing database at:', dbPath);
    currentDbPath = dbPath;

    try {
        dbInstance = new Database(dbPath, { verbose: console.log });
        dbInstance.pragma('journal_mode = WAL');

        // Initialize Schema
        dbInstance.exec(`
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

        return true;
    } catch (error) {
        console.error('Failed to initialize database:', error);
        dbInstance = null;
        throw error;
    }
}

export function getDB() {
    if (!dbInstance) {
        throw new Error('Database not initialized. Call initDB() first.');
    }
    return dbInstance;
}

export function getCurrentDbPath() {
    return currentDbPath;
}

