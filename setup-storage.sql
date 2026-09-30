-- Run this ONCE in Supabase SQL Editor after the existing Dogs Trust schema.
-- It creates the photo bucket and storage policies only; it does not recreate your tables.

insert into storage.buckets (id, name, public)
values ('home-check-photos', 'home-check-photos', true)
on conflict (id) do nothing;

create policy "Authenticated users can upload home check photos"
on storage.objects for insert
to authenticated
with check (bucket_id = 'home-check-photos');

create policy "Authenticated users can view home check photos"
on storage.objects for select
to authenticated
using (bucket_id = 'home-check-photos');
