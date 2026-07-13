-- 20260712000004_storage.sql
-- Storage buckets + policies. File path convention: "<user_id>/<filename>".

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true),
       ('post-images', 'post-images', true),
       ('submissions', 'submissions', false)
on conflict (id) do nothing;

-- avatars & post-images: public read, owner writes to own folder
create policy "public read avatars" on storage.objects for select
  using (bucket_id = 'avatars');
create policy "own write avatars" on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "own update avatars" on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "public read post images" on storage.objects for select
  using (bucket_id = 'post-images');
create policy "own write post images" on storage.objects for insert to authenticated
  with check (bucket_id = 'post-images' and (storage.foldername(name))[1] = auth.uid()::text);

-- submissions: private. student writes/reads own; staff reads all.
create policy "own read submissions" on storage.objects for select to authenticated
  using (bucket_id = 'submissions'
         and ((storage.foldername(name))[1] = auth.uid()::text or is_staff()));
create policy "own write submissions" on storage.objects for insert to authenticated
  with check (bucket_id = 'submissions' and (storage.foldername(name))[1] = auth.uid()::text);
