-- Wedding Save the Date — Supabase schema
-- Run in Supabase SQL Editor (or via migrations).

create extension if not exists "pgcrypto";

create table if not exists public.guests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null,
  phone text,
  plus_one boolean,
  created_at timestamptz not null default now()
);

comment on table public.guests is 'RSVP / invitation mailing list for Save the Date';

alter table public.guests enable row level security;

-- Public insert for unauthenticated guests (anon key from the app).
drop policy if exists "guests_insert_anon" on public.guests;
create policy "guests_insert_anon"
  on public.guests
  for insert
  to anon
  with check (true);

-- Optional: block reads from the client (invitation data stays private).
-- No SELECT policy for anon/authenticated means reads are denied by default.

grant usage on schema public to anon;
grant insert on table public.guests to anon;
