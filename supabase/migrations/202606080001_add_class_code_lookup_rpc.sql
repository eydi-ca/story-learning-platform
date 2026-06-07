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

grant execute on function public.find_active_class_by_code(text) to authenticated;
