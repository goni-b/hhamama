// src/lib/data/mock/db.ts — מאגר ה-seed בזיכרון + עזרי persistence (פאזות 0–8)
import { stageForXp, type Profile } from "../types";

export const SESSION_KEY = "hachamama.session.v1";
export const PROFILE_KEY = "hachamama.profile.v1";

export function delay<T>(value: T, ms = 220): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function baseProfile(): Profile {
  const xp = 340;
  return {
    id: "u_noa",
    fullName: "נועה כהן",
    username: "noa-cohen",
    email: "noa@example.com",
    role: "student",
    avatarUrl: null,
    bio: "בעלת עסק לתכשיטים בעבודת יד, לומדת לשווק לבד.",
    xpTotal: xp,
    growthStage: stageForXp(xp),
    streakDays: 6,
    streakBest: 11,
    weeklyGoalMinutes: 90,
    preferredGender: "f",
    focusMode: false,
    onboardingCompleted: true,
    mustResetPassword: false,
    createdAt: "2026-05-02T09:00:00.000Z",
  };
}

/** חשבונות ה-seed (נטענים גם בפאזה 9 ל-Supabase) */
export const SEED_PROFILES: Profile[] = [
  baseProfile(),
  {
    id: "u_daniel",
    fullName: "דניאל לוי",
    username: "daniel-levi",
    email: "daniel@example.com",
    role: "student",
    avatarUrl: null,
    xpTotal: 1240,
    growthStage: stageForXp(1240),
    streakDays: 3,
    streakBest: 20,
    weeklyGoalMinutes: 120,
    preferredGender: "m",
    focusMode: false,
    onboardingCompleted: true,
    mustResetPassword: false,
    createdAt: "2026-04-11T09:00:00.000Z",
  },
  {
    id: "u_ron",
    fullName: "רון אברהם",
    username: "ron-avraham",
    email: "ron@example.com",
    role: "student",
    avatarUrl: null,
    xpTotal: 4780,
    growthStage: stageForXp(4780),
    streakDays: 0,
    streakBest: 41,
    weeklyGoalMinutes: 150,
    preferredGender: "m",
    focusMode: false,
    onboardingCompleted: true,
    mustResetPassword: false,
    createdAt: "2026-02-20T09:00:00.000Z",
  },
  {
    // חברה חדשה להדגמת הזרימה המלאה: איפוס סיסמה כפוי ← onboarding
    id: "u_new",
    fullName: "חברה חדשה",
    username: "new-member",
    email: "new@example.com",
    role: "student",
    avatarUrl: null,
    xpTotal: 0,
    growthStage: "seed",
    streakDays: 0,
    streakBest: 0,
    weeklyGoalMinutes: 90,
    preferredGender: "f",
    focusMode: false,
    onboardingCompleted: false,
    mustResetPassword: true,
    createdAt: "2026-07-04T09:00:00.000Z",
  },
  {
    id: "u_hofit",
    fullName: "חופית",
    username: "hofit",
    email: "hofit@hofitgoni.com",
    role: "super-admin",
    avatarUrl: null,
    xpTotal: 0,
    growthStage: "seed",
    streakDays: 0,
    streakBest: 0,
    weeklyGoalMinutes: 0,
    preferredGender: "f",
    focusMode: false,
    onboardingCompleted: true,
    mustResetPassword: false,
    createdAt: "2026-01-01T09:00:00.000Z",
  },
  {
    id: "u_goni",
    fullName: "גוני",
    username: "goni",
    email: "goni@hofitgoni.com",
    role: "super-admin",
    avatarUrl: null,
    xpTotal: 0,
    growthStage: "seed",
    streakDays: 0,
    streakBest: 0,
    weeklyGoalMinutes: 0,
    preferredGender: "m",
    focusMode: false,
    onboardingCompleted: true,
    mustResetPassword: false,
    createdAt: "2026-01-01T09:00:00.000Z",
  },
];

function isBrowser() {
  return typeof window !== "undefined" && !!window.localStorage;
}

/** הפרופיל הפעיל: מ-localStorage אם קיים, אחרת seed של נועה. */
export function loadProfile(): Profile {
  if (isBrowser()) {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    if (raw) {
      try {
        return JSON.parse(raw) as Profile;
      } catch {
        /* נופל ל-seed */
      }
    }
  }
  return baseProfile();
}

export function saveProfile(p: Profile): void {
  if (isBrowser()) window.localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
}

export function hasSession(): boolean {
  return isBrowser() && !!window.localStorage.getItem(SESSION_KEY);
}

export function setSession(userId: string): void {
  if (isBrowser()) window.localStorage.setItem(SESSION_KEY, userId);
}

export function clearSession(): void {
  if (isBrowser()) window.localStorage.removeItem(SESSION_KEY);
}
