create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  role text check (role in ('student', 'teacher', 'admin')),
  status text not null default 'active' check (status in ('active', 'disabled')),
  avatar text not null default 'rainbow_guardian',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  class_name text not null,
  description text not null default '',
  class_code text not null unique,
  status text not null default 'active' check (status in ('active', 'archived')),
  created_at timestamptz not null default now()
);

create table if not exists public.class_memberships (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  class_id uuid not null references public.classes(id) on delete cascade,
  class_code text not null,
  joined_at timestamptz not null default now(),
  active boolean not null default true,
  unique (student_id, class_id)
);

create table if not exists public.story_chapters (
  id text primary key,
  number integer not null unique,
  title text not null,
  description text not null,
  story jsonb not null default '{}'::jsonb,
  tutorial jsonb not null default '{}'::jsonb,
  passing_score integer not null default 75,
  created_at timestamptz not null default now()
);

create table if not exists public.chapter_questions (
  id text primary key,
  chapter_id text not null references public.story_chapters(id) on delete cascade,
  position integer not null,
  question text not null,
  choices jsonb not null default '[]'::jsonb,
  answer text not null,
  feedback text not null,
  unique (chapter_id, position)
);

create table if not exists public.chapter_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  class_id uuid not null references public.classes(id) on delete cascade,
  class_code text not null,
  chapter_id text not null references public.story_chapters(id) on delete cascade,
  score integer not null default 0,
  total integer not null default 0,
  percentage integer not null default 0,
  passed boolean not null default false,
  answers jsonb not null default '[]'::jsonb,
  completed_at timestamptz not null default now(),
  attempts integer not null default 1,
  unique (student_id, class_id, chapter_id)
);

create table if not exists public.activity_results (
  id uuid primary key default gen_random_uuid(),
  progress_id uuid references public.chapter_progress(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  class_id uuid not null references public.classes(id) on delete cascade,
  class_code text not null,
  chapter_id text not null references public.story_chapters(id) on delete cascade,
  score integer not null default 0,
  total integer not null default 0,
  percentage integer not null default 0,
  passed boolean not null default false,
  answers jsonb not null default '[]'::jsonb,
  completed_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute procedure public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, email, role, avatar)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data ->> 'role',
    coalesce(new.raw_user_meta_data ->> 'avatar', 'rainbow_guardian')
  )
  on conflict (id) do update
  set
    full_name = excluded.full_name,
    email = excluded.email,
    avatar = excluded.avatar;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.is_teacher()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'teacher'
  );
$$;

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

create or replace function public.find_active_class_by_code(lookup_code text)
returns table (
  id uuid,
  teacher_id uuid,
  class_name text,
  description text,
  class_code text,
  status text,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select
    c.id,
    c.teacher_id,
    c.class_name,
    c.description,
    c.class_code,
    c.status,
    c.created_at
  from public.classes c
  where c.class_code = upper(trim(lookup_code))
    and c.status = 'active'
  limit 1;
$$;

alter table public.profiles enable row level security;
alter table public.classes enable row level security;
alter table public.class_memberships enable row level security;
alter table public.story_chapters enable row level security;
alter table public.chapter_questions enable row level security;
alter table public.chapter_progress enable row level security;
alter table public.activity_results enable row level security;

grant select, insert, update, delete on public.profiles to authenticated;
grant select on public.story_chapters to authenticated, anon;
grant select on public.chapter_questions to authenticated, anon;
grant select, insert, update, delete on public.classes to authenticated;
grant select, insert, update, delete on public.class_memberships to authenticated;
grant select, insert, update, delete on public.chapter_progress to authenticated;
grant select, insert, update, delete on public.activity_results to authenticated;
grant execute on function public.find_active_class_by_code(text) to authenticated;

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

create policy "profiles update self or admin"
on public.profiles
for update
to authenticated
using (id = auth.uid() or public.is_admin())
with check (id = auth.uid() or public.is_admin());

create policy "classes select by relation"
on public.classes
for select
to authenticated
using (
  public.is_admin()
  or teacher_id = auth.uid()
  or public.student_is_member_of_class(classes.id, auth.uid())
);

create policy "teachers insert classes"
on public.classes
for insert
to authenticated
with check (public.is_admin() or teacher_id = auth.uid());

create policy "teachers update classes"
on public.classes
for update
to authenticated
using (public.is_admin() or teacher_id = auth.uid())
with check (public.is_admin() or teacher_id = auth.uid());

create policy "teachers delete classes"
on public.classes
for delete
to authenticated
using (public.is_admin() or teacher_id = auth.uid());

create policy "memberships select by relation"
on public.class_memberships
for select
to authenticated
using (
  public.is_admin()
  or student_id = auth.uid()
  or public.teacher_owns_class(class_memberships.class_id, auth.uid())
);

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

create policy "memberships delete by relation"
on public.class_memberships
for delete
to authenticated
using (
  public.is_admin()
  or student_id = auth.uid()
  or public.teacher_owns_class(class_memberships.class_id, auth.uid())
);

create policy "chapters readable by everyone"
on public.story_chapters
for select
to authenticated, anon
using (true);

create policy "questions readable by everyone"
on public.chapter_questions
for select
to authenticated, anon
using (true);

create policy "progress select by relation"
on public.chapter_progress
for select
to authenticated
using (
  public.is_admin()
  or student_id = auth.uid()
  or public.teacher_owns_class(chapter_progress.class_id, auth.uid())
);

create policy "students manage own progress"
on public.chapter_progress
for all
to authenticated
using (public.is_admin() or student_id = auth.uid())
with check (public.is_admin() or student_id = auth.uid());

create policy "results select by relation"
on public.activity_results
for select
to authenticated
using (
  public.is_admin()
  or student_id = auth.uid()
  or public.teacher_owns_class(activity_results.class_id, auth.uid())
);

create policy "students manage own results"
on public.activity_results
for all
to authenticated
using (public.is_admin() or student_id = auth.uid())
with check (public.is_admin() or student_id = auth.uid());
