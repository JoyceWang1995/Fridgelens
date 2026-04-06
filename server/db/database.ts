import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = process.env.DB_PATH || path.join(__dirname, '../../fridgeAI.db');

export const db = new Database(dbPath);

// Initialize a simple key-value store to replicate localStorage simplicity while providing a database backend.
db.exec(`
  CREATE TABLE IF NOT EXISTS key_value_store (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

export function getValue(key: string) {
  const row = db.prepare('SELECT value FROM key_value_store WHERE key = ?').get(key) as { value: string } | undefined;
  return row ? JSON.parse(row.value) : null;
}

export function setValue(key: string, value: any) {
  db.prepare('INSERT OR REPLACE INTO key_value_store (key, value) VALUES (?, ?)').run(key, JSON.stringify(value));
}

export function clearAll() {
  db.prepare('DELETE FROM key_value_store').run();
}
