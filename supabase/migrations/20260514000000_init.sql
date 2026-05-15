-- Seal Logistics — initial schema
-- Run via Supabase CLI: `supabase db push` after `supabase link`.
-- All tables use service-role-only access. No RLS public read.

create extension if not exists "pgcrypto";

create table if not exists public.leads (
  id              uuid primary key default gen_random_uuid(),
  tracking_id     text not null unique,
  name            text not null,
  email           text not null,
  phone           text not null,
  "from"          text not null,
  "to"            text not null,
  weight          numeric,
  description     text,
  source_ip_hash  text,
  created_at      timestamptz not null default now()
);

create index if not exists leads_email_idx on public.leads (email);
create index if not exists leads_created_at_idx on public.leads (created_at desc);

create table if not exists public.shipments (
  id            uuid primary key default gen_random_uuid(),
  tracking_id   text not null unique,
  status        text not null check (status in ('received','in_transit','arrived','delivered')),
  lane_from     text not null,
  lane_to       text not null,
  weight        jsonb,
  eta           timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table if not exists public.shipment_events (
  id            uuid primary key default gen_random_uuid(),
  shipment_id   uuid not null references public.shipments(id) on delete cascade,
  at            timestamptz not null default now(),
  label         text not null,
  location      text
);

create index if not exists shipment_events_shipment_id_idx on public.shipment_events (shipment_id, at desc);

-- RLS: deny by default. Server uses service role; nothing client-side talks to these.
alter table public.leads enable row level security;
alter table public.shipments enable row level security;
alter table public.shipment_events enable row level security;

-- No public policies. All access goes through the Next route handlers using the
-- service-role key (server-only). Explicit deny by virtue of having RLS on with
-- no `for select to authenticated` policies.
