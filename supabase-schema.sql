create table if not exists public.poppins_user_data (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  dataset_key text not null,
  payload jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (user_id, dataset_key),
  constraint poppins_user_data_dataset_key_check
    check (dataset_key in ('missions', 'projects', 'tags', 'writing_titles'))
);

alter table public.poppins_user_data enable row level security;

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.poppins_user_data to authenticated;

drop policy if exists "Users can read their own Poppins data" on public.poppins_user_data;
create policy "Users can read their own Poppins data"
on public.poppins_user_data
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert their own Poppins data" on public.poppins_user_data;
create policy "Users can insert their own Poppins data"
on public.poppins_user_data
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own Poppins data" on public.poppins_user_data;
create policy "Users can update their own Poppins data"
on public.poppins_user_data
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own Poppins data" on public.poppins_user_data;
create policy "Users can delete their own Poppins data"
on public.poppins_user_data
for delete
to authenticated
using (auth.uid() = user_id);
