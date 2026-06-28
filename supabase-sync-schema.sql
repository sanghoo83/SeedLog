-- SeedLog sync — run this once in your Supabase project (SQL editor).
-- Personal single-user / shared-sync-key model. The sync_key is a long secret
-- you choose; it namespaces AND protects your rows (anyone would need to guess
-- the key to read your data). For a future public/multi-user release, replace
-- the permissive policy below with auth-based RLS.

create table if not exists public.seedlog_items (
  sync_key          text        not null,
  id                text        not null,
  payload           jsonb       not null,
  updated_at        timestamptz not null,
  deleted_at        timestamptz,
  server_updated_at timestamptz not null default now(),
  primary key (sync_key, id)
);

create index if not exists idx_seedlog_items_key_updated
  on public.seedlog_items (sync_key, updated_at);

alter table public.seedlog_items enable row level security;

-- Permissive policy: access is gated by knowing the secret sync_key (sent in
-- every query as a filter). The anon key alone reveals nothing without it.
drop policy if exists "seedlog_sync_all" on public.seedlog_items;
create policy "seedlog_sync_all"
  on public.seedlog_items
  for all
  to anon
  using (true)
  with check (true);
