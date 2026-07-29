-- 20260729000010_streak_fix.sql
-- תיקון רצף ההשקיה (פרק 2.3 + 5.4).
-- באגים שתוקנו:
--   1. רצף מת המשיך להיות מוצג — החישוב רץ רק כשמרוויחים XP, אז מי שלא נכנס
--      שבועיים עדיין ראה את הרצף הישן. עכשיו החישוב הוא read-time ואמיתי.
--   2. רצפי רפאים מה-seed (streak_days בלי שורות activity_days בכלל).
--   3. גבול היום היה current_date של השרת (UTC) במקום 04:00 Asia/Jerusalem.
--   4. "עלה מגן" היה קבוע 1 בקוד הלקוח — עכשיו נשמר ונצרך באמת.
--   5. ההעדפה streak_rest_fri_sat התקיימה בסכמה אבל אף אחד לא קרא אותה.
--   6. אבני דרך (7/30/100/365) לא העניקו XP.

-- ---------- 1. גבול היום הקנוני: 04:00 Asia/Jerusalem ----------
create or replace function app_today()
returns date
language sql stable
set search_path = public
as $$
  select ((now() at time zone 'Asia/Jerusalem') - interval '4 hours')::date;
$$;

-- ---------- 2. סוג היום בטבלת הפעילות ----------
-- 'activity' = יום פעיל אמיתי (מקדם את המונה)
-- 'rest'     = שישי/שבת בהעדפת מנוחה — משמר את הרצף, לא מקדם
-- 'freeze'   = עלה מגן שנצרך — משמר את הרצף, לא מקדם
alter table activity_days
  add column if not exists source text not null default 'activity';

do $$ begin
  alter table activity_days
    add constraint activity_days_source_chk check (source in ('activity','rest','freeze'));
exception when duplicate_object then null; end $$;

-- ---------- 3. מלאי עלי המגן ----------
alter table profiles
  add column if not exists streak_freezes int not null default 0;

-- ---------- 4. חישוב הרצף — מקור האמת היחיד ----------
-- קורא בלבד, ולכן נכון גם בלי cron: פערים שעדיין לא מומשו בטבלה
-- (מנוחה/עלה מגן) מטופלים כאן בזמן אמת.
-- הליבה: ללא בדיקת הרשאה, לשימוש פנימי בלבד (record_activity, backfill).
create or replace function compute_streak_internal(p_user uuid)
returns jsonb
language plpgsql stable security definer set search_path = public
as $$
declare
  v_today   date := app_today();
  v_rest    boolean;
  v_freezes int;
  v_best    int;
  v_last    date;
  v_cursor  date;
  v_src     text;
  v_current int := 0;
  v_used    int := 0;
  v_guard   int := 0;
begin
  select coalesce(streak_rest_fri_sat, true) into v_rest
    from account_preferences where user_id = p_user;
  v_rest := coalesce(v_rest, true);

  select coalesce(streak_freezes, 0), coalesce(streak_best, 0)
    into v_freezes, v_best
    from profiles where id = p_user;
  v_freezes := coalesce(v_freezes, 0);
  v_best    := coalesce(v_best, 0);

  select max(activity_date) into v_last
    from activity_days where user_id = p_user and source = 'activity';

  if v_last is null then
    return jsonb_build_object('current', 0, 'best', v_best, 'freezes', v_freezes,
                              'lastActive', null, 'atRisk', false);
  end if;

  -- מתחילים מהיום. אם היום עוד לא נרשם — היום עדיין לא "נשבר", ממשיכים מאתמול.
  v_cursor := v_today;
  if not exists (select 1 from activity_days
                  where user_id = p_user and activity_date = v_cursor) then
    v_cursor := v_cursor - 1;
  end if;

  loop
    v_guard := v_guard + 1;
    exit when v_guard > 500;                 -- גבול ביטחון

    select source into v_src from activity_days
     where user_id = p_user and activity_date = v_cursor;

    if v_src = 'activity' then
      v_current := v_current + 1;
    elsif v_src in ('rest', 'freeze') then
      null;                                   -- משמר, לא מקדם
    elsif v_rest and extract(isodow from v_cursor) in (5, 6) then
      null;                                   -- "שבת בחממה" שעוד לא מומשה
    elsif v_used < v_freezes then
      v_used := v_used + 1;                   -- עלה מגן מכסה את הפער
    else
      exit;                                   -- הרצף נשבר
    end if;

    v_cursor := v_cursor - 1;
  end loop;

  return jsonb_build_object(
    'current', v_current,
    'best', greatest(v_best, v_current),
    'freezes', greatest(v_freezes - v_used, 0),
    'lastActive', v_last,
    -- "בסכנה": יש רצף חי אבל היום עוד לא נרשמה פעילות
    'atRisk', v_current > 0
              and not exists (select 1 from activity_days
                               where user_id = p_user and activity_date = v_today)
  );
end;
$$;

-- העטיפה הציבורית: SECURITY DEFINER עוקף RLS, ולכן חוסמים הצצה לרצף של אחרים.
create or replace function compute_streak(p_user uuid)
returns jsonb
language plpgsql stable security definer set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'unauthorized' using errcode = '42501';
  end if;
  if p_user <> auth.uid() and not is_staff() then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  return compute_streak_internal(p_user);
end;
$$;

revoke all on function compute_streak_internal(uuid) from public, authenticated;

-- ---------- 5. רישום פעילות — כותב, מחשב, ומעניק אבני דרך ----------
create or replace function record_activity(uid uuid)
returns void
language plpgsql security definer set search_path = public
as $$
declare
  v_today   date := app_today();
  v_before  int;
  v_stats   jsonb;
  v_current int;
  v_ms      record;
begin
  select coalesce(streak_days, 0) into v_before from profiles where id = uid;

  insert into activity_days (user_id, activity_date, source)
  values (uid, v_today, 'activity')
  on conflict (user_id, activity_date) do update set source = 'activity';

  v_stats   := compute_streak_internal(uid);
  v_current := (v_stats->>'current')::int;

  update profiles
     set streak_days  = v_current,
         streak_best  = greatest(coalesce(streak_best, 0), v_current),
         -- עלה מגן על כל 7 ימי רצף, מלאי מקסימלי 2
         streak_freezes = case
           when v_current > v_before and v_current % 7 = 0
             then least(coalesce(streak_freezes, 0) + 1, 2)
           else coalesce(streak_freezes, 0)
         end
   where id = uid;

  -- אבני דרך: 7/30/100/365 → 50/200/500/1500 נקודות (פעם אחת לכל אבן דרך)
  if v_current > v_before then
    for v_ms in
      select * from (values (7, 50), (30, 200), (100, 500), (365, 1500))
        as t(day_mark, pts)
      where t.day_mark = v_current
    loop
      if not exists (
        select 1 from xp_events
         where user_id = uid and event_type = 'streak_milestone'
           and ref_id = 'streak-' || v_ms.day_mark
      ) then
        insert into xp_events (user_id, event_type, points, ref_id)
        values (uid, 'streak_milestone', v_ms.pts, 'streak-' || v_ms.day_mark);

        insert into notifications (user_id, kind, title, body, href)
        values (uid, 'achievement', 'אבן דרך ברצף!',
                v_ms.day_mark || ' ימי השקיה ברצף — ' || v_ms.pts || ' נקודות צמיחה נוספו לך.',
                '/achievements');
      end if;
    end loop;
  end if;
end;
$$;

-- ---------- 6. תחזוקה לילית (04:15) — מימוש מנוחה/הקפאה ואיפוס רצף מת ----------
create or replace function run_streak_maintenance()
returns void
language plpgsql security definer set search_path = public
as $$
declare
  r          record;
  v_yesterday date := app_today() - 1;
  v_rest     boolean;
begin
  for r in
    select p.id, coalesce(p.streak_days,0) streak_days, coalesce(p.streak_freezes,0) freezes
      from profiles p
     where coalesce(p.streak_days, 0) > 0
       and not exists (select 1 from activity_days a
                        where a.user_id = p.id and a.activity_date = v_yesterday)
  loop
    select coalesce(streak_rest_fri_sat, true) into v_rest
      from account_preferences where user_id = r.id;
    v_rest := coalesce(v_rest, true);

    if v_rest and extract(isodow from v_yesterday) in (5, 6) then
      insert into activity_days (user_id, activity_date, source)
      values (r.id, v_yesterday, 'rest') on conflict do nothing;

    elsif r.freezes > 0 then
      insert into activity_days (user_id, activity_date, source)
      values (r.id, v_yesterday, 'freeze') on conflict do nothing;
      update profiles set streak_freezes = greatest(streak_freezes - 1, 0) where id = r.id;
      insert into notifications (user_id, kind, title, body, href)
      values (r.id, 'system', 'עלה מגן שמר על הרצף שלך',
              'לא הספקת אתמול — עלה מגן נצרך והרצף נשמר. נתראה היום בחממה.', '/');

    else
      update profiles set streak_days = 0 where id = r.id;
      insert into notifications (user_id, kind, title, body, href)
      values (r.id, 'system', 'מתחילים רצף חדש היום',
              'הרצף הקודם הסתיים — כל יום הוא התחלה טובה. שיעור אחד מספיק.', '/');
    end if;
  end loop;
end;
$$;

grant execute on function app_today() to authenticated;
grant execute on function compute_streak(uuid) to authenticated;

-- ---------- 6ב. תזמון התחזוקה ----------
-- 02:30 UTC = 04:30 בחורף (UTC+2) ו-05:30 בקיץ (UTC+3) — תמיד אחרי גבול 04:00,
-- כך שהמעבר לשעון קיץ/חורף לא גורם לבדיקה של היום הלא נכון.
do $$ begin
  create extension if not exists pg_cron;
  perform cron.unschedule('streak-maintenance');
exception when others then null; end $$;

do $$ begin
  perform cron.schedule('streak-maintenance', '30 2 * * *',
                        'select public.run_streak_maintenance()');
exception when others then
  raise notice 'pg_cron unavailable — compute_streak works read-time regardless';
end $$;

-- ---------- 7. תיקון הנתונים הקיימים ----------
-- מיישר את כל הפרופילים מול הלדג'ר: רצפי רפאים מה-seed מתאפסים,
-- ורצפים מתים (בלי פעילות אחרונה) יורדים ל-0.
update profiles p
   set streak_days = (compute_streak_internal(p.id)->>'current')::int,
       streak_best = greatest(coalesce(p.streak_best, 0),
                              (compute_streak_internal(p.id)->>'current')::int);
