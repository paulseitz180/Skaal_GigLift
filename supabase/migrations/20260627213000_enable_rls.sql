-- Migration: enable row level security
--
-- Locks every core table behind per-user policies so that:
--   * Users may only access their own records.
--   * There is no anonymous access.
--   * There are no public reads.
--
-- All policies are scoped to the `authenticated` role. With RLS enabled and no
-- policies granted to `anon`/`public`, unauthenticated requests return nothing.
-- auth.uid() is wrapped in a sub-select so Postgres caches it per statement.

-- ---------------------------------------------------------------------------
-- Ownership linkage
--
-- An artist *is* a user: artists.id references auth.users.id. Child tables are
-- owned through artist_id; campaign_actions is owned through its parent
-- campaign. There is no data yet, so dropping the default is safe.
-- ---------------------------------------------------------------------------

alter table artists alter column id drop default;

alter table artists
  add constraint artists_id_fkey
  foreign key (id) references auth.users (id) on delete cascade;

-- ---------------------------------------------------------------------------
-- artists
-- ---------------------------------------------------------------------------

alter table artists enable row level security;

create policy "Artists can select own profile" on artists
  for select to authenticated
  using (id = (select auth.uid()));

create policy "Artists can insert own profile" on artists
  for insert to authenticated
  with check (id = (select auth.uid()));

create policy "Artists can update own profile" on artists
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

create policy "Artists can delete own profile" on artists
  for delete to authenticated
  using (id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- shows
-- ---------------------------------------------------------------------------

alter table shows enable row level security;

create policy "Shows are owned by artist" on shows
  for select to authenticated
  using (artist_id = (select auth.uid()));

create policy "Shows insert by artist" on shows
  for insert to authenticated
  with check (artist_id = (select auth.uid()));

create policy "Shows update by artist" on shows
  for update to authenticated
  using (artist_id = (select auth.uid()))
  with check (artist_id = (select auth.uid()));

create policy "Shows delete by artist" on shows
  for delete to authenticated
  using (artist_id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- fans
-- ---------------------------------------------------------------------------

alter table fans enable row level security;

create policy "Fans are owned by artist" on fans
  for select to authenticated
  using (artist_id = (select auth.uid()));

create policy "Fans insert by artist" on fans
  for insert to authenticated
  with check (artist_id = (select auth.uid()));

create policy "Fans update by artist" on fans
  for update to authenticated
  using (artist_id = (select auth.uid()))
  with check (artist_id = (select auth.uid()));

create policy "Fans delete by artist" on fans
  for delete to authenticated
  using (artist_id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- campaigns
-- ---------------------------------------------------------------------------

alter table campaigns enable row level security;

create policy "Campaigns are owned by artist" on campaigns
  for select to authenticated
  using (artist_id = (select auth.uid()));

create policy "Campaigns insert by artist" on campaigns
  for insert to authenticated
  with check (artist_id = (select auth.uid()));

create policy "Campaigns update by artist" on campaigns
  for update to authenticated
  using (artist_id = (select auth.uid()))
  with check (artist_id = (select auth.uid()));

create policy "Campaigns delete by artist" on campaigns
  for delete to authenticated
  using (artist_id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- campaign_actions (owned through the parent campaign)
-- ---------------------------------------------------------------------------

alter table campaign_actions enable row level security;

create policy "Campaign actions select via campaign" on campaign_actions
  for select to authenticated
  using (
    exists (
      select 1 from campaigns c
      where c.id = campaign_actions.campaign_id
        and c.artist_id = (select auth.uid())
    )
  );

create policy "Campaign actions insert via campaign" on campaign_actions
  for insert to authenticated
  with check (
    exists (
      select 1 from campaigns c
      where c.id = campaign_actions.campaign_id
        and c.artist_id = (select auth.uid())
    )
  );

create policy "Campaign actions update via campaign" on campaign_actions
  for update to authenticated
  using (
    exists (
      select 1 from campaigns c
      where c.id = campaign_actions.campaign_id
        and c.artist_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from campaigns c
      where c.id = campaign_actions.campaign_id
        and c.artist_id = (select auth.uid())
    )
  );

create policy "Campaign actions delete via campaign" on campaign_actions
  for delete to authenticated
  using (
    exists (
      select 1 from campaigns c
      where c.id = campaign_actions.campaign_id
        and c.artist_id = (select auth.uid())
    )
  );
