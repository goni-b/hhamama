// src/lib/data/supabase/index.ts — Supabase implementation of the DataClient contract.
// Swapped in via src/lib/data/index.ts when VITE_DATA_MODE=supabase. No local state.
/* eslint-disable @typescript-eslint/no-explicit-any --
   PostgREST rows are untyped here; follow-up: adopt `supabase gen types typescript`
   and replace the any-casts with generated Row types. */
import { getSupabase } from "../../supabase/client";
import {
  DataError,
  type AccountPreferences,
  type Achievement,
  type AdminKpis,
  type AppNotification,
  type Assignment,
  type Comment,
  type Course,
  type CourseInput,
  type DataClient,
  type Enrollment,
  type Gender,
  type GrowthStage,
  type LeaderboardRow,
  type Lesson,
  type LessonInput,
  type LessonProgress,
  type LiveEvent,
  type Post,
  type Profile,
  type PublicProfile,
  type Quiz,
  type QuizInput,
  type QuizResult,
  type ReactionKind,
  type Role,
  type SearchResult,
  type Submission,
  type Subscription,
  type XpEventType,
  type XpRule,
} from "../types";

const sb = () => getSupabase();

/* ---------- helpers ---------- */
async function meId(): Promise<string> {
  const { data } = await sb().auth.getUser();
  if (!data.user) throw new DataError("unauthorized", "לא מחוברת");
  return data.user.id;
}

function fail(error: { message: string } | null, code: DataError["code"] = "generic"): never {
  throw new DataError(code, error?.message ?? "שגיאה");
}

const COURSE_SELECT = "*, modules(*, lessons(*, lesson_resources(*)))";

function mapProfile(r: any): Profile {
  return {
    id: r.id,
    fullName: r.full_name,
    username: r.username,
    email: r.email,
    role: r.role as Role,
    avatarUrl: r.avatar_url,
    bio: r.bio ?? undefined,
    xpTotal: r.xp_total,
    growthStage: r.growth_stage as GrowthStage,
    streakDays: r.streak_days,
    streakBest: r.streak_best,
    weeklyGoalMinutes: r.weekly_goal_minutes,
    preferredGender: (r.preferred_gender ?? null) as Gender,
    focusMode: r.focus_mode,
    onboardingCompleted: r.onboarding_completed,
    mustResetPassword: r.must_reset_password,
    createdAt: r.created_at,
  };
}

function mapLesson(r: any): Lesson {
  return {
    id: r.id,
    moduleId: r.module_id,
    title: r.title,
    description: r.description ?? null,
    durationSec: r.duration_sec,
    videoProvider: r.video_provider,
    videoId: r.video_id,
    orderIndex: r.order_index,
    resources: (r.lesson_resources ?? [])
      .slice()
      .map((x: any) => ({ id: x.id, title: x.title, kind: x.kind, url: x.url })),
    lockedReason: r.locked_reason ?? null,
  };
}

function mapCourse(r: any): Course {
  const modules = (r.modules ?? [])
    .slice()
    .sort((a: any, b: any) => a.order_index - b.order_index)
    .map((m: any) => ({
      id: m.id,
      courseId: m.course_id,
      title: m.title,
      orderIndex: m.order_index,
      lessons: (m.lessons ?? [])
        .slice()
        .sort((a: any, b: any) => a.order_index - b.order_index)
        .map(mapLesson),
    }));
  const lessons = modules.flatMap((m: any) => m.lessons);
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    description: r.description,
    thumbnailUrl: r.thumbnail_url ?? "",
    level: r.level,
    modules,
    lessonsCount: lessons.length,
    totalDurationMin: Math.round(
      lessons.reduce((s: number, l: Lesson) => s + l.durationSec, 0) / 60,
    ),
    isPublished: r.is_published,
    category: r.category ?? undefined,
    lockedReason: r.locked_reason ?? null,
  };
}

function mapPost(r: any, myId: string | null): Post {
  const reactions: Record<ReactionKind, number> = { grow: 0, gold: 0, precise: 0, lift: 0 };
  const mine: ReactionKind[] = [];
  for (const x of r.post_reactions ?? []) {
    reactions[x.kind as ReactionKind]++;
    if (myId && x.user_id === myId) mine.push(x.kind);
  }
  const a = r.author ?? {};
  return {
    id: r.id,
    authorId: r.author_id,
    authorName: a.full_name ?? "",
    authorUsername: a.username ?? "",
    authorAvatarUrl: a.avatar_url ?? null,
    authorStage: (a.growth_stage ?? "seed") as GrowthStage,
    authorRole: (a.role ?? "student") as Role,
    channel: r.channel,
    title: r.title ?? null,
    body: r.body,
    imageUrl: r.image_url ?? null,
    createdAt: r.created_at,
    pinned: r.pinned,
    reactions,
    myReactions: mine,
    commentsCount: r.comments?.[0]?.count ?? 0,
  };
}

function mapComment(r: any): Comment {
  const a = r.author ?? {};
  return {
    id: r.id,
    postId: r.post_id,
    authorId: r.author_id,
    authorName: a.full_name ?? "",
    authorUsername: a.username ?? "",
    authorAvatarUrl: a.avatar_url ?? null,
    authorStage: (a.growth_stage ?? "seed") as GrowthStage,
    body: r.body,
    createdAt: r.created_at,
  };
}

function mapEvent(r: any, myId: string | null): LiveEvent {
  return {
    id: r.id,
    title: r.title,
    description: r.description,
    startsAt: r.starts_at,
    durationMin: r.duration_min,
    hostName: r.host_name,
    status: r.status,
    recordingLessonId: r.recording_lesson_id ?? null,
    isRegistered: !!(r.event_rsvps ?? []).some((x: any) => x.user_id === myId),
  };
}

function mapSubmission(r: any): Submission {
  return {
    id: r.id,
    assignmentId: r.assignment_id,
    assignmentTitle: r.assignment?.title ?? "",
    studentId: r.student_id,
    studentName: r.student?.full_name ?? "",
    content: r.content,
    link: r.link ?? null,
    fileNames: r.file_paths ?? [],
    status: r.status,
    feedback: r.feedback ?? null,
    submittedAt: r.submitted_at,
  };
}

// posts→profiles is ambiguous (author FK + m2m via post_reactions) — name the FK.
const POST_SELECT =
  "*, author:profiles!posts_author_id_fkey(id,full_name,username,avatar_url,growth_stage,role), post_reactions(kind,user_id), comments(count)";
const COMMENT_SELECT = "*, author:profiles(id,full_name,username,avatar_url,growth_stage)";

/* ============================================================== */
export const supabaseClient: DataClient = {
  auth: {
    async signIn(email, password) {
      const { error } = await sb().auth.signInWithPassword({ email, password });
      if (error) throw new DataError("invalid_credentials", "אימייל או סיסמה שגויים");
      const id = await meId();
      const { data, error: pErr } = await sb().from("profiles").select("*").eq("id", id).single();
      if (pErr) fail(pErr);
      return mapProfile(data);
    },
    async signOut() {
      await sb().auth.signOut();
    },
    async getSession() {
      const { data: u } = await sb().auth.getUser();
      if (!u.user) return null;
      const { data } = await sb().from("profiles").select("*").eq("id", u.user.id).single();
      return data ? mapProfile(data) : null;
    },
    async updatePassword(newPassword) {
      const { error } = await sb().auth.updateUser({ password: newPassword });
      if (error) fail(error);
      const id = await meId();
      await sb().from("profiles").update({ must_reset_password: false }).eq("id", id);
    },
    async completeOnboarding(input) {
      const id = await meId();
      await sb()
        .from("profiles")
        .update({ weekly_goal_minutes: input.weeklyGoalMinutes, onboarding_completed: true })
        .eq("id", id);
      await sb().rpc("award_xp", { p_event: "profile_complete", p_ref: null });
      const { data } = await sb().from("profiles").select("*").eq("id", id).single();
      return mapProfile(data);
    },
  },

  courses: {
    async list(filter) {
      let ids: string[] | null = null;
      if (filter?.category === "mine") {
        const id = await meId();
        const { data } = await sb().from("enrollments").select("course_id").eq("user_id", id);
        ids = (data ?? []).map((e: any) => e.course_id);
        if (ids.length === 0) return [];
      }
      let q = sb().from("courses").select(COURSE_SELECT).eq("is_published", true);
      if (ids) q = q.in("id", ids);
      if (filter?.category && filter.category !== "all" && filter.category !== "mine")
        q = q.eq("category", filter.category);
      if (filter?.search)
        q = q.or(`title.ilike.%${filter.search}%,description.ilike.%${filter.search}%`);
      const { data, error } = await q;
      if (error) fail(error);
      return (data ?? []).map(mapCourse);
    },
    async getBySlug(slug) {
      const { data } = await sb()
        .from("courses")
        .select(COURSE_SELECT)
        .eq("slug", slug)
        .maybeSingle();
      return data ? mapCourse(data) : null;
    },
    async enroll(courseId) {
      const id = await meId();
      await sb().from("enrollments").upsert({ user_id: id, course_id: courseId });
    },
    async myEnrollments() {
      const id = await meId();
      const { data: enr } = await sb()
        .from("enrollments")
        .select("course_id, courses(id, modules(lessons(id)))")
        .eq("user_id", id);
      const { data: prog } = await sb()
        .from("lesson_progress")
        .select("lesson_id, completed_at, updated_at")
        .eq("user_id", id);
      const done = new Set(
        (prog ?? []).filter((p: any) => p.completed_at).map((p: any) => p.lesson_id),
      );
      const lastByTime = (prog ?? [])
        .slice()
        .sort((a: any, b: any) => +new Date(a.updated_at) - +new Date(b.updated_at));
      const result: Enrollment[] = [];
      for (const e of (enr ?? []) as any[]) {
        const lessonIds: string[] = (e.courses?.modules ?? []).flatMap((m: any) =>
          (m.lessons ?? []).map((l: any) => l.id),
        );
        const completed = lessonIds.filter((lid) => done.has(lid)).length;
        const last = [...lastByTime].reverse().find((p: any) => lessonIds.includes(p.lesson_id));
        result.push({
          courseId: e.course_id,
          startedAt: "",
          completedLessons: completed,
          totalLessons: lessonIds.length,
          lastLessonId: last?.lesson_id ?? null,
        });
      }
      return result;
    },
  },

  progress: {
    async getForCourse(courseId) {
      const { data: course } = await sb()
        .from("courses")
        .select("modules(lessons(id))")
        .eq("id", courseId)
        .maybeSingle();
      const ids: string[] = (course?.modules ?? []).flatMap((m: any) =>
        (m.lessons ?? []).map((l: any) => l.id),
      );
      if (ids.length === 0) return [];
      const id = await meId();
      const { data } = await sb()
        .from("lesson_progress")
        .select("*")
        .eq("user_id", id)
        .in("lesson_id", ids);
      return (data ?? []).map((p: any) => ({
        lessonId: p.lesson_id,
        positionSec: p.position_sec,
        watchedPct: p.watched_pct,
        completedAt: p.completed_at ?? null,
      }));
    },
    async savePosition(lessonId, positionSec) {
      await sb().rpc("save_lesson_position", { p_lesson: lessonId, p_position: positionSec });
    },
    async markComplete(lessonId) {
      const { data, error } = await sb().rpc("mark_lesson_complete", { p_lesson: lessonId });
      if (error) fail(error);
      return { xpAwarded: data?.xpAwarded ?? 0, unlockedLessonId: data?.unlockedLessonId ?? null };
    },
    async getNote(lessonId) {
      const id = await meId();
      const { data } = await sb()
        .from("lesson_notes")
        .select("body")
        .eq("user_id", id)
        .eq("lesson_id", lessonId)
        .maybeSingle();
      return data?.body ?? "";
    },
    async saveNote(lessonId, body) {
      const id = await meId();
      await sb()
        .from("lesson_notes")
        .upsert({ user_id: id, lesson_id: lessonId, body, updated_at: new Date().toISOString() });
    },
    async continueLearning() {
      const id = await meId();
      const { data: rows } = await sb()
        .from("lesson_progress")
        .select("lesson_id, position_sec, watched_pct, completed_at, updated_at")
        .eq("user_id", id)
        .is("completed_at", null)
        .order("updated_at", { ascending: false })
        .limit(1);
      const lessonId = rows?.[0]?.lesson_id as string | undefined;
      let progress: LessonProgress = rows?.[0]
        ? {
            lessonId: rows[0].lesson_id,
            positionSec: rows[0].position_sec,
            watchedPct: rows[0].watched_pct,
            completedAt: null,
          }
        : { lessonId: "", positionSec: 0, watchedPct: 0, completedAt: null };

      let course: Course | null = null;
      let lesson: Lesson | null = null;
      if (lessonId) {
        const found = await courseAndLessonById(lessonId);
        course = found?.course ?? null;
        lesson = found?.lesson ?? null;
      }
      if (!course || !lesson) {
        const { data: first } = await sb()
          .from("courses")
          .select(COURSE_SELECT)
          .eq("is_published", true)
          .order("created_at", { ascending: true })
          .limit(1)
          .maybeSingle();
        if (!first) return null;
        course = mapCourse(first);
        lesson = course.modules[0]?.lessons[0] ?? null;
        if (!lesson) return null;
        progress = { lessonId: lesson.id, positionSec: 0, watchedPct: 0, completedAt: null };
      }
      return { course, lesson, progress };
    },
  },

  gamification: {
    async awardXp(event, refId) {
      const { data, error } = await sb().rpc("award_xp", { p_event: event, p_ref: refId ?? null });
      if (error) fail(error);
      return {
        xpTotal: data?.xpTotal ?? 0,
        leveledUpTo: (data?.leveledUpTo ?? null) as GrowthStage | null,
      };
    },
    async getAchievements() {
      const id = await meId();
      const { data } = await sb()
        .from("achievements")
        .select("*, user_achievements(unlocked_at, user_id)")
        .order("hidden", { ascending: true });
      return (data ?? []).map((a: any): Achievement => {
        const mine = (a.user_achievements ?? []).find((u: any) => u.user_id === id);
        return {
          id: a.id,
          slug: a.slug,
          title: a.title,
          description: a.description,
          icon: a.icon,
          hidden: a.hidden,
          unlockedAt: mine?.unlocked_at ?? null,
        };
      });
    },
    async getLeaderboard(period) {
      const { data, error } = await sb().rpc("get_leaderboard", { p_period: period });
      if (error) fail(error);
      return (data ?? []).map((r: any): LeaderboardRow => ({
        rank: Number(r.rank),
        userId: r.user_id,
        fullName: r.full_name,
        username: r.username,
        avatarUrl: r.avatar_url,
        growthStage: r.growth_stage,
        xp: r.xp,
        isCurrentUser: r.is_current_user,
      }));
    },
    async getStreak() {
      const id = await meId();
      const { data: p } = await sb()
        .from("profiles")
        .select("streak_days, streak_best")
        .eq("id", id)
        .single();
      const { data: last } = await sb()
        .from("activity_days")
        .select("activity_date")
        .eq("user_id", id)
        .order("activity_date", { ascending: false })
        .limit(1)
        .maybeSingle();
      return {
        days: p?.streak_days ?? 0,
        best: p?.streak_best ?? 0,
        freezes: 1,
        lastActiveDate: last?.activity_date ?? new Date().toISOString().slice(0, 10),
      };
    },
  },

  community: {
    async listPosts(channel) {
      const id = (await sb().auth.getUser()).data.user?.id ?? null;
      let q = sb()
        .from("posts")
        .select(POST_SELECT)
        .order("pinned", { ascending: false })
        .order("created_at", { ascending: false });
      if (channel && channel !== "all") q = q.eq("channel", channel);
      const { data, error } = await q;
      if (error) fail(error);
      return (data ?? []).map((r: any) => mapPost(r, id));
    },
    async createPost(input) {
      const id = await meId();
      let imageUrl: string | null = null;
      if (input.imageFile) imageUrl = await uploadTo("post-images", id, input.imageFile);
      const { data, error } = await sb()
        .from("posts")
        .insert({
          author_id: id,
          channel: input.channel,
          title: input.title ?? null,
          body: input.body,
          image_url: imageUrl,
        })
        .select(POST_SELECT)
        .single();
      if (error) fail(error);
      await sb().rpc("award_xp", { p_event: "post_create", p_ref: data.id });
      return mapPost(data, id);
    },
    async toggleReaction(postId, kind) {
      await sb().rpc("toggle_reaction", { p_post: postId, p_kind: kind });
    },
    async listComments(postId) {
      const { data } = await sb()
        .from("comments")
        .select(COMMENT_SELECT)
        .eq("post_id", postId)
        .order("created_at", { ascending: true });
      return (data ?? []).map(mapComment);
    },
    async addComment(postId, body) {
      const id = await meId();
      const { data, error } = await sb()
        .from("comments")
        .insert({ post_id: postId, author_id: id, body })
        .select(COMMENT_SELECT)
        .single();
      if (error) fail(error);
      await sb().rpc("award_xp", { p_event: "comment_create", p_ref: postId });
      return mapComment(data);
    },
    async getPost(postId) {
      const id = (await sb().auth.getUser()).data.user?.id ?? null;
      const { data } = await sb().from("posts").select(POST_SELECT).eq("id", postId).maybeSingle();
      return data ? mapPost(data, id) : null;
    },
  },

  events: {
    async list() {
      const id = (await sb().auth.getUser()).data.user?.id ?? null;
      const { data } = await sb()
        .from("events")
        .select("*, event_rsvps(user_id)")
        .order("starts_at", { ascending: true });
      return (data ?? []).map((r: any) => mapEvent(r, id));
    },
    async get(eventId) {
      const id = (await sb().auth.getUser()).data.user?.id ?? null;
      const { data } = await sb()
        .from("events")
        .select("*, event_rsvps(user_id)")
        .eq("id", eventId)
        .maybeSingle();
      return data ? mapEvent(data, id) : null;
    },
    async rsvp(eventId) {
      const id = await meId();
      await sb().from("event_rsvps").upsert({ event_id: eventId, user_id: id });
    },
  },

  quizzes: {
    async getByModule(moduleId) {
      const { data } = await sb()
        .from("quizzes")
        .select("id")
        .eq("module_id", moduleId)
        .maybeSingle();
      return data ? this.get(data.id) : null;
    },
    async get(quizId) {
      const { data: quiz } = await sb().from("quizzes").select("*").eq("id", quizId).maybeSingle();
      if (!quiz) return null;
      const { data: questions } = await sb()
        .from("quiz_questions")
        .select("id, prompt, order_index")
        .eq("quiz_id", quizId)
        .order("order_index", { ascending: true });
      const qIds = (questions ?? []).map((q: any) => q.id);
      // options read from the column-safe view (no is_correct)
      const { data: options } = qIds.length
        ? await sb()
            .from("quiz_options_public")
            .select("id, question_id, text, order_index")
            .in("question_id", qIds)
            .order("order_index", { ascending: true })
        : { data: [] as any[] };
      return {
        id: quiz.id,
        moduleId: quiz.module_id,
        title: quiz.title,
        passScore: quiz.pass_score,
        questions: (questions ?? []).map((q: any) => ({
          id: q.id,
          prompt: q.prompt,
          options: (options ?? [])
            .filter((o: any) => o.question_id === q.id)
            .map((o: any) => ({ id: o.id, text: o.text })),
        })),
      } as Quiz;
    },
    async submitAttempt(quizId, answers) {
      const { data, error } = await sb().rpc("submit_quiz", { p_quiz: quizId, p_answers: answers });
      if (error) fail(error);
      return {
        score: data.score,
        passed: data.passed,
        perfect: data.perfect,
        xpAwarded: data.xpAwarded ?? 0,
        correctByQuestion: data.correctByQuestion ?? {},
      } as QuizResult;
    },
  },

  assignments: {
    async list() {
      const id = await meId();
      const { data } = await sb()
        .from("assignments")
        .select(
          "*, submissions(*, assignment:assignments(title), student:profiles!submissions_student_id_fkey(full_name))",
        )
        .order("due_at", { ascending: true });
      return (data ?? []).map((a: any): Assignment => {
        const mine = (a.submissions ?? []).find((s: any) => s.student_id === id);
        return {
          id: a.id,
          courseId: a.course_id,
          title: a.title,
          description: a.description,
          dueAt: a.due_at ?? null,
          mySubmission: mine ? mapSubmission({ ...mine, assignment: { title: a.title } }) : null,
        };
      });
    },
    async get(assignmentId) {
      const list = await this.list();
      return list.find((a) => a.id === assignmentId) ?? null;
    },
    async submit(assignmentId, input) {
      const id = await meId();
      const paths: string[] = [];
      for (const f of input.files ?? []) paths.push(await uploadTo("submissions", id, f));
      const { data, error } = await sb()
        .from("submissions")
        .upsert(
          {
            assignment_id: assignmentId,
            student_id: id,
            content: input.content,
            link: input.link ?? null,
            file_paths: paths,
            status: "pending",
          },
          { onConflict: "assignment_id,student_id" },
        )
        .select(
          "*, assignment:assignments(title), student:profiles!submissions_student_id_fkey(full_name)",
        )
        .single();
      if (error) fail(error);
      await sb().rpc("award_xp", { p_event: "assignment_submit", p_ref: assignmentId });
      return mapSubmission(data);
    },
    async mySubmissions() {
      const id = await meId();
      const { data } = await sb()
        .from("submissions")
        .select(
          "*, assignment:assignments(title), student:profiles!submissions_student_id_fkey(full_name)",
        )
        .eq("student_id", id)
        .order("submitted_at", { ascending: false });
      return (data ?? []).map(mapSubmission);
    },
  },

  profiles: {
    async getByUsername(username) {
      const { data: p } = await sb()
        .from("profiles")
        .select("*")
        .eq("username", username)
        .maybeSingle();
      if (!p) return null;
      const { data: ach } = await sb()
        .from("user_achievements")
        .select("achievements(id, slug, title, description, icon, hidden), unlocked_at")
        .eq("user_id", p.id)
        .limit(8);
      const { data: posts } = await sb()
        .from("posts")
        .select(POST_SELECT)
        .eq("author_id", p.id)
        .order("created_at", { ascending: false })
        .limit(3);
      return {
        id: p.id,
        fullName: p.full_name,
        username: p.username,
        avatarUrl: p.avatar_url,
        bio: p.bio ?? undefined,
        growthStage: p.growth_stage,
        xpTotal: p.xp_total,
        streakDays: p.streak_days,
        achievements: (ach ?? [])
          .filter((a: any) => a.achievements && !a.achievements.hidden)
          .map((a: any) => ({ ...a.achievements, unlockedAt: a.unlocked_at })),
        recentPosts: (posts ?? []).map((r: any) => mapPost(r, p.id)),
      } as PublicProfile;
    },
    async updateMe(input) {
      const id = await meId();
      const patch: Record<string, unknown> = {};
      if (input.fullName !== undefined) patch.full_name = input.fullName;
      if (input.bio !== undefined) patch.bio = input.bio;
      if (input.username !== undefined) patch.username = input.username;
      if (input.preferredGender !== undefined) patch.preferred_gender = input.preferredGender;
      if (input.avatarFile) patch.avatar_url = await uploadTo("avatars", id, input.avatarFile);
      const { data, error } = await sb()
        .from("profiles")
        .update(patch)
        .eq("id", id)
        .select("*")
        .single();
      if (error) fail(error);
      return mapProfile(data);
    },
  },

  notifications: {
    async list() {
      const id = await meId();
      const { data } = await sb()
        .from("notifications")
        .select("*")
        .eq("user_id", id)
        .order("created_at", { ascending: false });
      return (data ?? []).map((n: any): AppNotification => ({
        id: n.id,
        kind: n.kind,
        title: n.title,
        body: n.body,
        href: n.href ?? null,
        read: n.read,
        createdAt: n.created_at,
      }));
    },
    async unreadCount() {
      const id = await meId();
      const { count } = await sb()
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", id)
        .eq("read", false);
      return count ?? 0;
    },
    async markRead(notificationId) {
      await sb().from("notifications").update({ read: true }).eq("id", notificationId);
    },
    async markAllRead() {
      const id = await meId();
      await sb().from("notifications").update({ read: true }).eq("user_id", id).eq("read", false);
    },
    subscribe(onNew) {
      const client = sb();
      let channel: ReturnType<typeof client.channel> | null = null;
      client.auth.getUser().then(({ data }) => {
        if (!data.user) return;
        channel = client
          .channel("notifications")
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "notifications",
              filter: `user_id=eq.${data.user.id}`,
            },
            (payload) => {
              const n = payload.new as any;
              onNew({
                id: n.id,
                kind: n.kind,
                title: n.title,
                body: n.body,
                href: n.href ?? null,
                read: n.read,
                createdAt: n.created_at,
              });
            },
          )
          .subscribe();
      });
      return () => {
        if (channel) client.removeChannel(channel);
      };
    },
  },

  search: {
    async query(q, type) {
      const term = q.trim();
      if (!term) return [];
      const results: SearchResult[] = [];
      const want = (t: string) => !type || type === t;

      if (want("course")) {
        const { data } = await sb()
          .from("courses")
          .select("id, slug, title")
          .eq("is_published", true)
          .or(`title.ilike.%${term}%,description.ilike.%${term}%`)
          .limit(10);
        for (const c of data ?? [])
          results.push({
            id: c.id,
            type: "course",
            title: c.title,
            subtitle: "קורס",
            href: `/courses/${c.slug}`,
          });
      }
      if (want("lesson")) {
        const { data } = await sb()
          .from("lessons")
          .select("id, title, modules!inner(courses!inner(slug, title))")
          .ilike("title", `%${term}%`)
          .limit(10);
        for (const l of data ?? []) {
          const course = (l as any).modules?.courses;
          results.push({
            id: l.id,
            type: "lesson",
            title: l.title,
            subtitle: course?.title ?? "",
            href: `/learn/${course?.slug}/${l.id}`,
          });
        }
      }
      if (want("post")) {
        const { data } = await sb()
          .from("posts")
          .select("id, title, body, author:profiles!posts_author_id_fkey(full_name)")
          .or(`body.ilike.%${term}%,title.ilike.%${term}%`)
          .limit(10);
        for (const p of data ?? [])
          results.push({
            id: p.id,
            type: "post",
            title: (p as any).title ?? (p as any).body.slice(0, 40),
            subtitle: `מאת ${(p as any).author?.full_name ?? ""}`,
            href: `/community/post/${p.id}`,
          });
      }
      if (want("person")) {
        const { data } = await sb()
          .from("profiles")
          .select("id, full_name, username, growth_stage")
          .ilike("full_name", `%${term}%`)
          .limit(10);
        for (const p of data ?? [])
          results.push({
            id: p.id,
            type: "person",
            title: p.full_name,
            subtitle: p.username,
            href: `/profile/${p.username}`,
          });
      }
      return results.slice(0, 20);
    },
  },

  account: {
    async getSubscription() {
      const id = await meId();
      const { data } = await sb().from("subscriptions").select("*").eq("user_id", id).maybeSingle();
      return {
        status: data?.status ?? "active",
        planName: data?.plan_name ?? "מקום קבוע בחממה",
        currentPeriodEnd: data?.current_period_end ?? new Date().toISOString(),
        pausedUntil: data?.paused_until ?? null,
        discountUsed: data?.discount_used ?? false,
      } as Subscription;
    },
    async getPreferences() {
      const id = await meId();
      const { data: prefs } = await sb()
        .from("account_preferences")
        .select("*")
        .eq("user_id", id)
        .maybeSingle();
      const { data: p } = await sb()
        .from("profiles")
        .select("focus_mode, preferred_gender")
        .eq("id", id)
        .single();
      return {
        streakRestFriSat: prefs?.streak_rest_fri_sat ?? true,
        focusMode: p?.focus_mode ?? false,
        notifyReactions: prefs?.notify_reactions ?? true,
        notifyComments: prefs?.notify_comments ?? true,
        notifyLives: prefs?.notify_lives ?? true,
        notifyStreak: prefs?.notify_streak ?? true,
        preferredGender: (p?.preferred_gender ?? null) as Gender,
      } as AccountPreferences;
    },
    async updatePreferences(input) {
      const id = await meId();
      const prefsPatch: Record<string, unknown> = {};
      if (input.streakRestFriSat !== undefined)
        prefsPatch.streak_rest_fri_sat = input.streakRestFriSat;
      if (input.notifyReactions !== undefined) prefsPatch.notify_reactions = input.notifyReactions;
      if (input.notifyComments !== undefined) prefsPatch.notify_comments = input.notifyComments;
      if (input.notifyLives !== undefined) prefsPatch.notify_lives = input.notifyLives;
      if (input.notifyStreak !== undefined) prefsPatch.notify_streak = input.notifyStreak;
      if (Object.keys(prefsPatch).length)
        await sb().from("account_preferences").update(prefsPatch).eq("user_id", id);
      const profPatch: Record<string, unknown> = {};
      if (input.focusMode !== undefined) profPatch.focus_mode = input.focusMode;
      if (input.preferredGender !== undefined) profPatch.preferred_gender = input.preferredGender;
      if (Object.keys(profPatch).length) await sb().from("profiles").update(profPatch).eq("id", id);
      return this.getPreferences();
    },
    async submitCancellationSurvey(input) {
      const id = await meId();
      await sb()
        .from("cancellation_surveys")
        .insert({ user_id: id, reason: input.reason, free_text: input.freeText ?? null });
    },
    async cancelSubscription() {
      const id = await meId();
      await sb().from("subscriptions").update({ status: "canceled" }).eq("user_id", id);
    },
    async pauseSubscription() {
      const id = await meId();
      await sb()
        .from("subscriptions")
        .update({ status: "paused", paused_until: null })
        .eq("user_id", id);
    },
    async acceptDiscount() {
      const id = await meId();
      await sb()
        .from("subscriptions")
        .update({ status: "active", discount_used: true })
        .eq("user_id", id);
    },
  },

  admin: {
    async kpis() {
      const students = await countRows(
        sb().from("profiles").select("*", { count: "exact", head: true }).eq("role", "student"),
      );
      const canceled = await countRows(
        sb()
          .from("subscriptions")
          .select("*", { count: "exact", head: true })
          .eq("status", "canceled"),
      );
      const total = await countRows(
        sb().from("subscriptions").select("*", { count: "exact", head: true }),
      );
      const completed = await countRows(
        sb()
          .from("lesson_progress")
          .select("*", { count: "exact", head: true })
          .not("completed_at", "is", null),
      );
      const started = await countRows(
        sb().from("lesson_progress").select("*", { count: "exact", head: true }),
      );
      const churn = total ? Math.round((canceled / total) * 1000) / 10 : 0;
      const completion = started ? Math.round((completed / started) * 100) : 0;
      const flat = (v: number) => [v, v, v, v, v, v, v];
      return {
        activeMembers: { value: students, deltaPct: 0, spark: flat(students) },
        weeklyWatchMinutes: { value: 0, deltaPct: 0, spark: flat(0) },
        completionRate: { value: completion, deltaPct: 0, spark: flat(completion) },
        churnRate: { value: churn, deltaPct: 0, spark: flat(churn) },
      } as AdminKpis;
    },
    async listCourses() {
      const { data } = await sb()
        .from("courses")
        .select(COURSE_SELECT)
        .order("created_at", { ascending: true });
      return (data ?? []).map(mapCourse);
    },
    async getCourse(idOrSlug) {
      const isUuid = /^[0-9a-f-]{36}$/i.test(idOrSlug);
      const { data } = await sb()
        .from("courses")
        .select(COURSE_SELECT)
        .eq(isUuid ? "id" : "slug", idOrSlug)
        .maybeSingle();
      return data ? mapCourse(data) : null;
    },
    async addModule(courseId, title) {
      const { count } = await sb()
        .from("modules")
        .select("*", { count: "exact", head: true })
        .eq("course_id", courseId);
      await sb()
        .from("modules")
        .insert({ course_id: courseId, title, order_index: (count ?? 0) + 1 });
      const c = await this.getCourse(courseId);
      if (!c) throw new DataError("not_found", "קורס לא נמצא");
      return c;
    },
    async upsertCourse(input) {
      const row = {
        slug: input.slug,
        title: input.title,
        description: input.description,
        level: input.level,
        category: input.category ?? null,
        is_published: input.isPublished,
      };
      const q = input.id
        ? sb().from("courses").update(row).eq("id", input.id)
        : sb().from("courses").insert(row);
      const { data, error } = await q.select(COURSE_SELECT).single();
      if (error) fail(error);
      return mapCourse(data);
    },
    async upsertLesson(input) {
      const row = {
        module_id: input.moduleId,
        title: input.title,
        description: input.description ?? null,
        duration_sec: input.durationSec,
        video_provider: input.videoProvider,
        video_id: input.videoId,
        order_index: input.orderIndex,
      };
      const q = input.id
        ? sb().from("lessons").update(row).eq("id", input.id)
        : sb().from("lessons").insert(row);
      const { data, error } = await q.select("*").single();
      if (error) fail(error);

      // חומרי שיעור: replace-all כשהמערך מועבר
      if (input.resources) {
        const { error: delErr } = await sb()
          .from("lesson_resources")
          .delete()
          .eq("lesson_id", data.id);
        if (delErr) fail(delErr);
        if (input.resources.length) {
          const { error: insErr } = await sb()
            .from("lesson_resources")
            .insert(
              input.resources.map((r) => ({
                lesson_id: data.id,
                title: r.title,
                kind: r.kind,
                url: r.url,
              })),
            );
          if (insErr) fail(insErr);
        }
      }

      const { data: full, error: selErr } = await sb()
        .from("lessons")
        .select("*, lesson_resources(*)")
        .eq("id", data.id)
        .single();
      if (selErr) fail(selErr);
      return mapLesson(full);
    },
    async uploadMaterial(file) {
      const safe = file.name.replace(/[^\w.-]+/g, "_");
      const path = `${Date.now()}-${safe}`;
      const { error } = await sb()
        .storage.from("materials")
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (error) fail(error);
      const { data } = sb().storage.from("materials").getPublicUrl(path);
      return { url: data.publicUrl };
    },
    async listMembers(search) {
      let q = sb().from("profiles").select("*").order("created_at", { ascending: false });
      if (search) q = q.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
      const { data } = await q;
      return (data ?? []).map(mapProfile);
    },
    async resetPassword(userId) {
      const { data, error } = await sb().rpc("admin_reset_password", { p_user: userId });
      if (error) fail(error, "unauthorized");
      return { tempPassword: data.tempPassword };
    },
    async setRole(userId, role) {
      await sb().from("profiles").update({ role }).eq("id", userId);
    },
    async moderatePost(postId, action) {
      if (action === "delete") await sb().from("posts").delete().eq("id", postId);
      else await sb().from("posts").update({ pinned: true }).eq("id", postId);
    },
    subscriptions: {
      async createMember(input) {
        const { error } = await sb().rpc("admin_create_member", {
          p_email: input.email,
          p_full_name: input.fullName,
        });
        if (error) fail(error, "unauthorized");
      },
      async renew(userId) {
        const end = new Date();
        end.setDate(end.getDate() + 30);
        await sb()
          .from("subscriptions")
          .update({ status: "active", current_period_end: end.toISOString() })
          .eq("user_id", userId);
      },
      async pause(userId) {
        await sb().from("subscriptions").update({ status: "paused" }).eq("user_id", userId);
      },
      async cancel(userId) {
        await sb().from("subscriptions").update({ status: "canceled" }).eq("user_id", userId);
      },
    },
    submissionsQueue: {
      async list() {
        const { data } = await sb()
          .from("submissions")
          .select(
            "*, assignment:assignments(title), student:profiles!submissions_student_id_fkey(full_name)",
          )
          .eq("status", "pending")
          .order("submitted_at", { ascending: false });
        return (data ?? []).map(mapSubmission);
      },
      async review(id, action, feedback) {
        const { error } = await sb().rpc("admin_review_submission", {
          p_submission: id,
          p_action: action,
          p_feedback: feedback,
        });
        if (error) fail(error, "unauthorized");
      },
    },
    quizzes: {
      async upsert(input: QuizInput) {
        let quizId = input.id;
        if (quizId) {
          await sb()
            .from("quizzes")
            .update({ module_id: input.moduleId, title: input.title, pass_score: input.passScore })
            .eq("id", quizId);
          await sb().from("quiz_questions").delete().eq("quiz_id", quizId);
        } else {
          const { data, error } = await sb()
            .from("quizzes")
            .insert({ module_id: input.moduleId, title: input.title, pass_score: input.passScore })
            .select("id")
            .single();
          if (error) fail(error);
          quizId = data.id;
        }
        for (let qi = 0; qi < input.questions.length; qi++) {
          const q = input.questions[qi];
          const { data: qRow, error: qErr } = await sb()
            .from("quiz_questions")
            .insert({ quiz_id: quizId, prompt: q.prompt, order_index: qi + 1 })
            .select("id")
            .single();
          if (qErr) fail(qErr);
          await sb()
            .from("quiz_options")
            .insert(
              q.options.map((o, oi) => ({
                question_id: qRow.id,
                text: o.text,
                is_correct: o.correct,
                order_index: oi + 1,
              })),
            );
        }
        const full = await supabaseClient.quizzes.get(quizId!);
        if (!full) throw new DataError("generic", "quiz upsert failed");
        return full;
      },
    },
    events: {
      async upsert(input) {
        const row = {
          title: input.title,
          description: input.description,
          starts_at: input.startsAt,
          duration_min: input.durationMin,
          host_name: input.hostName,
        };
        const q = input.id
          ? sb().from("events").update(row).eq("id", input.id)
          : sb().from("events").insert(row);
        const { data, error } = await q.select("*, event_rsvps(user_id)").single();
        if (error) fail(error);
        return mapEvent(data, null);
      },
    },
    settings: {
      async getXpRules() {
        const { data } = await sb().from("xp_rules").select("*");
        return (data ?? []).map((r: any): XpRule => ({
          eventType: r.event_type as XpEventType,
          label: r.label,
          points: r.points,
          dailyCap: r.daily_cap ?? null,
        }));
      },
      async updateXpRule(rule) {
        await sb()
          .from("xp_rules")
          .update({ label: rule.label, points: rule.points, daily_cap: rule.dailyCap })
          .eq("event_type", rule.eventType);
      },
    },
  },
};

/* ---------- internal helpers ---------- */
async function uploadTo(bucket: string, userId: string, file: File): Promise<string> {
  const path = `${userId}/${Date.now()}-${file.name}`;
  const { error } = await sb().storage.from(bucket).upload(path, file, { upsert: true });
  if (error) fail(error);
  if (bucket === "submissions") return path; // private bucket: store the path
  return sb().storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

async function countRows(builder: any): Promise<number> {
  const { count } = await builder;
  return count ?? 0;
}

async function courseAndLessonById(
  lessonId: string,
): Promise<{ course: Course; lesson: Lesson } | null> {
  const { data: lrow } = await sb()
    .from("lessons")
    .select("module_id, modules!inner(course_id)")
    .eq("id", lessonId)
    .maybeSingle();
  const courseId = (lrow as any)?.modules?.course_id;
  if (!courseId) return null;
  const { data: course } = await sb()
    .from("courses")
    .select(COURSE_SELECT)
    .eq("id", courseId)
    .maybeSingle();
  if (!course) return null;
  const mapped = mapCourse(course);
  const lesson = mapped.modules.flatMap((m) => m.lessons).find((l) => l.id === lessonId) ?? null;
  if (!lesson) return null;
  return { course: mapped, lesson };
}
