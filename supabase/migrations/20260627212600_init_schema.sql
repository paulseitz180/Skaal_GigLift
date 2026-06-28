-- Migration: initial schema
--
-- Creates the core GigLift tables:
--   artists, shows, fans, campaigns, campaign_actions
--
-- Conventions:
--   * UUID primary keys (gen_random_uuid()).
--   * Foreign keys with ON DELETE CASCADE from children to parents.
--   * created_at timestamptz on every table.
--
-- Out of scope (intentionally excluded): analytics tables, seed data, and
-- row-level security policies.

-- ---------------------------------------------------------------------------
-- Enum types
-- ---------------------------------------------------------------------------

create type show_status as enum ('draft', 'active', 'complete');

create type campaign_status as enum ('building', 'review', 'approved', 'complete');

create type campaign_action_type as enum ('email', 'social_post', 'press_release');

create type campaign_action_status as enum ('scheduled', 'sent', 'failed', 'skipped');

-- ---------------------------------------------------------------------------
-- artists
-- ---------------------------------------------------------------------------

create table artists (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  bio text,
  genre_tags text[] not null default '{}',
  tone_keywords text[] not null default '{}',
  social_handles jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- shows
-- ---------------------------------------------------------------------------

create table shows (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid not null references artists (id) on delete cascade,
  name text,
  venue_name text,
  venue_address text,
  show_date date,
  doors_time time,
  show_time time,
  ticket_price numeric(10, 2),
  ticket_link text,
  opening_acts text[] not null default '{}',
  genre_vibe text,
  notes text,
  status show_status not null default 'draft',
  created_at timestamptz not null default now()
);

create index shows_artist_id_idx on shows (artist_id);

-- ---------------------------------------------------------------------------
-- fans
-- ---------------------------------------------------------------------------

create table fans (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid not null references artists (id) on delete cascade,
  email text not null,
  first_name text,
  location_city text,
  location_state text,
  signup_source text,
  tags text[] not null default '{}',
  engagement_score integer not null default 0,
  opted_out boolean not null default false,
  opted_out_at timestamptz,
  created_at timestamptz not null default now(),
  unique (artist_id, email)
);

create index fans_artist_id_idx on fans (artist_id);

-- ---------------------------------------------------------------------------
-- campaigns
-- ---------------------------------------------------------------------------

create table campaigns (
  id uuid primary key default gen_random_uuid(),
  show_id uuid not null references shows (id) on delete cascade,
  artist_id uuid not null references artists (id) on delete cascade,
  status campaign_status not null default 'building',
  email_drafts jsonb not null default '[]'::jsonb,
  social_drafts jsonb not null default '[]'::jsonb,
  press_release text,
  created_at timestamptz not null default now()
);

create index campaigns_show_id_idx on campaigns (show_id);

create index campaigns_artist_id_idx on campaigns (artist_id);

-- ---------------------------------------------------------------------------
-- campaign_actions
-- ---------------------------------------------------------------------------

create table campaign_actions (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references campaigns (id) on delete cascade,
  action_type campaign_action_type not null,
  platform text,
  scheduled_at timestamptz,
  sent_at timestamptz,
  status campaign_action_status not null default 'scheduled',
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index campaign_actions_campaign_id_idx on campaign_actions (campaign_id);
