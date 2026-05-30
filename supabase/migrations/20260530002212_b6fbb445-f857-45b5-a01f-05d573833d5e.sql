-- ============ ROLES ============
create type public.app_role as enum ('admin', 'user');

-- ============ PROFILES ============
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  phone text,
  credits integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select, insert, update, delete on public.profiles to authenticated;
grant all on public.profiles to service_role;

alter table public.profiles enable row level security;

-- ============ USER ROLES ============
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null,
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

alter table public.user_roles enable row level security;

-- ============ has_role (security definer) ============
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

-- ============ updated_at helper ============
create or replace function public.update_updated_at_column()
returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger update_profiles_updated_at
before update on public.profiles
for each row execute function public.update_updated_at_column();

-- ============ prevent credit tampering (only service role may change credits) ============
create or replace function public.prevent_credit_tampering()
returns trigger language plpgsql set search_path = public as $$
begin
  if new.credits is distinct from old.credits then
    if current_user not in ('service_role', 'postgres', 'supabase_admin') then
      new.credits := old.credits;
    end if;
  end if;
  return new;
end;
$$;

create trigger guard_profile_credits
before update on public.profiles
for each row execute function public.prevent_credit_tampering();

-- ============ new user handler ============
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, phone)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone'
  )
  on conflict (id) do nothing;

  insert into public.user_roles (user_id, role)
  values (new.id, 'user')
  on conflict (user_id, role) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ============ PROFILES policies ============
create policy "Users can view their own profile"
on public.profiles for select to authenticated
using (auth.uid() = id);

create policy "Admins can view all profiles"
on public.profiles for select to authenticated
using (public.has_role(auth.uid(), 'admin'));

create policy "Users can update their own profile"
on public.profiles for update to authenticated
using (auth.uid() = id);

-- ============ USER ROLES policies ============
create policy "Users can view their own roles"
on public.user_roles for select to authenticated
using (auth.uid() = user_id);

create policy "Admins can view all roles"
on public.user_roles for select to authenticated
using (public.has_role(auth.uid(), 'admin'));

-- ============ CREDIT PACKAGES ============
create table public.credit_packages (
  id text primary key,
  credits integer not null,
  bonus integer not null default 0,
  price numeric not null,
  discount numeric not null default 0,
  checkout_url text,
  highlight text,
  tag text,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select on public.credit_packages to anon, authenticated;
grant all on public.credit_packages to service_role;

alter table public.credit_packages enable row level security;

create policy "Active packages are viewable by everyone"
on public.credit_packages for select
using (active = true);

create policy "Admins can view all packages"
on public.credit_packages for select to authenticated
using (public.has_role(auth.uid(), 'admin'));

create trigger update_credit_packages_updated_at
before update on public.credit_packages
for each row execute function public.update_updated_at_column();

-- ============ PAYMENT ORDERS (credit purchases) ============
create table public.payment_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  package_id text references public.credit_packages(id),
  amount numeric not null default 0,
  credits integer not null default 0,
  bonus integer not null default 0,
  status text not null default 'pending',
  provider text not null default 'cakto',
  provider_ref text,
  receipt_url text,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

grant select, insert on public.payment_orders to authenticated;
grant all on public.payment_orders to service_role;

alter table public.payment_orders enable row level security;

create policy "Users can view their own orders"
on public.payment_orders for select to authenticated
using (auth.uid() = user_id);

create policy "Admins can view all orders"
on public.payment_orders for select to authenticated
using (public.has_role(auth.uid(), 'admin'));

create policy "Users can create their own orders"
on public.payment_orders for insert to authenticated
with check (auth.uid() = user_id);

create index idx_payment_orders_user on public.payment_orders(user_id);
create index idx_payment_orders_status on public.payment_orders(status);