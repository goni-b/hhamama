-- 20260712000001_schema.sql
-- Hachamama (החממה) — full schema. Mirrors src/lib/data/types.ts (the DataClient contract).
-- Stateless: all app state lives here. No client-side persistence.

-- ---------- extensions (Supabase keeps these in the `extensions` schema) ----------
create extension if not exists "pgcrypto" with schema extensions;  -- crypt(), gen_salt()
create extension if not exists "pg_trgm"  with schema extensions;  -- search (ILIKE / similarity)

-- ---------- enums ----------
create type role              as enum ('super-admin', 'mentor', 'student');
create type growth_stage      as enum ('seed', 'sprout', 'sapling', 'blooming', 'tree', 'grower');
create type gender            as enum ('f', 'm');
create type course_level      as enum ('beginner', 'intermediate', 'advanced');
create type video_provider    as enum ('youtube', 'vimeo', 'bunny');
create type resource_kind     as enum ('pdf', 'link', 'file');
create type reaction_kind     as enum ('grow', 'gold', 'precise', 'lift');
create type submission_status as enum ('pending', 'needs_fix', 'approved');
create type notification_kind as enum ('reaction', 'comment', 'level_up', 'achievement', 'live', 'system');
create type event_status      as enum ('upcoming', 'live', 'ended');
create type subscription_status as enum ('active', 'paused', 'canceled');
create type xp_event_type as enum (
  'lesson_complete','module_complete','course_complete','quiz_pass','quiz_perfect',
  'assignment_submit','assignment_approved','post_create','comment_create','reaction_received',
  'growing_answer','live_attend','recording_watch','daily_watering','watch_minutes',
  'streak_milestone','profile_complete','weekly_survey','challenge_submit','spotlight','week_top3'
);

-- =====================================================================
-- IDENTITY
-- =====================================================================
create table profiles (
  id                    uuid primary key references auth.users (id) on delete cascade,
  full_name             text        not null,
  username              text        not null unique,
  email                 text        not null,
  role                  role        not null default 'student',
  avatar_url            text,
  bio                   text,
  xp_total              integer     not null default 0 check (xp_total >= 0),
  growth_stage          growth_stage not null default 'seed',
  streak_days           integer     not null default 0,
  streak_best           integer     not null default 0,
  weekly_goal_minutes   integer     not null default 90,
  preferred_gender      gender,
  focus_mode            boolean     not null default false,
  onboarding_completed  boolean     not null default false,
  must_reset_password   boolean     not null default false,
  created_at            timestamptz not null default now()
);
create index profiles_role_idx        on profiles (role);
create index profiles_xp_idx          on profiles (xp_total desc);
create index profiles_username_trgm   on profiles using gin (username extensions.gin_trgm_ops);
create index profiles_fullname_trgm   on profiles using gin (full_name extensions.gin_trgm_ops);

-- =====================================================================
-- CONTENT (course tree)
-- =====================================================================
create table courses (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  title          text not null,
  description    text not null default '',
  thumbnail_url  text not null default '',
  level          course_level not null default 'beginner',
  category       text,
  is_published   boolean not null default false,
  locked_reason  text,
  created_at     timestamptz not null default now()
);
create index courses_published_idx on courses (is_published);
create index courses_title_trgm    on courses using gin (title extensions.gin_trgm_ops);

create table modules (
  id           uuid primary key default gen_random_uuid(),
  course_id    uuid not null references courses (id) on delete cascade,
  title        text not null,
  order_index  integer not null default 0
);
create index modules_course_idx on modules (course_id, order_index);

create table lessons (
  id              uuid primary key default gen_random_uuid(),
  module_id       uuid not null references modules (id) on delete cascade,
  title           text not null,
  duration_sec    integer not null default 0,
  video_provider  video_provider not null default 'youtube',
  video_id        text not null default '',
  order_index     integer not null default 0,
  locked_reason   text
);
create index lessons_module_idx on lessons (module_id, order_index);
create index lessons_title_trgm on lessons using gin (title extensions.gin_trgm_ops);

create table lesson_resources (
  id         uuid primary key default gen_random_uuid(),
  lesson_id  uuid not null references lessons (id) on delete cascade,
  title      text not null,
  kind       resource_kind not null,
  url        text not null
);
create index lesson_resources_lesson_idx on lesson_resources (lesson_id);

-- =====================================================================
-- PROGRESS
-- =====================================================================
create table enrollments (
  user_id     uuid not null references profiles (id) on delete cascade,
  course_id   uuid not null references courses (id) on delete cascade,
  started_at  timestamptz not null default now(),
  primary key (user_id, course_id)
);

create table lesson_progress (
  user_id       uuid not null references profiles (id) on delete cascade,
  lesson_id     uuid not null references lessons (id) on delete cascade,
  position_sec  integer not null default 0,
  watched_pct   integer not null default 0 check (watched_pct between 0 and 100),
  completed_at  timestamptz,
  updated_at    timestamptz not null default now(),
  primary key (user_id, lesson_id)
);
create index lesson_progress_user_idx on lesson_progress (user_id);

create table lesson_notes (
  user_id    uuid not null references profiles (id) on delete cascade,
  lesson_id  uuid not null references lessons (id) on delete cascade,
  body       text not null default '',
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

-- =====================================================================
-- GAMIFICATION
-- =====================================================================
create table xp_rules (
  event_type  xp_event_type primary key,
  label       text not null,
  points      integer not null,
  daily_cap   integer
);

create table xp_events (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references profiles (id) on delete cascade,
  event_type  xp_event_type not null,
  points      integer not null,
  ref_id      text,
  created_at  timestamptz not null default now()
);
create index xp_events_user_idx on xp_events (user_id, created_at desc);
create index xp_events_daily_idx on xp_events (user_id, event_type, created_at);

create table achievements (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  title        text not null,
  description  text not null,
  icon         text not null,
  hidden       boolean not null default false
);

create table user_achievements (
  user_id         uuid not null references profiles (id) on delete cascade,
  achievement_id  uuid not null references achievements (id) on delete cascade,
  unlocked_at     timestamptz not null default now(),
  primary key (user_id, achievement_id)
);

-- one row per active day; powers streak calc + "freeze" logic
create table activity_days (
  user_id       uuid not null references profiles (id) on delete cascade,
  activity_date date not null,
  primary key (user_id, activity_date)
);

-- =====================================================================
-- COMMUNITY
-- =====================================================================
create table channels (
  slug        text primary key,
  name        text not null,
  order_index integer not null default 0
);

create table posts (
  id          uuid primary key default gen_random_uuid(),
  author_id   uuid not null references profiles (id) on delete cascade,
  channel     text not null references channels (slug),
  title       text,
  body        text not null,
  image_url   text,
  pinned      boolean not null default false,
  created_at  timestamptz not null default now()
);
create index posts_channel_idx on posts (channel, created_at desc);
create index posts_author_idx  on posts (author_id, created_at desc);
create index posts_body_trgm   on posts using gin (body extensions.gin_trgm_ops);

create table post_reactions (
  post_id   uuid not null references posts (id) on delete cascade,
  user_id   uuid not null references profiles (id) on delete cascade,
  kind      reaction_kind not null,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id, kind)
);
create index post_reactions_post_idx on post_reactions (post_id);

create table comments (
  id          uuid primary key default gen_random_uuid(),
  post_id     uuid not null references posts (id) on delete cascade,
  author_id   uuid not null references profiles (id) on delete cascade,
  body        text not null,
  created_at  timestamptz not null default now()
);
create index comments_post_idx on comments (post_id, created_at);

-- =====================================================================
-- LIVE EVENTS
-- =====================================================================
create table events (
  id                   uuid primary key default gen_random_uuid(),
  title                text not null,
  description          text not null default '',
  starts_at            timestamptz not null,
  duration_min         integer not null default 60,
  host_name            text not null,
  status               event_status not null default 'upcoming',
  recording_lesson_id  uuid references lessons (id) on delete set null
);
create index events_starts_idx on events (starts_at);

create table event_rsvps (
  event_id  uuid not null references events (id) on delete cascade,
  user_id   uuid not null references profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (event_id, user_id)
);

-- =====================================================================
-- QUIZZES
-- =====================================================================
create table quizzes (
  id          uuid primary key default gen_random_uuid(),
  module_id   uuid not null references modules (id) on delete cascade,
  title       text not null,
  pass_score  integer not null default 70
);
create index quizzes_module_idx on quizzes (module_id);

create table quiz_questions (
  id           uuid primary key default gen_random_uuid(),
  quiz_id      uuid not null references quizzes (id) on delete cascade,
  prompt       text not null,
  order_index  integer not null default 0
);
create index quiz_questions_quiz_idx on quiz_questions (quiz_id, order_index);

create table quiz_options (
  id           uuid primary key default gen_random_uuid(),
  question_id  uuid not null references quiz_questions (id) on delete cascade,
  text         text not null,
  is_correct   boolean not null default false,
  order_index  integer not null default 0
);
create index quiz_options_question_idx on quiz_options (question_id, order_index);

create table quiz_attempts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references profiles (id) on delete cascade,
  quiz_id     uuid not null references quizzes (id) on delete cascade,
  score       integer not null,
  passed      boolean not null,
  perfect     boolean not null,
  created_at  timestamptz not null default now()
);
create index quiz_attempts_user_idx on quiz_attempts (user_id, quiz_id);

-- =====================================================================
-- ASSIGNMENTS
-- =====================================================================
create table assignments (
  id           uuid primary key default gen_random_uuid(),
  course_id    uuid not null references courses (id) on delete cascade,
  title        text not null,
  description  text not null default '',
  due_at       timestamptz
);
create index assignments_course_idx on assignments (course_id);

create table submissions (
  id             uuid primary key default gen_random_uuid(),
  assignment_id  uuid not null references assignments (id) on delete cascade,
  student_id     uuid not null references profiles (id) on delete cascade,
  content        text not null default '',
  link           text,
  file_paths     text[] not null default '{}',
  status         submission_status not null default 'pending',
  feedback       text,
  reviewed_by    uuid references profiles (id) on delete set null,
  submitted_at   timestamptz not null default now(),
  unique (assignment_id, student_id)
);
create index submissions_status_idx  on submissions (status, submitted_at desc);
create index submissions_student_idx on submissions (student_id);

-- =====================================================================
-- ACCOUNT & NOTIFICATIONS
-- =====================================================================
create table subscriptions (
  user_id             uuid primary key references profiles (id) on delete cascade,
  status              subscription_status not null default 'active',
  plan_name           text not null default 'מקום קבוע בחממה',
  current_period_end  timestamptz,
  paused_until        timestamptz,
  discount_used       boolean not null default false
);

create table account_preferences (
  user_id            uuid primary key references profiles (id) on delete cascade,
  streak_rest_fri_sat boolean not null default true,
  notify_reactions   boolean not null default true,
  notify_comments    boolean not null default true,
  notify_lives       boolean not null default true,
  notify_streak      boolean not null default true
);

create table cancellation_surveys (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references profiles (id) on delete cascade,
  reason      text not null,
  free_text   text,
  created_at  timestamptz not null default now()
);

create table notifications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references profiles (id) on delete cascade,
  kind        notification_kind not null,
  title       text not null,
  body        text not null default '',
  href        text,
  read        boolean not null default false,
  created_at  timestamptz not null default now()
);
create index notifications_user_idx on notifications (user_id, created_at desc);
