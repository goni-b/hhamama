-- 20260713000006_lesson_content.sql
-- Course-area upgrade: rich lesson content.
-- 1) lessons.description — the editable text shown under the video in the player.
-- 2) 'materials' bucket — staff-uploaded lesson attachments (public read, per canon §Dict).

alter table lessons add column if not exists description text;

insert into storage.buckets (id, name, public)
values ('materials', 'materials', true)
on conflict (id) do nothing;

-- public read (objects served via public URL), staff-only writes
create policy "public read materials" on storage.objects for select
  using (bucket_id = 'materials');
create policy "staff write materials" on storage.objects for insert to authenticated
  with check (bucket_id = 'materials' and is_staff());
create policy "staff update materials" on storage.objects for update to authenticated
  using (bucket_id = 'materials' and is_staff());
create policy "staff delete materials" on storage.objects for delete to authenticated
  using (bucket_id = 'materials' and is_staff());
