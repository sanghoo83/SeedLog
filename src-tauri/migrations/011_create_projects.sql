CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  no TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  goal TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'active',
  target_date TEXT NOT NULL DEFAULT '',
  start_date TEXT NOT NULL DEFAULT '',
  source_idea_id TEXT NOT NULL DEFAULT '',
  milestones_json TEXT NOT NULL DEFAULT '[]',
  tasks_json TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL DEFAULT '',
  updated_at TEXT NOT NULL DEFAULT '',
  sort_order REAL NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_projects_sort ON projects(sort_order);
