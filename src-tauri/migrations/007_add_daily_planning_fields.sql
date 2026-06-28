ALTER TABLE items ADD COLUMN context TEXT NOT NULL DEFAULT 'personal';
ALTER TABLE items ADD COLUMN time_block TEXT NOT NULL DEFAULT 'evening';
ALTER TABLE items ADD COLUMN daily_priority TEXT NOT NULL DEFAULT 'secondary';

CREATE INDEX IF NOT EXISTS idx_items_context ON items(context);
CREATE INDEX IF NOT EXISTS idx_items_time_block ON items(time_block);
CREATE INDEX IF NOT EXISTS idx_items_daily_priority ON items(daily_priority);
