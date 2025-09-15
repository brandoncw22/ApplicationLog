/**
 * Database connection and bootstrap for the Job Tracker backend.
 *
 * This module opens a single SQLite connection (file-backed at ./dev.db) using
 * the async `sqlite` wrapper for convenient Promise-based queries across the
 * app. On first import, it enables foreign key enforcement and creates the
 * required tables if they do not already exist. The exported `db` handle is
 * reused by route modules (auth, jobs) for reads and writes.
 */
import sqlite3 from "sqlite3"; // Node SQLite driver (C/C++ binding)
import { open } from "sqlite";  // Lightweight async wrapper around sqlite3

// Open a connection (top-level await ensures DB is ready before server starts)
export const db = await open({
  filename: "./dev.db", // stored in project/server working dir
  driver: sqlite3.Database,
});

// Initialize schema idempotently. Safe to execute on every startup.
await db.exec(`
PRAGMA foreign_keys = ON; -- enforce FK constraints for referential integrity

-- Minimal users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,     -- used for auth; must be unique
  username TEXT UNIQUE NOT NULL, -- used for login
  password TEXT NOT NULL          -- stores bcrypt hash
);

-- Jobs table; each job belongs to a user
CREATE TABLE IF NOT EXISTS jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,       -- FK -> users.id
  title TEXT NOT NULL,            -- job title
  company TEXT,                   -- optional company name
  status TEXT DEFAULT 'applied',  -- basic status lifecycle
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`);
