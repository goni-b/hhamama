// src/lib/data/mock/index.ts — מימוש mock מלא של DataClient (פאזות 0–8) מול seed + store
import {
  DataError,
  stageForXp,
  tierName,
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
  type QuizResult,
  type ReactionKind,
  type Role,
  type SearchResult,
  type Submission,
  type Subscription,
  type XpEventType,
  type XpRule,
} from "../types";
import {
  clearSession,
  delay,
  hasSession,
  loadProfile,
  saveProfile,
  SEED_PROFILES,
  setSession,
} from "./db";
import { ACHIEVEMENTS, COURSES, DAILY_TIP, EVENTS, NOTIFICATIONS, POSTS } from "./seed";
import {
  addComment as storeAddComment,
  addCreatedPost,
  getComments,
  getCreatedPosts,
  getMyReactions,
  getProgress,
  setLessonProgress,
  toggleReactionState,
} from "./store";

export { DAILY_TIP };

// עותק mutable של הקורסים — בונה הקורסים באדמין משנה אותו בזמן ריצה
const courses: Course[] = COURSES.map((c) => ({ ...c, modules: c.modules.map((m) => ({ ...m })) }));

function allLessons(): { lesson: Lesson; course: Course }[] {
  const out: { lesson: Lesson; course: Course }[] = [];
  for (const c of courses)
    for (const m of c.modules) for (const l of m.lessons) out.push({ lesson: l, course: c });
  return out;
}

function courseProgressPct(course: Course, progress: Record<string, LessonProgress>): number {
  const ids = course.modules.flatMap((m) => m.lessons.map((l) => l.id));
  if (ids.length === 0) return 0;
  const done = ids.filter((id) => progress[id]?.completedAt).length;
  return Math.round((done / ids.length) * 100);
}

// XP קנוני לפי סוג אירוע (פרק 2.2)
const XP_VALUES: Record<XpEventType, number> = {
  lesson_complete: 20,
  module_complete: 75,
  course_complete: 300,
  quiz_pass: 50,
  quiz_perfect: 25,
  assignment_submit: 60,
  assignment_approved: 40,
  post_create: 15,
  comment_create: 5,
  reaction_received: 2,
  growing_answer: 30,
  live_attend: 40,
  recording_watch: 15,
  daily_watering: 5,
  watch_minutes: 1,
  streak_milestone: 50,
  profile_complete: 25,
  weekly_survey: 10,
  challenge_submit: 150,
  spotlight: 100,
  week_top3: 50,
};

function applyXp(amount: number): { xpTotal: number; leveledUpTo: GrowthStage | null } {
  const p = loadProfile();
  const before = p.growthStage;
  const xpTotal = p.xpTotal + amount;
  const stage = stageForXp(xpTotal);
  saveProfile({ ...p, xpTotal, growthStage: stage });
  return { xpTotal, leveledUpTo: stage !== before ? stage : null };
}

function toPublic(p: Profile): PublicProfile {
  return {
    id: p.id,
    fullName: p.fullName,
    username: p.username,
    avatarUrl: p.avatarUrl,
    bio: p.bio,
    growthStage: p.growthStage,
    xpTotal: p.xpTotal,
    streakDays: p.streakDays,
    achievements: ACHIEVEMENTS.filter((a) => a.unlockedAt && !a.hidden).slice(0, 8),
    recentPosts: POSTS.filter((post) => post.authorId === p.id).slice(0, 3),
  };
}

function hydratePost(p: Post): Post {
  const mine = getMyReactions()[p.id] ?? [];
  return { ...p, myReactions: mine };
}

function findNextLesson(lessonId: string): string | null {
  const flat = allLessons().map((x) => x.lesson.id);
  const idx = flat.indexOf(lessonId);
  return idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : null;
}

export const mockClient: DataClient = {
  auth: {
    async signIn(email) {
      const found = SEED_PROFILES.find((p) => p.email.toLowerCase() === email.toLowerCase());
      if (!found) {
        await delay(null, 300);
        throw new DataError("invalid_credentials", "אימייל או סיסמה שגויים");
      }
      setSession(found.id);
      saveProfile(found);
      return delay(found);
    },
    async signOut() {
      clearSession();
      return delay(undefined);
    },
    async getSession() {
      if (!hasSession()) return delay(null);
      return delay(loadProfile());
    },
    async updatePassword() {
      const p = loadProfile();
      saveProfile({ ...p, mustResetPassword: false });
      return delay(undefined);
    },
    async completeOnboarding(input) {
      const p = loadProfile();
      const xpTotal = p.xpTotal + 25;
      const next: Profile = {
        ...p,
        weeklyGoalMinutes: input.weeklyGoalMinutes,
        onboardingCompleted: true,
        xpTotal,
        growthStage: stageForXp(xpTotal),
      };
      saveProfile(next);
      return delay(next);
    },
  },

  courses: {
    async list(filter) {
      let result = courses.filter((c) => c.isPublished);
      if (filter?.category && filter.category !== "all") {
        if (filter.category === "mine") {
          const prog = getProgress();
          result = result.filter((c) => courseProgressPct(c, prog) > 0);
        } else {
          result = result.filter((c) => c.category === filter.category);
        }
      }
      if (filter?.search) {
        const q = filter.search.trim();
        result = result.filter((c) => c.title.includes(q) || c.description.includes(q));
      }
      return delay(result);
    },
    async getBySlug(slug) {
      return delay(courses.find((c) => c.slug === slug) ?? null);
    },
    async enroll() {
      return delay(undefined);
    },
    async myEnrollments() {
      const prog = getProgress();
      const list: Enrollment[] = courses
        .map((c) => {
          const ids = c.modules.flatMap((m) => m.lessons.map((l) => l.id));
          const done = ids.filter((id) => prog[id]?.completedAt).length;
          const last = ids.filter((id) => prog[id]).pop() ?? null;
          return {
            courseId: c.id,
            startedAt: "",
            completedLessons: done,
            totalLessons: ids.length,
            lastLessonId: last,
          };
        })
        .filter((e) => e.completedLessons > 0 || e.lastLessonId);
      return delay(list);
    },
  },

  progress: {
    async getForCourse(courseId) {
      const course = courses.find((c) => c.id === courseId);
      if (!course) return delay<LessonProgress[]>([]);
      const prog = getProgress();
      const ids = course.modules.flatMap((m) => m.lessons.map((l) => l.id));
      return delay(ids.map((id) => prog[id]).filter(Boolean));
    },
    async savePosition(lessonId, positionSec) {
      const prog = getProgress();
      const existing = prog[lessonId];
      const found = allLessons().find((x) => x.lesson.id === lessonId);
      const dur = found?.lesson.durationSec ?? 600;
      const watchedPct = Math.min(100, Math.round((positionSec / dur) * 100));
      setLessonProgress({
        lessonId,
        positionSec,
        watchedPct: Math.max(watchedPct, existing?.watchedPct ?? 0),
        completedAt: existing?.completedAt ?? (watchedPct >= 90 ? new Date().toISOString() : null),
      });
      return delay(undefined);
    },
    async markComplete(lessonId) {
      const prog = getProgress();
      const already = !!prog[lessonId]?.completedAt;
      setLessonProgress({
        lessonId,
        positionSec: prog[lessonId]?.positionSec ?? 0,
        watchedPct: 100,
        completedAt: prog[lessonId]?.completedAt ?? new Date().toISOString(),
      });
      if (!already) applyXp(XP_VALUES.lesson_complete);
      return delay({
        xpAwarded: already ? 0 : XP_VALUES.lesson_complete,
        unlockedLessonId: findNextLesson(lessonId),
      });
    },
    async continueLearning() {
      const prog = getProgress();
      // שיעור אחרון עם התקדמות שלא הושלם; אם אין — השיעור הראשון של הקורס הראשון
      const flat = allLessons();
      const inProgress = flat
        .filter((x) => prog[x.lesson.id] && !prog[x.lesson.id].completedAt)
        .pop();
      const target = inProgress ?? flat[0];
      if (!target) return delay(null);
      const p = prog[target.lesson.id] ?? {
        lessonId: target.lesson.id,
        positionSec: 0,
        watchedPct: 0,
        completedAt: null,
      };
      return delay({ course: target.course, lesson: target.lesson, progress: p });
    },
  },

  gamification: {
    async awardXp(event, _refId) {
      return delay(applyXp(XP_VALUES[event] ?? 0));
    },
    async getAchievements() {
      return delay<Achievement[]>(ACHIEVEMENTS);
    },
    async getLeaderboard() {
      const me = loadProfile();
      const rows = SEED_PROFILES.filter((p) => p.role === "student")
        .map((p) => (p.id === me.id ? me : p))
        .sort((a, b) => b.xpTotal - a.xpTotal)
        .map((p, i) => ({
          rank: i + 1,
          userId: p.id,
          fullName: p.fullName,
          username: p.username,
          avatarUrl: p.avatarUrl,
          growthStage: p.growthStage,
          xp: p.xpTotal,
          isCurrentUser: p.id === me.id,
        })) as LeaderboardRow[];
      return delay(rows);
    },
    async getStreak() {
      const p = loadProfile();
      return delay({
        days: p.streakDays,
        best: p.streakBest,
        freezes: 1,
        lastActiveDate: new Date().toISOString().slice(0, 10),
      });
    },
  },

  community: {
    async listPosts(channel) {
      const all = [...getCreatedPosts(), ...POSTS].map(hydratePost);
      const sorted = all.sort(
        (a, b) =>
          (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) ||
          +new Date(b.createdAt) - +new Date(a.createdAt),
      );
      const filtered =
        channel && channel !== "all" ? sorted.filter((p) => p.channel === channel) : sorted;
      return delay(filtered);
    },
    async createPost(input) {
      const p = loadProfile();
      const post: Post = {
        id: `p_${Date.now()}`,
        authorId: p.id,
        authorName: p.fullName,
        authorUsername: p.username,
        authorAvatarUrl: p.avatarUrl,
        authorStage: p.growthStage,
        authorRole: p.role,
        channel: input.channel,
        title: input.title ?? null,
        body: input.body,
        imageUrl: null,
        createdAt: new Date().toISOString(),
        pinned: false,
        reactions: { grow: 0, gold: 0, precise: 0, lift: 0 },
        myReactions: [],
        commentsCount: 0,
      };
      addCreatedPost(post);
      applyXp(XP_VALUES.post_create);
      return delay(post);
    },
    async toggleReaction(postId, kind) {
      toggleReactionState(postId, kind);
      return delay(undefined);
    },
    async listComments(postId) {
      return delay(getComments(postId));
    },
    async addComment(postId, body) {
      const p = loadProfile();
      const c: Comment = {
        id: `c_${Date.now()}`,
        postId,
        authorId: p.id,
        authorName: p.fullName,
        authorUsername: p.username,
        authorAvatarUrl: p.avatarUrl,
        authorStage: p.growthStage,
        body,
        createdAt: new Date().toISOString(),
      };
      storeAddComment(postId, c);
      applyXp(XP_VALUES.comment_create);
      return delay(c);
    },
    async getPost(postId) {
      const all = [...getCreatedPosts(), ...POSTS].map(hydratePost);
      return delay(all.find((p) => p.id === postId) ?? null);
    },
  },

  events: {
    async list() {
      return delay<LiveEvent[]>(EVENTS);
    },
    async get() {
      return delay<LiveEvent | null>(null);
    },
    async rsvp() {
      return delay(undefined);
    },
  },

  quizzes: {
    async getByModule() {
      return delay<Quiz | null>(null);
    },
    async get() {
      return delay<Quiz | null>(null);
    },
    async submitAttempt() {
      return delay<QuizResult>({
        score: 0,
        passed: false,
        perfect: false,
        xpAwarded: 0,
        correctByQuestion: {},
      });
    },
  },

  assignments: {
    async list() {
      return delay<Assignment[]>([]);
    },
    async get() {
      return delay<Assignment | null>(null);
    },
    async submit(id, input) {
      const p = loadProfile();
      const s: Submission = {
        id: `s_${Date.now()}`,
        assignmentId: id,
        assignmentTitle: "",
        studentId: p.id,
        studentName: p.fullName,
        content: input.content,
        link: input.link ?? null,
        fileNames: (input.files ?? []).map((f) => f.name),
        status: "pending",
        feedback: null,
        submittedAt: new Date().toISOString(),
      };
      return delay(s);
    },
    async mySubmissions() {
      return delay<Submission[]>([]);
    },
  },

  profiles: {
    async getByUsername(username) {
      const found = SEED_PROFILES.find((p) => p.username === username);
      return delay<PublicProfile | null>(found ? toPublic(found) : null);
    },
    async updateMe(input) {
      const p = loadProfile();
      const next: Profile = {
        ...p,
        fullName: input.fullName ?? p.fullName,
        bio: input.bio ?? p.bio,
        username: input.username ?? p.username,
        preferredGender: input.preferredGender ?? p.preferredGender,
      };
      saveProfile(next);
      return delay(next);
    },
  },

  notifications: {
    async list() {
      return delay<AppNotification[]>(NOTIFICATIONS);
    },
    async unreadCount() {
      return delay(NOTIFICATIONS.filter((n) => !n.read).length);
    },
    async markRead(id) {
      const n = NOTIFICATIONS.find((x) => x.id === id);
      if (n) n.read = true;
      return delay(undefined);
    },
    async markAllRead() {
      NOTIFICATIONS.forEach((n) => (n.read = true));
      return delay(undefined);
    },
    subscribe() {
      return () => {};
    },
  },

  search: {
    async query(q) {
      const term = q.trim();
      if (!term) return delay<SearchResult[]>([]);
      const results: SearchResult[] = [];
      for (const c of courses) {
        if (c.title.includes(term) || c.description.includes(term))
          results.push({
            id: c.id,
            type: "course",
            title: c.title,
            subtitle: "קורס",
            href: `/courses/${c.slug}`,
          });
      }
      for (const { lesson: l, course } of allLessons()) {
        if (l.title.includes(term))
          results.push({
            id: l.id,
            type: "lesson",
            title: l.title,
            subtitle: course.title,
            href: `/learn/${course.slug}/${l.id}`,
          });
      }
      for (const post of [...getCreatedPosts(), ...POSTS]) {
        if (post.body.includes(term) || (post.title ?? "").includes(term))
          results.push({
            id: post.id,
            type: "post",
            title: post.title ?? post.body.slice(0, 40),
            subtitle: `מאת ${post.authorName}`,
            href: `/community/post/${post.id}`,
          });
      }
      for (const p of SEED_PROFILES) {
        if (p.fullName.includes(term))
          results.push({
            id: p.id,
            type: "person",
            title: p.fullName,
            subtitle: `דרגת ${tierName(p.growthStage)}`,
            href: `/profile/${p.username}`,
          });
      }
      return delay(results.slice(0, 20));
    },
  },

  account: {
    async getSubscription() {
      return delay<Subscription>({
        status: "active",
        planName: "מקום קבוע בחממה",
        currentPeriodEnd: "2026-08-02T00:00:00.000Z",
        pausedUntil: null,
        discountUsed: false,
      });
    },
    async getPreferences() {
      const p = loadProfile();
      return delay<AccountPreferences>({
        streakRestFriSat: true,
        focusMode: p.focusMode,
        notifyReactions: true,
        notifyComments: true,
        notifyLives: true,
        notifyStreak: true,
        preferredGender: p.preferredGender,
      });
    },
    async updatePreferences(input) {
      const p = loadProfile();
      saveProfile({
        ...p,
        focusMode: input.focusMode ?? p.focusMode,
        preferredGender: input.preferredGender ?? p.preferredGender,
      });
      return this.getPreferences();
    },
    async submitCancellationSurvey() {
      return delay(undefined);
    },
    async cancelSubscription() {
      return delay(undefined);
    },
    async pauseSubscription() {
      return delay(undefined);
    },
    async acceptDiscount() {
      return delay(undefined);
    },
  },

  admin: {
    async kpis() {
      return delay<AdminKpis>({
        activeMembers: { value: 128, deltaPct: 12, spark: [88, 94, 101, 107, 114, 121, 128] },
        weeklyWatchMinutes: {
          value: 3420,
          deltaPct: 8,
          spark: [2600, 2810, 3010, 2950, 3180, 3300, 3420],
        },
        completionRate: { value: 64, deltaPct: 5, spark: [52, 55, 58, 57, 60, 62, 64] },
        churnRate: { value: 3.2, deltaPct: -1, spark: [5.1, 4.8, 4.4, 4.0, 3.7, 3.4, 3.2] },
      });
    },
    async listCourses() {
      return delay(courses);
    },
    async getCourse(idOrSlug: string) {
      return delay(courses.find((c) => c.id === idOrSlug || c.slug === idOrSlug) ?? null);
    },
    async addModule(courseId: string, title: string) {
      const course = courses.find((c) => c.id === courseId);
      if (!course) throw new DataError("not_found", "קורס לא נמצא");
      course.modules.push({
        id: `m_${Date.now()}`,
        courseId,
        title,
        orderIndex: course.modules.length + 1,
        lessons: [],
      });
      return delay(course);
    },
    async upsertCourse(input: CourseInput) {
      const existing = input.id ? courses.find((c) => c.id === input.id) : undefined;
      if (existing) {
        Object.assign(existing, {
          title: input.title,
          description: input.description,
          level: input.level,
          category: input.category,
          isPublished: input.isPublished,
          slug: input.slug,
        });
        return delay(existing);
      }
      const c: Course = {
        id: `c_${Date.now()}`,
        slug: input.slug,
        title: input.title,
        description: input.description,
        thumbnailUrl: "",
        level: input.level,
        modules: [],
        lessonsCount: 0,
        totalDurationMin: 0,
        isPublished: input.isPublished,
        category: input.category,
        lockedReason: null,
      };
      courses.push(c);
      return delay(c);
    },
    async upsertLesson(input: LessonInput) {
      const mod = courses.flatMap((c) => c.modules).find((m) => m.id === input.moduleId);
      if (!mod) throw new DataError("not_found", "מודול לא נמצא");
      const existing = input.id ? mod.lessons.find((l) => l.id === input.id) : undefined;
      if (existing) {
        Object.assign(existing, {
          title: input.title,
          durationSec: input.durationSec,
          videoProvider: input.videoProvider,
          videoId: input.videoId,
          orderIndex: input.orderIndex,
        });
        return delay(existing);
      }
      const l: Lesson = {
        id: `l_${Date.now()}`,
        moduleId: input.moduleId,
        title: input.title,
        durationSec: input.durationSec,
        videoProvider: input.videoProvider,
        videoId: input.videoId,
        orderIndex: mod.lessons.length + 1,
        resources: [],
        lockedReason: null,
      };
      mod.lessons.push(l);
      const course = courses.find((c) => c.modules.some((m) => m.id === mod.id));
      if (course) course.lessonsCount += 1;
      return delay(l);
    },
    async listMembers(search) {
      let list = [...SEED_PROFILES];
      if (search)
        list = list.filter((p) => p.fullName.includes(search) || p.email.includes(search));
      return delay(list);
    },
    async resetPassword() {
      const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
      let pw = "";
      for (let i = 0; i < 10; i++) pw += chars[Math.floor((i * 7 + 13) % chars.length)];
      return delay({ tempPassword: pw });
    },
    async setRole(userId: string, role: Role) {
      const m = SEED_PROFILES.find((p) => p.id === userId);
      if (m) m.role = role;
      return delay(undefined);
    },
    async moderatePost() {
      return delay(undefined);
    },
    subscriptions: {
      async createMember() {
        return delay(undefined);
      },
      async renew() {
        return delay(undefined);
      },
      async pause() {
        return delay(undefined);
      },
      async cancel() {
        return delay(undefined);
      },
    },
    submissionsQueue: {
      async list() {
        return delay<Submission[]>([]);
      },
      async review() {
        return delay(undefined);
      },
    },
    quizzes: {
      async upsert() {
        throw new DataError("generic", "not implemented");
      },
    },
    events: {
      async upsert() {
        throw new DataError("generic", "not implemented");
      },
    },
    settings: {
      async getXpRules() {
        const labels: Partial<Record<XpEventType, string>> = {
          lesson_complete: "השלמת שיעור",
          module_complete: "השלמת מודול",
          course_complete: "השלמת קורס",
          quiz_pass: "מעבר מבחן",
          post_create: "פרסום פוסט",
          comment_create: "תגובה",
          live_attend: "השתתפות בלייב",
          daily_watering: "השקיה יומית",
        };
        const rules: XpRule[] = (Object.keys(labels) as XpEventType[]).map((k) => ({
          eventType: k,
          label: labels[k]!,
          points: XP_VALUES[k],
          dailyCap: k === "daily_watering" ? 5 : null,
        }));
        return delay(rules);
      },
      async updateXpRule() {
        return delay(undefined);
      },
    },
  },
};
