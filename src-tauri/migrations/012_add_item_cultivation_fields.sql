ALTER TABLE items ADD COLUMN pipeline INTEGER NOT NULL DEFAULT 0;
ALTER TABLE items ADD COLUMN lane_moved_at TEXT;
ALTER TABLE items ADD COLUMN last_forward_at TEXT;

CREATE INDEX IF NOT EXISTS idx_items_pipeline ON items(pipeline);
