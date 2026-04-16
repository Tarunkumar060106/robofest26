create table if not exists public.cms_content (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.cms_content enable row level security;

-- Public read can be useful for future direct client-side reads.
do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'cms_content'
      and policyname = 'cms_content_public_read'
  ) then
    create policy cms_content_public_read
      on public.cms_content
      for select
      to anon, authenticated
      using (true);
  end if;
end $$;

insert into public.cms_content (key, value)
values
  ('site_settings', '{}'::jsonb),
  ('events', '[]'::jsonb),
  ('faqs', '[]'::jsonb),
  ('sponsors', '{}'::jsonb),
  ('rules', '{}'::jsonb)
on conflict (key) do nothing;
