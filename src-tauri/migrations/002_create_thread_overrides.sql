CREATE TABLE IF NOT EXISTS thread_overrides (
  thread_id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
