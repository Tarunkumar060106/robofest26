-- Adds storage for the sticky top notification bar.
-- Safe to run multiple times.

insert into public.cms_content (key, value)
values ('top_notification', '{}'::jsonb)
on conflict (key) do nothing;
