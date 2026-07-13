-- 20260712000003_rls.sql
-- Row-Level Security. Members-only app: authenticated users read shared content;
-- users write only their own rows; staff (super-admin/mentor) manage content & moderation.
-- Answer keys (quiz_options.is_correct) are never exposed — students read a safe view.

alter table profiles            enable row level security;
alter table courses             enable row level security;
alter table modules             enable row level security;
alter table lessons             enable row level security;
alter table lesson_resources    enable row level security;
alter table enrollments         enable row level security;
alter table lesson_progress     enable row level security;
alter table lesson_notes        enable row level security;
alter table xp_rules            enable row level security;
alter table xp_events           enable row level security;
alter table achievements        enable row level security;
alter table user_achievements   enable row level security;
alter table activity_days       enable row level security;
alter table channels            enable row level security;
alter table posts               enable row level security;
alter table post_reactions      enable row level security;
alter table comments            enable row level security;
alter table events              enable row level security;
alter table event_rsvps         enable row level security;
alter table quizzes             enable row level security;
alter table quiz_questions      enable row level security;
alter table quiz_options        enable row level security;
alter table quiz_attempts       enable row level security;
alter table assignments         enable row level security;
alter table submissions         enable row level security;
alter table subscriptions       enable row level security;
alter table account_preferences enable row level security;
alter table cancellation_surveys enable row level security;
alter table notifications       enable row level security;

-- ---------- profiles ----------
create policy profiles_select on profiles for select to authenticated using (true);
create policy profiles_update_self on profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());
create policy profiles_staff_all on profiles for all to authenticated
  using (is_staff()) with check (is_staff());

-- ---------- content (courses / modules / lessons / resources) ----------
create policy courses_select on courses for select to authenticated
  using (is_published or is_staff());
create policy courses_staff_write on courses for all to authenticated
  using (is_staff()) with check (is_staff());

create policy modules_select on modules for select to authenticated
  using (is_staff() or exists (select 1 from courses c where c.id = course_id and c.is_published));
create policy modules_staff_write on modules for all to authenticated
  using (is_staff()) with check (is_staff());

create policy lessons_select on lessons for select to authenticated
  using (is_staff() or exists (
    select 1 from modules m join courses c on c.id = m.course_id
    where m.id = module_id and c.is_published));
create policy lessons_staff_write on lessons for all to authenticated
  using (is_staff()) with check (is_staff());

create policy resources_select on lesson_resources for select to authenticated
  using (is_staff() or exists (
    select 1 from lessons l join modules m on m.id = l.module_id
    join courses c on c.id = m.course_id
    where l.id = lesson_id and c.is_published));
create policy resources_staff_write on lesson_resources for all to authenticated
  using (is_staff()) with check (is_staff());

-- ---------- progress (own rows) ----------
create policy enroll_own on enrollments for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy progress_own on lesson_progress for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy notes_own on lesson_notes for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ---------- gamification ----------
create policy xp_rules_select on xp_rules for select to authenticated using (true);
create policy xp_rules_write on xp_rules for all to authenticated
  using (is_staff()) with check (is_staff());

create policy xp_events_own on xp_events for select to authenticated
  using (user_id = auth.uid() or is_staff());
-- inserts happen only through security-definer RPCs (award_xp), so no insert policy.

create policy achievements_select on achievements for select to authenticated using (true);
create policy achievements_write on achievements for all to authenticated
  using (is_staff()) with check (is_staff());

create policy user_ach_select on user_achievements for select to authenticated using (true);
create policy user_ach_staff on user_achievements for all to authenticated
  using (is_staff()) with check (is_staff());

create policy activity_own on activity_days for select to authenticated
  using (user_id = auth.uid() or is_staff());

-- ---------- community ----------
create policy channels_select on channels for select to authenticated using (true);
create policy channels_write on channels for all to authenticated
  using (is_staff()) with check (is_staff());

create policy posts_select on posts for select to authenticated using (true);
create policy posts_insert on posts for insert to authenticated
  with check (author_id = auth.uid());
create policy posts_update on posts for update to authenticated
  using (author_id = auth.uid() or is_staff())
  with check (author_id = auth.uid() or is_staff());
create policy posts_delete on posts for delete to authenticated
  using (author_id = auth.uid() or is_staff());

create policy reactions_select on post_reactions for select to authenticated using (true);
create policy reactions_own on post_reactions for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy comments_select on comments for select to authenticated using (true);
create policy comments_insert on comments for insert to authenticated
  with check (author_id = auth.uid());
create policy comments_delete on comments for delete to authenticated
  using (author_id = auth.uid() or is_staff());

-- ---------- events ----------
create policy events_select on events for select to authenticated using (true);
create policy events_write on events for all to authenticated
  using (is_staff()) with check (is_staff());
create policy rsvp_own on event_rsvps for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ---------- quizzes (answer key stays hidden) ----------
create policy quizzes_select on quizzes for select to authenticated using (true);
create policy quizzes_write on quizzes for all to authenticated
  using (is_staff()) with check (is_staff());
create policy questions_select on quiz_questions for select to authenticated using (true);
create policy questions_write on quiz_questions for all to authenticated
  using (is_staff()) with check (is_staff());
-- base options table: STAFF ONLY (contains is_correct). Students use quiz_options_public.
create policy options_staff on quiz_options for all to authenticated
  using (is_staff()) with check (is_staff());
create policy attempts_own on quiz_attempts for select to authenticated
  using (user_id = auth.uid() or is_staff());

-- column-safe options view for students (no is_correct)
create view quiz_options_public
  with (security_invoker = off) as
  select id, question_id, text, order_index from quiz_options;
grant select on quiz_options_public to authenticated;

-- ---------- assignments / submissions ----------
create policy assignments_select on assignments for select to authenticated using (true);
create policy assignments_write on assignments for all to authenticated
  using (is_staff()) with check (is_staff());

create policy submissions_read on submissions for select to authenticated
  using (student_id = auth.uid() or is_staff());
create policy submissions_insert on submissions for insert to authenticated
  with check (student_id = auth.uid());
create policy submissions_update on submissions for update to authenticated
  using (student_id = auth.uid() or is_staff())
  with check (student_id = auth.uid() or is_staff());

-- ---------- account & notifications ----------
create policy subs_read on subscriptions for select to authenticated
  using (user_id = auth.uid() or is_staff());
create policy subs_write on subscriptions for all to authenticated
  using (user_id = auth.uid() or is_staff())
  with check (user_id = auth.uid() or is_staff());

create policy prefs_own on account_preferences for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy surveys_insert on cancellation_surveys for insert to authenticated
  with check (user_id = auth.uid());
create policy surveys_staff on cancellation_surveys for select to authenticated
  using (is_staff());

create policy notif_read on notifications for select to authenticated
  using (user_id = auth.uid());
create policy notif_update on notifications for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy notif_staff_insert on notifications for insert to authenticated
  with check (is_staff());
