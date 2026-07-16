-- 20260714000008_admin_progress.sql
-- Admin visibility into student progress. lesson_progress is owner-only (RLS),
-- so staff read it through a SECURITY DEFINER RPC that gates on is_staff().

create or replace function public.admin_student_progress(p_user uuid)
returns table (
  course_id         uuid,
  course_title      text,
  course_slug       text,
  total_lessons     int,
  completed_lessons int,
  started_lessons   int,
  watched_pct_avg   int,
  last_activity     timestamptz,
  entitled          boolean,
  quizzes_passed    int,
  assignments_approved int
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_staff() then
    raise exception 'forbidden' using errcode = '42501';
  end if;

  return query
    with course_lessons as (
      select c.id as course_id, c.title, c.slug, l.id as lesson_id
      from courses c
      join modules m on m.course_id = c.id
      join lessons l on l.module_id = m.id
    )
    select
      cl.course_id,
      cl.title,
      cl.slug,
      count(cl.lesson_id)::int,
      count(lp.completed_at)::int,
      count(lp.user_id)::int,
      coalesce(round(avg(lp.watched_pct) filter (where lp.user_id is not null)), 0)::int,
      max(lp.updated_at),
      exists (
        select 1 from course_entitlements e
        where e.user_id = p_user and e.course_id = cl.course_id and e.revoked_at is null
      ),
      (
        select count(distinct qa.quiz_id)::int
        from quiz_attempts qa
        join quizzes q on q.id = qa.quiz_id
        join modules m2 on m2.id = q.module_id
        where qa.user_id = p_user and qa.passed and m2.course_id = cl.course_id
      ),
      (
        select count(*)::int
        from submissions s
        join assignments a on a.id = s.assignment_id
        where s.student_id = p_user and s.status = 'approved' and a.course_id = cl.course_id
      )
    from course_lessons cl
    left join lesson_progress lp on lp.lesson_id = cl.lesson_id and lp.user_id = p_user
    group by cl.course_id, cl.title, cl.slug
    having count(lp.user_id) > 0
        or exists (
          select 1 from course_entitlements e
          where e.user_id = p_user and e.course_id = cl.course_id and e.revoked_at is null
        )
    order by max(lp.updated_at) desc nulls last, cl.title;
end;
$$;

grant execute on function public.admin_student_progress(uuid) to authenticated;
