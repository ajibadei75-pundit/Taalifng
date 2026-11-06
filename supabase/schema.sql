-- Taalif NG | Supabase schema. Run once in the SQL editor of a DEDICATED Supabase project.
-- Tables, row-level security and grants for: profiles, roles, applications, counselling bookings, messages, saved resources, Course Match results.

create table public.profiles(
  id uuid primary key references auth.users on delete cascade,
  full_name text, phone text, created_at timestamptz not null default now());

create table public.user_roles(
  user_id uuid not null references auth.users on delete cascade,
  role text not null check (role in ('learner','tutor','counsellor','institution','sponsor','admin')),
  primary key (user_id, role));

create table public.applications(
  id bigint generated always as identity primary key,
  ref text not null unique,
  user_id uuid references auth.users on delete set null,
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 200),
  phone text check (char_length(phone) <= 40),
  applicant_type text, programme text not null,
  status text not null default 'Submitted' check (status in ('Submitted','Under review','Approved','Rejected','Waitlisted')),
  created_at timestamptz not null default now());

create table public.bookings(
  id bigint generated always as identity primary key,
  ref text not null unique,
  user_id uuid references auth.users on delete set null,
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 200),
  phone text check (char_length(phone) <= 40),
  type text, mode text, preferred_date date,
  message text check (char_length(message) <= 2000),
  status text not null default 'Requested' check (status in ('Requested','Confirmed','Completed')),
  created_at timestamptz not null default now());

create table public.messages(
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 200),
  role text, message text not null check (char_length(message) between 1 and 3000),
  created_at timestamptz not null default now());

create table public.saved_resources(
  user_id uuid not null references auth.users on delete cascade,
  resource_id text not null, primary key (user_id, resource_id));

create table public.match_results(
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users on delete cascade,
  top jsonb not null, created_at timestamptz not null default now());

create schema if not exists private;
grant usage on schema private to authenticated;
create or replace function private.has_role(r text) returns boolean
language sql stable security definer set search_path = public as
$$ select exists(select 1 from public.user_roles where user_id = auth.uid() and role = r) $$;
revoke execute on function private.has_role(text) from public, anon;
grant execute on function private.has_role(text) to authenticated;

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.applications enable row level security;
alter table public.bookings enable row level security;
alter table public.messages enable row level security;
alter table public.saved_resources enable row level security;
alter table public.match_results enable row level security;

create policy profiles_own on public.profiles for all to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy profiles_admin_read on public.profiles for select to authenticated using (private.has_role('admin'));

create policy roles_read on public.user_roles for select to authenticated using (user_id = auth.uid() or private.has_role('admin'));
create policy roles_admin_write on public.user_roles for all to authenticated using (private.has_role('admin')) with check (private.has_role('admin'));

create policy apps_insert on public.applications for insert to anon, authenticated
  with check (status = 'Submitted' and (user_id is null or user_id = auth.uid()));
create policy apps_read on public.applications for select to authenticated
  using (user_id = auth.uid() or lower(email) = lower(auth.jwt() ->> 'email') or private.has_role('admin'));
create policy apps_admin_update on public.applications for update to authenticated
  using (private.has_role('admin')) with check (private.has_role('admin'));

create policy book_insert on public.bookings for insert to anon, authenticated
  with check (status = 'Requested' and (user_id is null or user_id = auth.uid()));
create policy book_read on public.bookings for select to authenticated
  using (user_id = auth.uid() or lower(email) = lower(auth.jwt() ->> 'email') or private.has_role('admin') or private.has_role('counsellor'));
create policy book_staff_update on public.bookings for update to authenticated
  using (private.has_role('admin') or private.has_role('counsellor')) with check (private.has_role('admin') or private.has_role('counsellor'));

create policy msg_insert on public.messages for insert to anon, authenticated with check (true);
create policy msg_admin_read on public.messages for select to authenticated using (private.has_role('admin'));

create policy saved_own on public.saved_resources for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy match_own on public.match_results for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

grant insert on public.applications, public.bookings, public.messages to anon;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage on all sequences in schema public to anon, authenticated;

-- After you create your own account on the site, make yourself the first administrator:
-- insert into public.user_roles(user_id, role) select id, 'admin' from auth.users where email = 'YOUR_EMAIL_HERE';

-- ===== Programmes and events (admin-created, with seat counting) =====
create table public.events(
  id bigint generated always as identity primary key,
  slug text not null unique,
  title text not null check (char_length(title) between 3 and 160),
  description text check (char_length(description) <= 3000),
  audience text not null default 'Both' check (audience in ('Educators','Students','Both')),
  mode text not null default 'In person' check (mode in ('In person','Online','Hybrid')),
  location text, starts_at timestamptz,
  fee_ngn numeric(12,2) not null default 0 check (fee_ngn >= 0),
  sponsored boolean not null default false,
  capacity integer not null check (capacity > 0),
  registered integer not null default 0 check (registered >= 0),
  status text not null default 'open' check (status in ('draft','open','full','closed')),
  image_url text, payment_info text,
  fields jsonb not null default '[]'::jsonb,
  created_by uuid default auth.uid() references auth.users on delete set null,
  created_at timestamptz not null default now(),
  check (registered <= capacity));

create table public.registrations(
  id bigint generated always as identity primary key,
  event_id bigint not null references public.events on delete cascade,
  ref text not null unique,
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 200),
  phone text check (char_length(phone) <= 40),
  answers jsonb not null default '{}'::jsonb,
  payment_status text not null default 'pending' check (payment_status in ('free','pending','paid')),
  created_at timestamptz not null default now());
create unique index registrations_event_email on public.registrations(event_id, lower(email));
create index registrations_event on public.registrations(event_id);

alter table public.events enable row level security;
alter table public.registrations enable row level security;

create policy events_public_read on public.events for select to anon, authenticated using (status in ('open','full'));
create policy events_admin_all on public.events for all to authenticated using (private.has_role('admin')) with check (private.has_role('admin'));
create policy reg_insert on public.registrations for insert to anon, authenticated
  with check (exists (select 1 from public.events e where e.id = event_id and e.status = 'open'));
create policy reg_admin_all on public.registrations for all to authenticated using (private.has_role('admin')) with check (private.has_role('admin'));
create policy reg_own_read on public.registrations for select to authenticated using (lower(email) = lower(auth.jwt() ->> 'email'));

create or replace function public.registrations_guard() returns trigger
language plpgsql security definer set search_path = public as $$
declare e public.events%rowtype;
begin
  select * into e from public.events where id = new.event_id for update;
  if not found or e.status <> 'open' or e.registered >= e.capacity then
    raise exception 'This programme is fully booked or closed';
  end if;
  update public.events set registered = registered + 1,
    status = case when registered + 1 >= capacity then 'full' else status end
  where id = new.event_id;
  return new;
end $$;
create or replace function public.registrations_release() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  update public.events set registered = greatest(registered - 1, 0),
    status = case when status = 'full' then 'open' else status end
  where id = old.event_id;
  return old;
end $$;
revoke execute on function public.registrations_guard() from public, anon, authenticated;
revoke execute on function public.registrations_release() from public, anon, authenticated;
create trigger trg_reg_guard before insert on public.registrations for each row execute function public.registrations_guard();
create trigger trg_reg_release after delete on public.registrations for each row execute function public.registrations_release();

grant select on public.events to anon;
grant insert on public.registrations to anon;
grant select, insert, update, delete on public.events, public.registrations to authenticated;
grant usage on all sequences in schema public to anon, authenticated;
