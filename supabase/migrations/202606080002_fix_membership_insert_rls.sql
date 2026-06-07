create or replace function public.class_is_joinable(target_class_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.classes
    where id = target_class_id
      and status = 'active'
  );
$$;

drop policy if exists "students join classes" on public.class_memberships;
create policy "students join classes"
on public.class_memberships
for insert
to authenticated
with check (
  public.is_admin()
  or (
    student_id = auth.uid()
    and public.class_is_joinable(class_memberships.class_id)
  )
);
