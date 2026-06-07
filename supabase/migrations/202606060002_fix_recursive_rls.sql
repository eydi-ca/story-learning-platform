create or replace function public.teacher_owns_class(target_class_id uuid, target_teacher_id uuid default auth.uid())
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
      and teacher_id = target_teacher_id
  );
$$;

create or replace function public.student_is_member_of_class(target_class_id uuid, target_student_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.class_memberships
    where class_id = target_class_id
      and student_id = target_student_id
      and active = true
  );
$$;

create or replace function public.teacher_has_student(target_teacher_id uuid, target_student_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.classes c
    join public.class_memberships m on m.class_id = c.id
    where c.teacher_id = target_teacher_id
      and m.student_id = target_student_id
      and m.active = true
  );
$$;

drop policy if exists "profiles select self teacher admin" on public.profiles;
create policy "profiles select self teacher admin"
on public.profiles
for select
to authenticated
using (
  id = auth.uid()
  or public.is_admin()
  or (
    public.is_teacher()
    and public.teacher_has_student(auth.uid(), profiles.id)
  )
);

drop policy if exists "classes select by relation" on public.classes;
create policy "classes select by relation"
on public.classes
for select
to authenticated
using (
  public.is_admin()
  or teacher_id = auth.uid()
  or public.student_is_member_of_class(classes.id, auth.uid())
);

drop policy if exists "memberships select by relation" on public.class_memberships;
create policy "memberships select by relation"
on public.class_memberships
for select
to authenticated
using (
  public.is_admin()
  or student_id = auth.uid()
  or public.teacher_owns_class(class_memberships.class_id, auth.uid())
);

drop policy if exists "students join classes" on public.class_memberships;
create policy "students join classes"
on public.class_memberships
for insert
to authenticated
with check (
  public.is_admin()
  or (
    student_id = auth.uid()
    and exists (
      select 1
      from public.classes c
      where c.id = class_memberships.class_id
        and c.status = 'active'
    )
  )
);

drop policy if exists "memberships delete by relation" on public.class_memberships;
create policy "memberships delete by relation"
on public.class_memberships
for delete
to authenticated
using (
  public.is_admin()
  or student_id = auth.uid()
  or public.teacher_owns_class(class_memberships.class_id, auth.uid())
);

drop policy if exists "progress select by relation" on public.chapter_progress;
create policy "progress select by relation"
on public.chapter_progress
for select
to authenticated
using (
  public.is_admin()
  or student_id = auth.uid()
  or public.teacher_owns_class(chapter_progress.class_id, auth.uid())
);

drop policy if exists "results select by relation" on public.activity_results;
create policy "results select by relation"
on public.activity_results
for select
to authenticated
using (
  public.is_admin()
  or student_id = auth.uid()
  or public.teacher_owns_class(activity_results.class_id, auth.uid())
);
