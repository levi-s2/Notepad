import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDirectory = path.resolve(__dirname, "../data");
const databasePath = path.join(dataDirectory, "notepad.db");
const schemaPath = path.join(__dirname, "schema.sql");

fs.mkdirSync(dataDirectory, { recursive: true });

const db = new Database(databasePath);

db.pragma("journal_mode = WAL");

const schema = fs.readFileSync(schemaPath, "utf8");

db.exec(schema);

try {
  db.exec(`
    ALTER TABLE tasks
    ADD COLUMN position INTEGER NOT NULL DEFAULT 0
  `);
} catch (error) {
  if (!error.message.includes("duplicate column name")) {
    throw error;
  }
}

export default db;