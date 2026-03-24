import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'database.sqlite');
const db = new Database(dbPath, { verbose: console.log });

// Initialize database schema
export function initDB() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT,
      role TEXT DEFAULT 'user',
      enterprise_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS enterprises (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      status TEXT DEFAULT 'Active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      type TEXT NOT NULL, -- 'asset' or 'partner'
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS folders (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      parent_id TEXT,
      category_tag TEXT,
      enterprise_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (enterprise_id) REFERENCES enterprises(id)
    );

    CREATE TABLE IF NOT EXISTS assets (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      size TEXT NOT NULL,
      url TEXT NOT NULL,
      folder_id TEXT,
      enterprise_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (folder_id) REFERENCES folders(id),
      FOREIGN KEY (enterprise_id) REFERENCES enterprises(id)
    );

    CREATE TABLE IF NOT EXISTS partners (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      location TEXT,
      is_strategic BOOLEAN DEFAULT 0,
      email TEXT,
      phone TEXT,
      images TEXT, -- JSON array
      dimensions TEXT, -- JSON object
      docs TEXT, -- JSON array
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  
  // Add columns to assets if they don't exist (for partner documents)
  try {
    db.exec(`ALTER TABLE assets ADD COLUMN partner_id TEXT;`);
  } catch (e) { /* Ignore if exists */ }
  try {
    db.exec(`ALTER TABLE assets ADD COLUMN doc_category TEXT;`);
  } catch (e) { /* Ignore if exists */ }
  
  console.log('Database initialized successfully.');
}

export default db;
