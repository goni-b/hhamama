-- 20260712000002_functions.sql
-- Server-side logic: derived stage, role helpers, XP ledger trigger,
-- new-user provisioning, and the atomic RPCs the DataClient calls.

-- ---------- XP → growth stage (mirrors GROWTH_TIERS in types.ts) ----------
create or replace function xp_to_stage(xp integer)
returns growth_stage
language sql immutable
as $$
  select case
    when xp >= 10000 then 'grower'
    when xp >= 4500  then 'tree'
    when xp >= 1800  then 'blooming'
    when xp >= 600   then 'sapling'
    when xp >= 150   then 'sprout'
    else 'seed'
  end::growth_stage;
$$;

-- ---------- role helpers (used by RLS) ----------
create or replace function auth_role()
returns role
language sql stable security definer set search_path = public
as $$ select role from profiles where id = auth.uid() $$;

create or replace function is_staff()
returns boolean
language sql stable security definer set search_path = public
as $$ select coalesce(auth_role() in ('super-admin','mentor'), false) $$;

create or replace function is_super_admin()
returns boolean
language sql stable security definer set search_path = public
as $$ select coalesce(auth_role() = 'super-admin', false) $$;

-- ---------- keep profiles.xp_total + growth_stage in sync with the ledger ----------
create or replace function apply_xp_event()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  before_stage growth_stage;
  after_total  integer;
  after_stage  growth_stage;
begin
  select growth_stage, xp_total + new.points
    into before_stage, after_total
    from profiles where id = new.user_id for update;

  after_stage := xp_to_stage(after_total);

  update profiles
     set xp_total = after_total,
         growth_stage = after_stage
   where id = new.user_id;

  if after_stage is distinct from before_stage then
    insert into notifications (user_id, kind, title, body, href)
    values (new.user_id, 'level_up', 'עלית דרגה!',
            'הגעת לדרגת ' || after_stage::text, '/achievements');
  end if;
  return new;
end;
$$;

create trigger trg_apply_xp_event
  after insert on xp_events
  for each row execute function apply_xp_event();

-- ---------- provision a profile on signup ----------
create or replace function handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  uname text;
  fname text;
begin
  fname := coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1));
  uname := coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1));
  -- guarantee uniqueness
  if exists (select 1 from profiles where username = uname) then
    uname := uname || '-' || substr(new.id::text, 1, 6);
  end if;

  insert into profiles (id, full_name, username, email, role,
                        weekly_goal_minutes, onboarding_completed, must_reset_password)
  values (
    new.id, fname, uname, new.email,
    coalesce((new.raw_user_meta_data->>'role')::role, 'student'),
    coalesce((new.raw_user_meta_data->>'weekly_goal_minutes')::int, 90),
    coalesce((new.raw_user_meta_data->>'onboarding_completed')::boolean, false),
    coalesce((new.raw_user_meta_data->>'must_reset_password')::boolean, false)
  );

  insert into account_preferences (user_id) values (new.id);
  insert into subscriptions (user_id, current_period_end)
  values (new.id, now() + interval '30 days');
  return new;
end;
$$;

create trigger trg_handle_new_user
  after insert on auth.users
  for each row execute function handle_new_user();

-- ---------- streak computation from activity_days ----------
create or replace function record_activity(uid uuid)
returns void
language plpgsql security definer set search_path = public
as $$
declare
  d date;
  run int := 0;
  best int := 0;
  cur int := 0;
  prev date := null;
  in_current boolean := false;
  today date := current_date;
begin
  insert into activity_days (user_id, activity_date)
  values (uid, today) on conflict do nothing;

  -- scan dates newest→oldest: `best` = longest run, `cur` = run touching today/yesterday
  for d in select activity_date from activity_days
           where user_id = uid order by activity_date desc
  loop
    if prev is null then
      run := 1;
      in_current := (today - d) <= 1;
      if in_current then cur := 1; end if;
    elsif prev - d = 1 then
      run := run + 1;
      if in_current then cur := run; end if;
    else
      run := 1;
      in_current := false;  -- a gap ends the current streak
    end if;
    if run > best then best := run; end if;
    prev := d;
  end loop;

  update profiles
     set streak_days = cur,
         streak_best = greatest(streak_best, best, cur)
   where id = uid;
end;
$$;

-- ---------- award XP (respects xp_rules.daily_cap) ----------
create or replace function award_xp(p_event xp_event_type, p_ref text default null)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  uid uuid := auth.uid();
  pts int;
  cap int;
  spent_today int;
  before_stage growth_stage;
  after_total int;
  after_stage growth_stage;
begin
  if uid is null then raise exception 'unauthorized'; end if;
  select points, daily_cap into pts, cap from xp_rules where event_type = p_event;
  pts := coalesce(pts, 0);

  if cap is not null then
    select coalesce(sum(points),0) into spent_today
      from xp_events
     where user_id = uid and event_type = p_event
       and created_at >= date_trunc('day', now());
    pts := least(pts, greatest(0, cap - spent_today));
  end if;

  select growth_stage into before_stage from profiles where id = uid;
  if pts > 0 then
    insert into xp_events (user_id, event_type, points, ref_id)
    values (uid, p_event, pts, p_ref);
  end if;
  perform record_activity(uid);

  select xp_total, growth_stage into after_total, after_stage from profiles where id = uid;
  return jsonb_build_object(
    'xpTotal', after_total,
    'leveledUpTo', case when after_stage is distinct from before_stage
                        then after_stage::text else null end
  );
end;
$$;

-- ---------- mark a lesson complete (idempotent XP) ----------
create or replace function mark_lesson_complete(p_lesson uuid)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  uid uuid := auth.uid();
  already boolean;
  next_lesson uuid;
  awarded int := 0;
begin
  if uid is null then raise exception 'unauthorized'; end if;

  select completed_at is not null into already
    from lesson_progress where user_id = uid and lesson_id = p_lesson;

  insert into lesson_progress (user_id, lesson_id, watched_pct, completed_at, updated_at)
  values (uid, p_lesson, 100, now(), now())
  on conflict (user_id, lesson_id) do update
    set watched_pct = 100,
        completed_at = coalesce(lesson_progress.completed_at, now()),
        updated_at = now();

  if not coalesce(already, false) then
    perform award_xp('lesson_complete', p_lesson::text);
    select points into awarded from xp_rules where event_type = 'lesson_complete';
  end if;

  -- next lesson in the course's flat order
  select l.id into next_lesson
  from lessons l
  join modules m on m.id = l.module_id
  where m.course_id = (
        select m2.course_id from lessons l2 join modules m2 on m2.id = l2.module_id
        where l2.id = p_lesson)
    and (m.order_index, l.order_index) > (
        select m2.order_index, l2.order_index
        from lessons l2 join modules m2 on m2.id = l2.module_id where l2.id = p_lesson)
  order by m.order_index, l.order_index
  limit 1;

  return jsonb_build_object(
    'xpAwarded', coalesce(awarded, 0),
    'unlockedLessonId', next_lesson
  );
end;
$$;

-- ---------- save video position ----------
create or replace function save_lesson_position(p_lesson uuid, p_position int)
returns void
language plpgsql security definer set search_path = public
as $$
declare
  uid uuid := auth.uid();
  dur int;
  pct int;
begin
  if uid is null then raise exception 'unauthorized'; end if;
  select duration_sec into dur from lessons where id = p_lesson;
  pct := least(100, case when coalesce(dur,0) > 0
                         then round(p_position::numeric / dur * 100) else 0 end);
  insert into lesson_progress (user_id, lesson_id, position_sec, watched_pct, completed_at, updated_at)
  values (uid, p_lesson, p_position, pct,
          case when pct >= 90 then now() else null end, now())
  on conflict (user_id, lesson_id) do update
    set position_sec = p_position,
        watched_pct = greatest(lesson_progress.watched_pct, pct),
        completed_at = coalesce(lesson_progress.completed_at,
                                case when pct >= 90 then now() else null end),
        updated_at = now();
end;
$$;

-- ---------- toggle a reaction ----------
create or replace function toggle_reaction(p_post uuid, p_kind reaction_kind)
returns void
language plpgsql security definer set search_path = public
as $$
declare uid uuid := auth.uid();
begin
  if uid is null then raise exception 'unauthorized'; end if;
  if exists (select 1 from post_reactions
             where post_id = p_post and user_id = uid and kind = p_kind) then
    delete from post_reactions
     where post_id = p_post and user_id = uid and kind = p_kind;
  else
    insert into post_reactions (post_id, user_id, kind) values (p_post, uid, p_kind);
    -- reward the author (reaction_received)
    perform 1;
  end if;
end;
$$;

-- ---------- grade a quiz server-side (never ships correct answers) ----------
create or replace function submit_quiz(p_quiz uuid, p_answers jsonb)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  uid uuid := auth.uid();
  total int;
  correct int := 0;
  v_pass int;
  score int;
  passed boolean;
  perfect boolean;
  correct_map jsonb := '{}'::jsonb;
  q record;
  chosen text;
  right_opt uuid;
begin
  if uid is null then raise exception 'unauthorized'; end if;
  select pass_score into v_pass from quizzes where id = p_quiz;
  select count(*) into total from quiz_questions where quiz_id = p_quiz;

  for q in select id from quiz_questions where quiz_id = p_quiz loop
    select id into right_opt from quiz_options
     where question_id = q.id and is_correct limit 1;
    correct_map := correct_map || jsonb_build_object(q.id::text, right_opt::text);
    chosen := p_answers->>q.id::text;
    if chosen is not null and chosen = right_opt::text then
      correct := correct + 1;
    end if;
  end loop;

  score := case when total > 0 then round(correct::numeric / total * 100) else 0 end;
  passed := score >= coalesce(v_pass, 70);
  perfect := total > 0 and correct = total;

  insert into quiz_attempts (user_id, quiz_id, score, passed, perfect)
  values (uid, p_quiz, score, passed, perfect);

  if passed then perform award_xp('quiz_pass', p_quiz::text); end if;
  if perfect then perform award_xp('quiz_perfect', p_quiz::text); end if;

  return jsonb_build_object(
    'score', score, 'passed', passed, 'perfect', perfect,
    'xpAwarded', 0, 'correctByQuestion', correct_map
  );
end;
$$;

-- ---------- leaderboard ----------
create or replace function get_leaderboard(p_period text default 'all')
returns table (
  rank bigint, user_id uuid, full_name text, username text,
  avatar_url text, growth_stage growth_stage, xp integer, is_current_user boolean
)
language sql stable security definer set search_path = public
as $$
  with scoped as (
    select p.id, p.full_name, p.username, p.avatar_url, p.growth_stage,
      case p_period
        when 'all' then p.xp_total
        else coalesce((
          select sum(e.points)::int from xp_events e
          where e.user_id = p.id
            and e.created_at >= case p_period
                 when 'week'  then now() - interval '7 days'
                 when 'month' then now() - interval '30 days'
                 else 'epoch'::timestamptz end
        ), 0)
      end as xp
    from profiles p
    where p.role = 'student'
  )
  select row_number() over (order by xp desc) as rank,
         id, full_name, username, avatar_url, growth_stage, xp,
         id = auth.uid() as is_current_user
  from scoped
  order by xp desc;
$$;

-- ---------- admin: issue a temporary password ----------
create or replace function admin_reset_password(p_user uuid)
returns jsonb
language plpgsql security definer set search_path = public, extensions
as $$
declare temp_pw text;
begin
  if not is_staff() then raise exception 'unauthorized'; end if;
  temp_pw := upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10));
  update auth.users
     set encrypted_password = crypt(temp_pw, gen_salt('bf'))
   where id = p_user;
  update profiles set must_reset_password = true where id = p_user;
  return jsonb_build_object('tempPassword', temp_pw);
end;
$$;

-- ---------- admin: create a member (auth user + profile via trigger) ----------
create or replace function admin_create_member(p_email text, p_full_name text)
returns jsonb
language plpgsql security definer set search_path = public, auth, extensions
as $$
declare
  new_id uuid := gen_random_uuid();
  temp_pw text;
  uname text;
begin
  if not is_staff() then raise exception 'unauthorized'; end if;
  temp_pw := upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10));
  uname := split_part(p_email, '@', 1);

  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
    confirmation_token, recovery_token, email_change_token_new, email_change
  ) values (
    '00000000-0000-0000-0000-000000000000', new_id, 'authenticated', 'authenticated',
    p_email, crypt(temp_pw, gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}',
    jsonb_build_object('full_name', p_full_name, 'username', uname,
                       'role', 'student', 'must_reset_password', true),
    now(), now(), '', '', '', ''
  );
  insert into auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) values (
    gen_random_uuid(), new_id,
    jsonb_build_object('sub', new_id::text, 'email', p_email),
    'email', new_id::text, now(), now(), now()
  );
  return jsonb_build_object('userId', new_id, 'tempPassword', temp_pw);
end;
$$;

-- ---------- admin: review a submission (award XP to the student on approval) ----------
create or replace function admin_review_submission(p_submission uuid, p_action text, p_feedback text)
returns void
language plpgsql security definer set search_path = public
as $$
declare
  sid uuid;
  new_status submission_status;
begin
  if not is_staff() then raise exception 'unauthorized'; end if;
  new_status := case when p_action = 'approve' then 'approved' else 'needs_fix' end::submission_status;

  update submissions set status = new_status, feedback = p_feedback, reviewed_by = auth.uid()
   where id = p_submission
   returning student_id into sid;

  if p_action = 'approve' and sid is not null then
    insert into xp_events (user_id, event_type, points, ref_id)
    select sid, 'assignment_approved', points, p_submission::text
    from xp_rules where event_type = 'assignment_approved';
    insert into notifications (user_id, kind, title, body, href)
    values (sid, 'system', 'המשימה אושרה', 'המשימה שלך אושרה — קיבלת XP!', '/account');
  end if;
end;
$$;
