ALTER TABLE items ADD COLUMN lane TEXT NOT NULL DEFAULT 'next';
ALTER TABLE items ADD COLUMN importance TEXT NOT NULL DEFAULT 'normal';
ALTER TABLE items ADD COLUMN momentum TEXT NOT NULL DEFAULT 'seed';

CREATE INDEX IF NOT EXISTS idx_items_lane ON items(lane);
CREATE INDEX IF NOT EXISTS idx_items_importance ON items(importance);
CREATE INDEX IF NOT EXISTS idx_items_momentum ON items(momentum);
