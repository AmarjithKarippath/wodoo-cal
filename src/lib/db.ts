import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

export type WaitlistEntry = {
  id: number;
  email: string;
  name: string | null;
  created_at: string;
  user_agent: string | null;
  referrer: string | null;
};

const dataDir = path.join(process.cwd(), "data");
const dbPath = path.join(dataDir, "waitlist.db");

let db: Database.Database | null = null;

function getDb() {
  if (db) return db;

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS waitlist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE COLLATE NOCASE,
      name TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      user_agent TEXT,
      referrer TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at DESC);
  `);

  return db;
}

export function addWaitlistEntry(input: {
  email: string;
  name?: string | null;
  userAgent?: string | null;
  referrer?: string | null;
}): WaitlistEntry {
  const database = getDb();
  const result = database
    .prepare(
      `INSERT INTO waitlist (email, name, user_agent, referrer)
       VALUES (@email, @name, @user_agent, @referrer)`,
    )
    .run({
      email: input.email.trim().toLowerCase(),
      name: input.name?.trim() || null,
      user_agent: input.userAgent || null,
      referrer: input.referrer || null,
    });

  return database
    .prepare(`SELECT * FROM waitlist WHERE id = ?`)
    .get(result.lastInsertRowid) as WaitlistEntry;
}

export function getWaitlistEntries(): WaitlistEntry[] {
  return getDb()
    .prepare(`SELECT * FROM waitlist ORDER BY datetime(created_at) DESC`)
    .all() as WaitlistEntry[];
}

export function getWaitlistCount(): number {
  const row = getDb()
    .prepare(`SELECT COUNT(*) as count FROM waitlist`)
    .get() as { count: number };
  return row.count;
}

export function emailExists(email: string): boolean {
  const row = getDb()
    .prepare(`SELECT 1 as found FROM waitlist WHERE email = ? COLLATE NOCASE`)
    .get(email.trim().toLowerCase()) as { found: number } | undefined;
  return Boolean(row?.found);
}
