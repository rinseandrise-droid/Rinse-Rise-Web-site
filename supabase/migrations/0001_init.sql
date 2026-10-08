-- Rinse & Rise — customer accounts, addresses, orders.
-- Run in the Supabase SQL editor (or `supabase db push`).
-- Prices are NOT stored as a catalogue here: the rate card in the app is the source of
-- truth, and the order API snapshots item names/rates onto order_items at booking time.

create extension if not exists "pgcrypto";

-- ───────────── Profiles ─────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  phone text not null default '',
  email text not null default '',
  first_order_discount_used boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'phone', ''),
    coalesce(new.email, '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ───────────── Addresses ─────────────
create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  label text not null check (label in ('Home', 'Work', 'Other')),
  name text not null,
  phone text not null,
  line1 text not null,
  area text not null default '',
  city text not null,
  state text not null,
  pincode text not null check (pincode ~ '^[0-9]{6}$'),
  landmark text not null default '',
  instructions text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists addresses_user_idx on public.addresses (user_id);

-- ───────────── Coupons (admin-ready) ─────────────
create table if not exists public.coupons (
  code text primary key,
  percent numeric(5, 2) not null check (percent > 0 and percent <= 100),
  first_order_only boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
insert into public.coupons (code, percent, first_order_only)
values ('FIRST25', 25, true)
on conflict (code) do nothing;

-- ───────────── Orders ─────────────
create sequence if not exists public.order_number_seq start 1001;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default ('RR' || nextval('public.order_number_seq')),
  user_id uuid not null references auth.users (id) on delete cascade,
  status text not null default 'pickup_scheduled',
  address jsonb not null,
  pickup_date date not null,
  pickup_slot text not null,
  notes text not null default '',
  subtotal numeric(10, 2) not null,
  discount numeric(10, 2) not null default 0,
  coupon_code text,
  charges numeric(10, 2) not null default 0,
  tax numeric(10, 2) not null default 0,
  total numeric(10, 2) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists orders_user_idx on public.orders (user_id, created_at desc);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  item_id text not null,
  service_id text not null,
  group_name text not null,
  name text not null,
  unit text not null,
  rate numeric(10, 2) not null,
  quantity numeric(10, 2) not null check (quantity > 0),
  line_total numeric(10, 2) not null
);
create index if not exists order_items_order_idx on public.order_items (order_id);

create table if not exists public.order_status_events (
  id bigserial primary key,
  order_id uuid not null references public.orders (id) on delete cascade,
  status text not null,
  created_at timestamptz not null default now()
);
create index if not exists order_status_events_order_idx on public.order_status_events (order_id);

-- ───────────── Row level security ─────────────
alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.coupons enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_status_events enable row level security;

-- Profiles: read + update own row, but never the discount flag.
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

revoke update on public.profiles from authenticated;
grant update (full_name, phone, updated_at) on public.profiles to authenticated;

-- Addresses: full control of own rows.
drop policy if exists "addresses_own" on public.addresses;
create policy "addresses_own" on public.addresses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Orders: customers can read their own. Inserts/updates happen only through the
-- server (service role) after prices and discounts are recalculated.
drop policy if exists "orders_select_own" on public.orders;
create policy "orders_select_own" on public.orders
  for select using (auth.uid() = user_id);

drop policy if exists "order_items_select_own" on public.order_items;
create policy "order_items_select_own" on public.order_items
  for select using (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );

drop policy if exists "order_events_select_own" on public.order_status_events;
create policy "order_events_select_own" on public.order_status_events
  for select using (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );

-- Coupons are read server-side only (no public policy).

-- ───────────── Atomic first-order discount claim ─────────────
-- Returns true exactly once per customer, so the 25% offer cannot be applied twice
-- even if two bookings are submitted at the same moment.
create or replace function public.claim_first_order_discount(p_user uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  claimed boolean;
begin
  update public.profiles
     set first_order_discount_used = true, updated_at = now()
   where id = p_user
     and first_order_discount_used = false
     and not exists (
       select 1 from public.orders o
        where o.user_id = p_user and o.status <> 'cancelled'
     )
  returning true into claimed;
  return coalesce(claimed, false);
end;
$$;

create or replace function public.release_first_order_discount(p_user uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.profiles
     set first_order_discount_used = false, updated_at = now()
   where id = p_user
     and not exists (
       select 1 from public.orders o
        where o.user_id = p_user and o.status <> 'cancelled' and o.discount > 0
     );
$$;

revoke all on function public.claim_first_order_discount(uuid) from public, anon, authenticated;
revoke all on function public.release_first_order_discount(uuid) from public, anon, authenticated;
