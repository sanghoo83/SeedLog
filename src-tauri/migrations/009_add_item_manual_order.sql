ALTER TABLE items ADD COLUMN manual_order REAL NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_items_manual_order ON items(manual_order);
