CREATE TABLE IF NOT EXISTS monthly_reflections (
  month_key TEXT PRIMARY KEY,
  grew TEXT NOT NULL DEFAULT '',
  worked TEXT NOT NULL DEFAULT '',
  friction TEXT NOT NULL DEFAULT '',
  adjustment TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
