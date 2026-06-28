CREATE TABLE IF NOT EXISTS daily_reviews (
  date_key TEXT PRIMARY KEY,
  win TEXT NOT NULL DEFAULT '',
  friction TEXT NOT NULL DEFAULT '',
  learned TEXT NOT NULL DEFAULT '',
  tomorrow TEXT NOT NULL DEFAULT '',
  energy TEXT NOT NULL DEFAULT 'normal',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
