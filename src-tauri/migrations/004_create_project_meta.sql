CREATE TABLE IF NOT EXISTS project_meta (
  thread_id TEXT PRIMARY KEY,
  project_no TEXT,
  goal TEXT,
  target_date TEXT,
  milestone TEXT,
  success_criteria TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_project_meta_status ON project_meta(status);
CREATE INDEX IF NOT EXISTS idx_project_meta_target_date ON project_meta(target_date);
