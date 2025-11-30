# /db/000-init.sql

-- Ensure the schema exists
create schema if not exists contractcoach;

-- Create core tables in the custom schema
-- Note: We are NOT using public. We do NOT need to expose this schema 
-- because all access is via the backend (Service Role) which bypasses RLS/exposure rules.

create table if not exists contractcoach.profiles (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  created_at timestamptz default now()
);

create table if not exists contractcoach.projects (
  id uuid primary key default gen_random_uuid(),
  owner uuid references contractcoach.profiles(id),
  title text,
  framework text,
  external_api text,
  created_at timestamptz default now()
);

create table if not exists contractcoach.messages (
  id uuid primary key default gen_random_uuid(),
  project_id text, -- Changed to text to support arbitrary project IDs from frontend/demo
  role text check (role in ('user','assistant','system')),
  content text,
  meta jsonb,
  created_at timestamptz default now()
);

create table if not exists contractcoach.jobs (
  id uuid primary key default gen_random_uuid(),
  project_id text, -- Changed to text to support arbitrary project IDs
  kind text,
  status text,
  payload jsonb,
  result jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes for performance
create index if not exists idx_messages_project_id on contractcoach.messages(project_id);
create index if not exists idx_jobs_project_id on contractcoach.jobs(project_id);
create index if not exists idx_jobs_status on contractcoach.jobs(status);
