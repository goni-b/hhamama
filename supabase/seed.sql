-- supabase/seed.sql — ported from src/lib/data/mock/seed.ts + db.ts
-- Idempotent-ish: safe to run on a fresh DB. Demo password for all accounts: "password123".
-- extensions on path so crypt()/gen_salt() resolve; auth.* is schema-qualified below.
set search_path = public, extensions;

-- ============ XP RULES (XP_VALUES from mock/index.ts) ============
insert into xp_rules (event_type, label, points, daily_cap) values
  ('lesson_complete','השלמת שיעור',20,null),
  ('module_complete','השלמת מודול',75,null),
  ('course_complete','השלמת קורס',300,null),
  ('quiz_pass','מעבר מבחן',50,null),
  ('quiz_perfect','ציון מושלם',25,null),
  ('assignment_submit','הגשת משימה',60,null),
  ('assignment_approved','אישור משימה',40,null),
  ('post_create','פרסום פוסט',15,null),
  ('comment_create','תגובה',5,null),
  ('reaction_received','קבלת ריאקציה',2,null),
  ('growing_answer','תשובה מצמיחה',30,null),
  ('live_attend','השתתפות בלייב',40,null),
  ('recording_watch','צפייה בהקלטה',15,null),
  ('daily_watering','השקיה יומית',5,5),
  ('watch_minutes','דקות צפייה',1,null),
  ('streak_milestone','אבן דרך ברצף',50,null),
  ('profile_complete','השלמת פרופיל',25,null),
  ('weekly_survey','סקר שבועי',10,null),
  ('challenge_submit','הגשת אתגר',150,null),
  ('spotlight','זרקור',100,null),
  ('week_top3','טופ 3 שבועי',50,null)
on conflict (event_type) do nothing;

-- ============ CHANNELS ============
insert into channels (slug, name, order_index) values
  ('announcements','הכרזות',1),
  ('general','כללי',2),
  ('questions','שאלות',3),
  ('wins','ניצחונות',4)
on conflict (slug) do nothing;

-- ============ ACHIEVEMENTS (catalog) ============
insert into achievements (slug, title, description, icon, hidden) values
  ('first_seed','הזרע הראשון','השלמת את השיעור הראשון שלך','seed',false),
  ('week_of_gold','שבוע של זהב','רצף השקיה של 7 ימים','flame',false),
  ('first_module','אבן הפינה','השלמת מודול שלם','module',false),
  ('marathon','מרתוניסטית','צפית ב-5 שיעורים ביום אחד','marathon',false),
  ('first_post','קול בקהילה','פרסמת 10 פוסטים בקהילה','community',false),
  ('perfect_score','מאה אחוז','ציון 100 במבחן','star',false),
  ('month_in','חודש בחממה','רצף השקיה של 30 ימים','calendar',false),
  ('first_graduate','בוגרת ראשונה','השלמת קורס שלם','graduate',false),
  ('helper','יד מושיטה','עזרת ל-5 חברות בתגובות','hands',false),
  ('live_regular','נוכחת קבועה','השתתפת ב-3 לייבים','radio',false),
  ('early_bird','ציפור בוקר','10 השקיות לפני 8 בבוקר','sunrise',false),
  ('assignment_pro','מגישה סדרתית','3 משימות שאושרו','check',false),
  ('quiz_streak','ראש חד','עברת 5 מבחנים ברצף','brain',false),
  ('sapling_rank','השתיל שלי','הגעת לדרגת שתיל','sapling',false),
  ('night_owl','ינשופה','השקיה אחרי חצות','moon',false),
  ('hidden_1','הישג נסתר','?','lock',true),
  ('hidden_2','הישג נסתר','?','lock',true),
  ('hidden_3','הישג נסתר','?','lock',true),
  ('hidden_4','הישג נסתר','?','lock',true),
  ('hidden_5','הישג נסתר','?','lock',true)
on conflict (slug) do nothing;

-- ============ COURSES / MODULES / LESSONS ============
insert into courses (slug, title, description, level, category, is_published, locked_reason) values
  ('campaigner-ai-beginners','קמפיינר AI — מתחילים',
   'המסלול המלא לבניית קמפיין ראשון שמביא לקוחות — מהרעיון ועד ההעלאה והאופטימיזציה, בעזרת כלי AI. בלי רקע טכני, צעד אחרי צעד.',
   'beginner','AI',true,null),
  ('landing-pages-that-sell','בניית דפי נחיתה שמוכרים',
   'איך בונים דף נחיתה שממיר — מבנה, קופי, עיצוב ובדיקות. כולל תבניות מוכנות.',
   'beginner','שיווק',true,null),
  ('ai-automations-for-business','אוטומציות AI לעסק שלך',
   'לחבר את העסק לאוטומציות חכמות: לידים, מיילים, וואטסאפ ותהליכים — בלי מפתח.',
   'intermediate','אוטומציות',true,null),
  ('copywriting-24-steps','כתיבת קופי בשיטת 24 הצעדים',
   'שיטת הכתיבה של חופית וגוני — 24 הצעדים שהופכים טקסט למכונת מכירה. קורס PRO.',
   'advanced','קופי',true,'נפתח בדרגת שתיל')
on conflict (slug) do nothing;

-- modules (referenced by course slug + order_index)
insert into modules (course_id, title, order_index)
select c.id, m.title, m.ord from courses c join (values
  ('campaigner-ai-beginners','יסודות: איך חושבים קמפיין',1),
  ('campaigner-ai-beginners','כתיבה והצעה שאי אפשר לסרב לה',2),
  ('campaigner-ai-beginners','העלאה, מדידה ואופטימיזציה',3),
  ('landing-pages-that-sell','מבנה דף שממיר',1),
  ('landing-pages-that-sell','קופי ועיצוב',2),
  ('ai-automations-for-business','יסודות האוטומציה',1),
  ('ai-automations-for-business','אוטומציות לידים',2),
  ('copywriting-24-steps','מבוא לשיטה',1),
  ('copywriting-24-steps','הכתיבה',2)
) as m(cslug, title, ord) on c.slug = m.cslug
on conflict do nothing;

-- lessons (referenced by course slug + module order + lesson order)
insert into lessons (module_id, title, duration_sec, video_provider, video_id, order_index)
select mo.id, l.title, l.dur, 'youtube'::video_provider, 'aqz-KE-bpKQ', l.ord
from modules mo join courses c on c.id = mo.course_id
join (values
  ('campaigner-ai-beginners',1,'ברוכים הבאים — איך עובד הקורס',372,1),
  ('campaigner-ai-beginners',1,'האנטומיה של קמפיין שמוכר',640,2),
  ('campaigner-ai-beginners',1,'לבנות פרסונת קהל יעד עם AI',815,3),
  ('campaigner-ai-beginners',1,'המסר המרכזי: מה באמת אומרים',540,4),
  ('campaigner-ai-beginners',2,'מבנה ההצעה הבלתי-הפיכה',700,1),
  ('campaigner-ai-beginners',2,'כתיבת קופי עם AI — בלי שירגיש רובוטי',905,2),
  ('campaigner-ai-beginners',2,'כותרות שעוצרות את הגלילה',480,3),
  ('campaigner-ai-beginners',3,'מבנה חשבון המודעות הנכון',812,1),
  ('campaigner-ai-beginners',3,'בדיקות A/B בשיטת 3-3-3',690,2),
  ('campaigner-ai-beginners',3,'לקרוא את הנתונים ולדעת מה לעשות',760,3),
  ('campaigner-ai-beginners',3,'סיכום הקורס והצעד הבא שלך',300,4),
  ('landing-pages-that-sell',1,'האנטומיה של דף נחיתה',480,1),
  ('landing-pages-that-sell',1,'מעל הקפל: 3 השניות הראשונות',540,2),
  ('landing-pages-that-sell',1,'הוכחה חברתית שעובדת',600,3),
  ('landing-pages-that-sell',2,'כותרות שממירות',480,1),
  ('landing-pages-that-sell',2,'קריאה לפעולה (CTA)',540,2),
  ('ai-automations-for-business',1,'מפה של תהליכי העסק',480,1),
  ('ai-automations-for-business',1,'הכלים: Make ו-n8n',540,2),
  ('ai-automations-for-business',2,'קליטת ליד אוטומטית',480,1),
  ('ai-automations-for-business',2,'רצף מייל אוטומטי',540,2),
  ('copywriting-24-steps',1,'24 הצעדים — מבט על',480,1),
  ('copywriting-24-steps',1,'שלב המחקר',540,2),
  ('copywriting-24-steps',2,'בניית הסיפור',480,1),
  ('copywriting-24-steps',2,'עריכה שמוכרת',540,2)
) as l(cslug, mord, title, dur, ord)
  on c.slug = l.cslug and mo.order_index = l.mord
on conflict do nothing;

-- resources on the first lesson of every module
insert into lesson_resources (lesson_id, title, kind, url)
select l.id, 'מצגת השיעור (PDF)', 'pdf'::resource_kind, '#'
from lessons l where l.order_index = 1
on conflict do nothing;
insert into lesson_resources (lesson_id, title, kind, url)
select l.id, 'תבנית לעבודה', 'file'::resource_kind, '#'
from lessons l where l.order_index = 1
on conflict do nothing;

-- ============ DEMO AUTH USERS (from mock/db.ts SEED_PROFILES) ============
-- Creates auth.users + auth.identities; handle_new_user() provisions the profile.
do $$
declare
  r record;
  uid uuid;
begin
  for r in select * from (values
    -- email, full_name, username, role, xp, streak, best, weekly, gender, onboarded, must_reset, bio
    ('noa@example.com','נועה כהן','noa-cohen','student',340,6,11,90,'f',true,false,'בעלת עסק לתכשיטים בעבודת יד, לומדת לשווק לבד.'),
    ('daniel@example.com','דניאל לוי','daniel-levi','student',1240,3,20,120,'m',true,false,''),
    ('ron@example.com','רון אברהם','ron-avraham','student',4780,0,41,150,'m',true,false,''),
    ('new@example.com','חברה חדשה','new-member','student',0,0,0,90,'f',false,true,''),
    ('hofit@hofitgoni.com','חופית','hofit','super-admin',0,0,0,0,'f',true,false,''),
    ('goni@hofitgoni.com','גוני','goni','super-admin',0,0,0,0,'m',true,false,'')
  ) as t(email, full_name, username, role, xp, streak, best, weekly, gender, onboarded, must_reset, bio)
  loop
    uid := gen_random_uuid();
    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) values (
      '00000000-0000-0000-0000-000000000000', uid, 'authenticated', 'authenticated',
      r.email, crypt('password123', gen_salt('bf')), now(),
      '{"provider":"email","providers":["email"]}',
      jsonb_build_object(
        'full_name', r.full_name, 'username', r.username, 'role', r.role,
        'weekly_goal_minutes', r.weekly, 'onboarding_completed', r.onboarded,
        'must_reset_password', r.must_reset),
      now(), now(), '', '', '', ''
    );
    insert into auth.identities (
      id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) values (
      gen_random_uuid(), uid,
      jsonb_build_object('sub', uid::text, 'email', r.email),
      'email', uid::text, now(), now(), now()
    );
    update profiles set
      streak_days = r.streak, streak_best = r.best,
      preferred_gender = nullif(r.gender,'')::gender,
      bio = nullif(r.bio,'')
    where id = uid;
    -- seed XP via the ledger so leaderboard + growth_stage compute correctly
    if r.xp > 0 then
      insert into xp_events (user_id, event_type, points, ref_id)
      values (uid, 'lesson_complete', r.xp, 'seed');
    end if;
  end loop;
end $$;

-- ============ COMMUNITY POSTS (authors resolved by username) ============
insert into posts (author_id, channel, title, body, pinned, created_at)
select p.id, v.channel, v.title, v.body, v.pinned, now() - (v.mins || ' minutes')::interval
from (values
  ('goni','announcements','ברוכות הבאות לחממה',
   'החממה נפתחה רשמית! כל בוקר יעלה כאן טיפ יומי חדש, וכל שבוע נעלה שיעור נוסף. מוזמנות להציג את עצמכן כאן למטה — נשמח להכיר.',true,240),
  ('noa-cohen','wins','הליד הראשון שלי!',
   'העליתי היום את הקמפיין הראשון שלי בעקבות מודול 2 — ותוך שעתיים נכנס הליד הראשון! עדיין לא מאמינה.',false,55),
  ('daniel-levi','questions',null,
   'שאלה על בדיקות A/B — כמה זמן כדאי להריץ וריאציה לפני שמחליטים? ראיתי בשיעור 3-3-3 אבל רוצה לוודא שהבנתי נכון.',false,120),
  ('ron-avraham','general',null,
   'טיפ שעבד לי מטורף: לכתוב את הכותרת אחרונה, אחרי כל שאר הקופי. פתאום היא כותבת את עצמה.',false,200),
  ('noa-cohen','questions',null,
   'מישהי עבדה עם הפרומפט לפרסונה מהשיעור? אשמח לדוגמה איך מילאתם אותו לעסק שירותים.',false,320),
  ('daniel-levi','wins','סיימתי קורס',
   'סיימתי את קורס דפי הנחיתה! הדף החדש שלי ממיר פי 2 מהקודם. תודה חופית וגוני.',false,640),
  ('hofit','announcements',null,
   'תזכורת: הלייב החודשי על קמפיינים מתקדמים יעלה בקרוב. שמרו מקום ביומן, נעדכן תאריך מדויק כאן.',false,1440),
  ('ron-avraham','general',null,
   'מישהו כאן משלב אוטומציות עם הקמפיינים? מחפש שותפ/ה להתייעצות.',false,2880)
) as v(username, channel, title, body, pinned, mins)
join profiles p on p.username = v.username;

-- ============ NOTIFICATIONS for Noa (the default demo login) ============
insert into notifications (user_id, kind, title, body, href, read, created_at)
select p.id, v.kind::notification_kind, v.title, v.body, v.href, v.read, now() - (v.mins || ' minutes')::interval
from (values
  ('reaction','קיבלת ריאקציה','דניאל הגיב ''מצמיח'' על הפוסט שלך','/community',false,20),
  ('comment','תגובה חדשה','רון הגיב על ''הליד הראשון שלי!''','/community',false,90),
  ('level_up','עלית דרגה','צמחת לדרגת נבט','/achievements',true,1560),
  ('system','שיעור חדש','עלה שיעור חדש בקורס הקמפיינרים','/courses/campaigner-ai-beginners',true,3000)
) as v(kind, title, body, href, read, mins)
cross join profiles p where p.username = 'noa-cohen';

-- ============================================================
-- STEP-A DEMO SEEDS (idempotent) — quiz, assignments, events,
-- extra leaderboard students, demo notifications, subscriptions.
-- ============================================================
-- ============ QUIZ: 'יסודות: איך חושבים קמפיין' (campaigner-ai-beginners, module 1) ============
-- Idempotent: guarded by NOT EXISTS on module/title/order_index.

insert into quizzes (module_id, title, pass_score)
select m.id, 'מבחן מודול: יסודות — איך חושבים קמפיין', 70
from modules m
join courses c on c.id = m.course_id
where c.slug = 'campaigner-ai-beginners'
  and m.order_index = 1
  and not exists (select 1 from quizzes q where q.module_id = m.id);

insert into quiz_questions (quiz_id, prompt, order_index)
select q.id, v.prompt, v.ord
from quizzes q
join modules m on m.id = q.module_id
join courses c on c.id = m.course_id
cross join (values
  ('מה הצעד הראשון הנכון כשמתכננים קמפיין חדש?', 1),
  ('מהי פרסונת קהל יעד?', 2),
  ('מה הופך מסר מרכזי לחזק?', 3),
  ('איך יודעים שקמפיין באמת עובד, ולא רק נראה טוב?', 4)
) as v(prompt, ord)
where c.slug = 'campaigner-ai-beginners'
  and m.order_index = 1
  and q.title = 'מבחן מודול: יסודות — איך חושבים קמפיין'
  and not exists (
    select 1 from quiz_questions qq
    where qq.quiz_id = q.id and qq.order_index = v.ord
  );

insert into quiz_options (question_id, text, is_correct, order_index)
select qq.id, v.text, v.correct, v.ord
from quiz_questions qq
join quizzes q on q.id = qq.quiz_id
join modules m on m.id = q.module_id
join courses c on c.id = m.course_id
join (values
  (1, 'להגדיר את קהל היעד ואת הבעיה שהוא רוצה לפתור', true,  1),
  (1, 'לבחור צבעים ולוגו למודעה',                      false, 2),
  (1, 'להעלות מודעה ולראות מה קורה',                   false, 3),
  (1, 'להגדיל את התקציב מהיום הראשון',                 false, 4),
  (2, 'דמות מפורטת שמייצגת את הלקוח האידיאלי — כאבים, רצונות והתנגדויות', true, 1),
  (2, 'רשימה של כל מי שעשה לייק לעמוד',                false, 2),
  (2, 'הסלוגן הרשמי של המותג',                          false, 3),
  (3, 'הוא מבטיח תוצאה אחת ברורה שחשובה לקהל',          true,  1),
  (3, 'הוא מזכיר כמה שיותר תכונות של המוצר',            false, 2),
  (3, 'הוא כתוב במילים מקצועיות ומרשימות',              false, 3),
  (3, 'הוא ארוך ומפורט ככל האפשר',                      false, 4),
  (4, 'לפי מדדים עסקיים — לידים, עלות לליד ומכירות',    true,  1),
  (4, 'לפי כמות הלייקים על המודעה',                     false, 2),
  (4, 'לפי כמה שהמודעה מוצאת חן בעינינו',               false, 3)
) as v(qord, text, correct, ord) on qq.order_index = v.qord
where c.slug = 'campaigner-ai-beginners'
  and m.order_index = 1
  and q.title = 'מבחן מודול: יסודות — איך חושבים קמפיין'
  and not exists (
    select 1 from quiz_options o
    where o.question_id = qq.id and o.order_index = v.ord
  );
-- Assignments seed — משימות לקורס 'campaigner-ai-beginners' (פרק 3.3 §8)
-- Idempotent: guarded by not-exists on (course_id, title) — assignments has no unique constraint.
insert into assignments (course_id, title, description, due_at)
select c.id, v.title, v.description, v.due_at
from courses c
join (
  values
    (
      'campaigner-ai-beginners',
      'בניית פרסונת קהל יעד עם AI',
      'הגיע הזמן להפוך את השיעורים לעבודה אמיתית: בנו פרסונת קהל יעד מלאה לעסק שלכם — או לעסק לדוגמה — בעזרת כלי AI.

מה מגישים:
1. תיאור הפרסונה — שם, גיל, עיסוק, כאבים ורצונות.
2. הפרומפטים שבהם השתמשתם ומה שיפרתם בהם בין גרסה לגרסה.
3. שלושה מסרים שיווקיים שמדברים ישירות אל הפרסונה.

אפשר לצרף קובץ PDF או קישור למסמך.',
      now() + interval '7 days'
    ),
    (
      'campaigner-ai-beginners',
      'כתיבת הצעה שאי אפשר לסרב לה',
      'המשימה המרכזית של מודול הכתיבה: כתבו הצעה מלאה לשירות או למוצר שלכם, לפי מבנה ההצעה שנלמד בשיעורים.

מה מגישים:
1. ההצעה המלאה — כותרת, גוף, חיזוקים והנעה לפעולה.
2. שני וריאנטים לכותרת הראשית.
3. קישור לדף או למסמך שבו ההצעה חיה.

טיפ: מותר להיעזר ב-AI לניסוחים, אבל הקול חייב להישאר שלכם.',
      null::timestamptz
    )
) as v(course_slug, title, description, due_at)
  on c.slug = v.course_slug
where not exists (
  select 1
  from assignments a
  where a.course_id = c.id
    and a.title = v.title
);
-- אירוע דמו: "שלישי בחממה" הקרוב — יום שלישי 2026-07-21 20:00 שעון ישראל (IDT = UTC+3 → 17:00 UTC)
insert into events (title, description, starts_at, duration_min, host_name, status)
select
  'שלישי בחממה — קמפיינים מתקדמים',
  'סשן אסטרטגיה חי: איך לוקחים קמפיין שעובד ומכפילים אותו — פירוק מבנים מנצחים, אופטימיזציית תקציבים ומענה לשאלות מהקהל בשידור.',
  timestamptz '2026-07-21 17:00:00+00',
  90,
  'חופית וגוני',
  'upcoming'
where not exists (
  select 1 from events where title = 'שלישי בחממה — קמפיינים מתקדמים'
);
-- ============ LEADERBOARD DEMO SEED (idempotent) ============
-- Extra students + time-scattered xp_events so the week/month/all tabs differ.
-- Run AFTER supabase/seed.sql (relies on handle_new_user + apply_xp_event triggers).
-- Safe to re-run: users guarded by username, events guarded by sentinel ref_id.

do $$
declare
  r record;
  uid uuid;
begin
  for r in select * from (values
    ('maya@example.com',  'מאיה פרץ',   'maya-peretz',   90,  'f', 'בונה מותג ראשון לחנות הווינטג'' שלה.'),
    ('shira@example.com', 'שירה מזרחי', 'shira-mizrahi', 120, 'f', ''),
    ('tamar@example.com', 'תמר אלון',   'tamar-alon',    60,  'f', ''),
    ('liora@example.com', 'ליאורה ברק', 'liora-barak',   120, 'f', ''),
    ('yael@example.com',  'יעל שקד',    'yael-shaked',   90,  'f', ''),
    ('adi@example.com',   'עדי נחום',   'adi-nachum',    45,  'f', '')
  ) as t(email, full_name, username, weekly, gender, bio)
  loop
    if exists (select 1 from profiles where username = r.username) then
      continue;
    end if;
    uid := gen_random_uuid();
    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) values (
      '00000000-0000-0000-0000-000000000000', uid, 'authenticated', 'authenticated',
      r.email, crypt('password123', gen_salt('bf')), now(),
      '{"provider":"email","providers":["email"]}',
      jsonb_build_object(
        'full_name', r.full_name, 'username', r.username, 'role', 'student',
        'weekly_goal_minutes', r.weekly, 'onboarding_completed', true,
        'must_reset_password', false),
      now(), now(), '', '', '', ''
    );
    insert into auth.identities (
      id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) values (
      gen_random_uuid(), uid,
      jsonb_build_object('sub', uid::text, 'email', r.email),
      'email', uid::text, now(), now(), now()
    );
    update profiles set
      preferred_gender = nullif(r.gender, '')::gender,
      bio = nullif(r.bio, '')
    where id = uid;
  end loop;
end $$;

-- XP ledger events scattered in time so the weekly/monthly/all-time boards diverge.
-- The apply_xp_event trigger rolls each event into xp_total + growth_stage.
do $$
declare
  v record;
  target uuid;
begin
  for v in select * from (values
    ('maya-peretz',   'lesson_complete',  90, 25),
    ('maya-peretz',   'lesson_complete', 120,  2),
    ('shira-mizrahi', 'course_complete', 300, 20),
    ('shira-mizrahi', 'lesson_complete', 200, 10),
    ('shira-mizrahi', 'lesson_complete', 260,  1),
    ('tamar-alon',    'lesson_complete',  60, 40),
    ('tamar-alon',    'daily_watering',   35,  3),
    ('liora-barak',   'course_complete', 900, 60),
    ('liora-barak',   'lesson_complete', 400, 25),
    ('liora-barak',   'lesson_complete', 280,  4),
    ('yael-shaked',   'lesson_complete', 250, 15),
    ('yael-shaked',   'lesson_complete', 180,  2),
    ('adi-nachum',    'daily_watering',   30,  9),
    ('adi-nachum',    'daily_watering',   25,  1),
    -- fresh weekly movement for the members seeded by supabase/seed.sql
    ('noa-cohen',     'lesson_complete', 140,  1),
    ('daniel-levi',   'lesson_complete',  60,  5)
  ) as t(username, event_type, points, days_ago)
  loop
    select id into target from profiles where username = v.username;
    if not found then
      continue;
    end if;
    if exists (
      select 1 from xp_events
      where ref_id = 'seed-lb-' || v.username || '-' || v.days_ago
    ) then
      continue;
    end if;
    insert into xp_events (user_id, event_type, points, ref_id, created_at)
    values (
      target,
      v.event_type::xp_event_type,
      v.points,
      'seed-lb-' || v.username || '-' || v.days_ago,
      now() - make_interval(days => v.days_ago)
    );
  end loop;
end $$;
-- A4: חשבון + מסע ביטול — דאטה לדמו (אידמפוטנטי)
-- מבטיח שלכל פרופיל קיים יש שורת מנוי פעילה עם תאריך סוף תקופה עתידי, ושורת העדפות.
insert into subscriptions (user_id, status, plan_name, current_period_end, paused_until, discount_used)
select p.id, 'active', 'מקום קבוע בחממה', now() + interval '21 days', null, false
from profiles p
on conflict (user_id) do nothing;

insert into account_preferences (user_id)
select p.id
from profiles p
on conflict (user_id) do nothing;

-- מנויים שכבר קיימים אבל בלי תאריך סוף תקופה — קבל תאריך עתידי כדי שמסך הביטול יציג "גישה עד"
update subscriptions
set current_period_end = now() + interval '21 days'
where current_period_end is null;
-- Demo notifications: one set per profile that has none yet (idempotent).
insert into notifications (user_id, kind, title, body, href, read, created_at)
select p.id, v.kind::notification_kind, v.title, v.body, v.href, v.read, now() - v.age
from profiles p
cross join (
  values
    ('reaction',    'קיבלת ריאקציה',       'חברה מהקהילה סימנה ''מצמיח'' על הפוסט שלך', '/community',    false, interval '25 minutes'),
    ('comment',     'תגובה חדשה',           'יש תגובה חדשה על הפוסט שלך בקהילה',          '/community',    false, interval '3 hours'),
    ('level_up',    'עלית דרגה',            'צמחת לדרגת נבט',                              '/achievements', false, interval '1 day'),
    ('achievement', 'הישג חדש נפתח',        'פתחת את ''שבוע ראשון בחממה''',               '/achievements', true,  interval '3 days'),
    ('live',        'הלייב מתחיל בקרוב',    'הלייב השבועי מתחיל היום ב-20:00',            '/events',       true,  interval '5 days'),
    ('system',      'שיעור שבועי חדש',      'נפתח שיעור חדש בספריית הקורסים',             '/courses',      true,  interval '9 days')
) as v(kind, title, body, href, read, age)
where not exists (select 1 from notifications n where n.user_id = p.id);
