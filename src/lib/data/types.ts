// src/lib/data/types.ts — החוזה המחייב של שכבת הדאטה (פרק 6.3)
// כל קומפוננטה צורכת דאטה אך ורק דרך הממשק הזה. פאזה 9 מחליפה מימוש בלבד.

export type Role = "super-admin" | "mentor" | "student";

// שש דרגות הצמיחה הקנוניות (פרק 1.3)
export type GrowthStage = "seed" | "sprout" | "sapling" | "blooming" | "tree" | "grower";

export type Gender = "f" | "m" | null;

export interface Profile {
  id: string;
  fullName: string;
  username: string;
  email: string;
  role: Role;
  avatarUrl: string | null;
  bio?: string;
  xpTotal: number;
  growthStage: GrowthStage;
  streakDays: number;
  streakBest: number;
  weeklyGoalMinutes: number;
  preferredGender: Gender;
  focusMode: boolean;
  onboardingCompleted: boolean;
  mustResetPassword: boolean;
  createdAt: string;
}

export interface PublicProfile {
  id: string;
  fullName: string;
  username: string;
  avatarUrl: string | null;
  bio?: string;
  growthStage: GrowthStage;
  xpTotal: number;
  streakDays: number;
  achievements: Achievement[];
  recentPosts: Post[];
}

export interface LessonResource {
  id: string;
  title: string;
  kind: "pdf" | "link" | "file";
  url: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  /** הטקסט שמוצג מתחת לווידאו בנגן */
  description?: string | null;
  durationSec: number;
  videoProvider: "youtube" | "vimeo" | "bunny";
  videoId: string;
  orderIndex: number;
  resources: LessonResource[];
  lockedReason?: string | null;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  orderIndex: number;
  lessons: Lesson[];
}

export type CourseLevel = "beginner" | "intermediate" | "advanced";

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  level: CourseLevel;
  modules: Module[];
  lessonsCount: number;
  totalDurationMin: number;
  isPublished: boolean;
  category?: string;
  lockedReason?: string | null;
}

export interface Enrollment {
  courseId: string;
  startedAt: string;
  completedLessons: number;
  totalLessons: number;
  lastLessonId: string | null;
}

export interface LessonProgress {
  lessonId: string;
  positionSec: number;
  watchedPct: number;
  completedAt: string | null;
}

// אירועי XP קנוניים (פרק 2.2 / 5.4)
export type XpEventType =
  | "lesson_complete"
  | "module_complete"
  | "course_complete"
  | "quiz_pass"
  | "quiz_perfect"
  | "assignment_submit"
  | "assignment_approved"
  | "post_create"
  | "comment_create"
  | "reaction_received"
  | "growing_answer"
  | "live_attend"
  | "recording_watch"
  | "daily_watering"
  | "watch_minutes"
  | "streak_milestone"
  | "profile_complete"
  | "weekly_survey"
  | "challenge_submit"
  | "spotlight"
  | "week_top3";

export interface Achievement {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string; // מזהה אייקון SVG (GrowthIcons / AchievementIcons)
  hidden: boolean;
  unlockedAt: string | null;
  progressHint?: string; // "עוד 2 שיעורים"
}

export interface LeaderboardRow {
  rank: number;
  userId: string;
  fullName: string;
  username: string;
  avatarUrl: string | null;
  growthStage: GrowthStage;
  xp: number;
  isCurrentUser: boolean;
}

export type ReactionKind = "grow" | "gold" | "precise" | "lift";

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatarUrl: string | null;
  authorStage: GrowthStage;
  authorRole: Role;
  channel: string;
  title: string | null;
  body: string;
  imageUrl: string | null;
  createdAt: string;
  pinned: boolean;
  reactions: Record<ReactionKind, number>;
  myReactions: ReactionKind[];
  commentsCount: number;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatarUrl: string | null;
  authorStage: GrowthStage;
  body: string;
  createdAt: string;
}

export interface LiveEvent {
  id: string;
  title: string;
  description: string;
  startsAt: string;
  durationMin: number;
  hostName: string;
  status: "upcoming" | "live" | "ended";
  recordingLessonId: string | null;
  isRegistered: boolean;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: { id: string; text: string }[];
}

export interface Quiz {
  id: string;
  moduleId: string;
  title: string;
  passScore: number;
  questions: QuizQuestion[];
}

export interface QuizResult {
  score: number;
  passed: boolean;
  perfect: boolean;
  xpAwarded: number;
  correctByQuestion: Record<string, string>; // questionId -> correct optionId
}

export type SubmissionStatus = "pending" | "needs_fix" | "approved";

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueAt: string | null;
  mySubmission: Submission | null;
}

export interface Submission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  studentId: string;
  studentName: string;
  content: string;
  link: string | null;
  fileNames: string[];
  status: SubmissionStatus;
  feedback: string | null;
  submittedAt: string;
}

export interface AppNotification {
  id: string;
  kind: "reaction" | "comment" | "level_up" | "achievement" | "live" | "system";
  title: string;
  body: string;
  href: string | null;
  read: boolean;
  createdAt: string;
}

export interface SearchResult {
  id: string;
  type: "course" | "lesson" | "post" | "person";
  title: string;
  subtitle: string;
  href: string;
}

export type SubscriptionStatus = "active" | "paused" | "canceled";

export interface Subscription {
  status: SubscriptionStatus;
  planName: string;
  currentPeriodEnd: string;
  pausedUntil: string | null;
  discountUsed: boolean;
}

export interface AccountPreferences {
  streakRestFriSat: boolean;
  focusMode: boolean;
  notifyReactions: boolean;
  notifyComments: boolean;
  notifyLives: boolean;
  notifyStreak: boolean;
  preferredGender: Gender;
}

export interface AdminKpis {
  activeMembers: { value: number; deltaPct: number; spark: number[] };
  weeklyWatchMinutes: { value: number; deltaPct: number; spark: number[] };
  completionRate: { value: number; deltaPct: number; spark: number[] };
  churnRate: { value: number; deltaPct: number; spark: number[] };
}

export interface CourseInput {
  id?: string;
  slug: string;
  title: string;
  description: string;
  level: CourseLevel;
  category?: string;
  isPublished: boolean;
}

export interface LessonResourceInput {
  title: string;
  kind: "pdf" | "link" | "file";
  url: string;
}

export interface LessonInput {
  id?: string;
  moduleId: string;
  title: string;
  description?: string;
  durationSec: number;
  videoProvider: "youtube" | "vimeo" | "bunny";
  videoId: string;
  orderIndex: number;
  /** כשמועבר — מחליף את כל חומרי השיעור (replace-all) */
  resources?: LessonResourceInput[];
}

export interface QuizInput {
  id?: string;
  moduleId: string;
  title: string;
  passScore: number;
  questions: {
    prompt: string;
    options: { text: string; correct: boolean }[];
  }[];
}

export interface EventInput {
  id?: string;
  title: string;
  description: string;
  startsAt: string;
  durationMin: number;
  hostName: string;
}

export interface XpRule {
  eventType: XpEventType;
  label: string;
  points: number;
  dailyCap: number | null;
}

/* ---------- שגיאה סטנדרטית ---------- */
export type DataErrorCode =
  "invalid_credentials" | "not_found" | "unauthorized" | "network" | "generic";

export class DataError extends Error {
  code: DataErrorCode;
  constructor(code: DataErrorCode, message: string) {
    super(message);
    this.name = "DataError";
    this.code = code;
  }
}

/* ---------- החוזה המרכזי ---------- */
export interface DataClient {
  auth: {
    signIn(email: string, password: string): Promise<Profile>;
    signOut(): Promise<void>;
    getSession(): Promise<Profile | null>;
    updatePassword(newPassword: string): Promise<void>;
    completeOnboarding(input: {
      goal: string;
      interests: string[];
      weeklyGoalMinutes: number;
    }): Promise<Profile>;
  };
  courses: {
    list(filter?: { search?: string; category?: string }): Promise<Course[]>;
    getBySlug(slug: string): Promise<Course | null>;
    enroll(courseId: string): Promise<void>;
    myEnrollments(): Promise<Enrollment[]>;
  };
  progress: {
    getForCourse(courseId: string): Promise<LessonProgress[]>;
    savePosition(lessonId: string, positionSec: number, deltaSec: number): Promise<void>;
    markComplete(lessonId: string): Promise<{ xpAwarded: number; unlockedLessonId: string | null }>;
    getNote(lessonId: string): Promise<string>;
    saveNote(lessonId: string, body: string): Promise<void>;
    continueLearning(): Promise<{
      course: Course;
      lesson: Lesson;
      progress: LessonProgress;
    } | null>;
  };
  gamification: {
    awardXp(
      event: XpEventType,
      refId?: string,
    ): Promise<{ xpTotal: number; leveledUpTo: GrowthStage | null }>;
    getAchievements(): Promise<Achievement[]>;
    getLeaderboard(period: "week" | "month" | "all"): Promise<LeaderboardRow[]>;
    getStreak(): Promise<{
      days: number;
      best: number;
      freezes: number;
      lastActiveDate: string;
    }>;
  };
  community: {
    listPosts(channel?: string): Promise<Post[]>;
    createPost(input: {
      body: string;
      channel: string;
      title?: string;
      imageFile?: File;
    }): Promise<Post>;
    toggleReaction(postId: string, kind: ReactionKind): Promise<void>;
    listComments(postId: string): Promise<Comment[]>;
    addComment(postId: string, body: string): Promise<Comment>;
    getPost(postId: string): Promise<Post | null>;
  };
  events: {
    list(): Promise<LiveEvent[]>;
    get(id: string): Promise<LiveEvent | null>;
    rsvp(eventId: string): Promise<void>;
  };
  quizzes: {
    getByModule(moduleId: string): Promise<Quiz | null>;
    get(quizId: string): Promise<Quiz | null>;
    submitAttempt(quizId: string, answers: Record<string, string>): Promise<QuizResult>;
  };
  assignments: {
    list(): Promise<Assignment[]>;
    get(id: string): Promise<Assignment | null>;
    submit(
      id: string,
      input: { content: string; link?: string; files?: File[] },
    ): Promise<Submission>;
    mySubmissions(): Promise<Submission[]>;
  };
  profiles: {
    getByUsername(username: string): Promise<PublicProfile | null>;
    updateMe(
      input: Partial<{
        fullName: string;
        bio: string;
        username: string;
        avatarFile: File;
        preferredGender: Exclude<Gender, null>;
      }>,
    ): Promise<Profile>;
  };
  notifications: {
    list(): Promise<AppNotification[]>;
    unreadCount(): Promise<number>;
    markRead(id: string): Promise<void>;
    markAllRead(): Promise<void>;
    subscribe(onNew: (n: AppNotification) => void): () => void;
  };
  search: {
    query(q: string, type?: "course" | "lesson" | "post" | "person"): Promise<SearchResult[]>;
  };
  account: {
    getSubscription(): Promise<Subscription>;
    getPreferences(): Promise<AccountPreferences>;
    updatePreferences(input: Partial<AccountPreferences>): Promise<AccountPreferences>;
    submitCancellationSurvey(input: { reason: string; freeText?: string }): Promise<void>;
    cancelSubscription(): Promise<void>;
    pauseSubscription(): Promise<void>;
    acceptDiscount(): Promise<void>;
  };
  admin: {
    kpis(): Promise<AdminKpis>;
    listCourses(): Promise<Course[]>;
    getCourse(idOrSlug: string): Promise<Course | null>;
    addModule(courseId: string, title: string): Promise<Course>;
    upsertCourse(input: CourseInput): Promise<Course>;
    upsertLesson(input: LessonInput): Promise<Lesson>;
    /** העלאת קובץ חומר-עזר ל-bucket הציבורי materials; מחזיר URL ציבורי */
    uploadMaterial(file: File): Promise<{ url: string }>;
    listMembers(search?: string): Promise<Profile[]>;
    resetPassword(userId: string): Promise<{ tempPassword: string }>;
    setRole(userId: string, role: Role): Promise<void>;
    moderatePost(postId: string, action: "delete" | "pin"): Promise<void>;
    subscriptions: {
      createMember(input: { email: string; fullName: string }): Promise<void>;
      renew(userId: string): Promise<void>;
      pause(userId: string): Promise<void>;
      cancel(userId: string): Promise<void>;
    };
    submissionsQueue: {
      list(): Promise<Submission[]>;
      review(id: string, action: "approve" | "needs_fix", feedback: string): Promise<void>;
    };
    quizzes: { upsert(input: QuizInput): Promise<Quiz> };
    events: { upsert(input: EventInput): Promise<LiveEvent> };
    settings: {
      getXpRules(): Promise<XpRule[]>;
      updateXpRule(rule: XpRule): Promise<void>;
    };
  };
}

/* ---------- דרגות: ספי XP קנוניים (פרק 1.3) ---------- */
export interface GrowthTierDef {
  stage: GrowthStage;
  name: string; // עברית
  min: number;
  max: number | null;
  perk: string;
}

export const GROWTH_TIERS: GrowthTierDef[] = [
  { stage: "seed", name: "זרע", min: 0, max: 149, perk: 'קורסי הליבה + "ערכת השתילה"' },
  { stage: "sprout", name: "נבט", min: 150, max: 599, perk: "ספריית הפרומפטים + תג בפרופיל" },
  {
    stage: "sapling",
    name: "שתיל",
    min: 600,
    max: 1799,
    perk: "ארכיון הלייבים + הצבעה על נושא הלייב",
  },
  {
    stage: "blooming",
    name: "פורח",
    min: 1800,
    max: 4499,
    perk: "Q&A בעדיפות + גישה מוקדמת 48 שעות",
  },
  { stage: "tree", name: "עץ", min: 4500, max: 9999, perk: 'פידבק אישי רבעוני + "שדרת העצים"' },
  { stage: "grower", name: "מצמיח", min: 10000, max: null, perk: '"מעגל המצמיחים" + תג זהב מלא' },
];

export function stageForXp(xp: number): GrowthStage {
  for (let i = GROWTH_TIERS.length - 1; i >= 0; i--) {
    if (xp >= GROWTH_TIERS[i].min) return GROWTH_TIERS[i].stage;
  }
  return "seed";
}

export function tierByStage(stage: GrowthStage): GrowthTierDef {
  return GROWTH_TIERS.find((t) => t.stage === stage) ?? GROWTH_TIERS[0];
}

export function tierName(stage: GrowthStage): string {
  return tierByStage(stage).name;
}

/** התקדמות (0–1) בתוך הדרגה הנוכחית, והכמות שנותרה לדרגה הבאה */
export function tierProgress(xp: number): {
  progress: number;
  toNext: number;
  nextStage: GrowthStage | null;
  nextName: string | null;
} {
  const idx = GROWTH_TIERS.findIndex((t) => t.stage === stageForXp(xp));
  const tier = GROWTH_TIERS[idx];
  const next = GROWTH_TIERS[idx + 1] ?? null;
  if (!next) return { progress: 1, toNext: 0, nextStage: null, nextName: null };
  const span = next.min - tier.min;
  const into = xp - tier.min;
  return {
    progress: Math.min(1, Math.max(0, into / span)),
    toNext: Math.max(0, next.min - xp),
    nextStage: next.stage,
    nextName: next.name,
  };
}
