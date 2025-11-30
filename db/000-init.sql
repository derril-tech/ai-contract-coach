# /db/000-init.sql

create schema if not exists contractcoach;

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
  project_id uuid references contractcoach.projects(id),
  role text check (role in ('user','assistant','system')),
  content text,
  meta jsonb,
  created_at timestamptz default now()
);

create table if not exists contractcoach.jobs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references contractcoach.projects(id),
  kind text,
  status text,
  payload jsonb,
  result jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
