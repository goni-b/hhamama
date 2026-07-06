// src/lib/copy.ts — מילון המיקרו-קופי הקנוני של "החממה" (פרק 1.4)
// מקור אמת יחיד לכל מחרוזת UI. אין להמציא וריאציות. אין אימוג'י.

export const copy = {
  // ברכות דשבורד לפי שעה — {name} מוחלף בשם הפרטי
  "greeting.morning": "בוקר טוב, {name}. החממה כבר פתוחה.",
  "greeting.noon": "צהריים טובים, {name}. יש זמן להשקיה קטנה?",
  "greeting.evening": "ערב טוב, {name}. השעה הכי טובה לצמוח בשקט.",
  "greeting.night": "לילה טוב, {name}. גם בלילה החממה מוארת.",

  // ניווט ראשי
  "nav.dashboard": "החממה שלי",
  "nav.myCourses": "הקורסים שלי",
  "nav.library": "ספריית הקורסים",
  "nav.community": "הקהילה",
  "nav.lives": "לייבים",
  "nav.journey": "המסע שלי",
  "nav.leaderboard": "טבלת המובילים",
  "nav.profile": "הפרופיל שלי",

  // CTAs
  "cta.continueWatching": "המשך מאיפה שעצרת",
  "cta.startCourse": "התחל את הצמיחה",
  "cta.resumeCourse": "המשך צפייה",
  "cta.nextLesson": "לשיעור הבא",
  "cta.markComplete": "סמן כהושלם",
  "cta.joinLive": "הצטרף ללייב",
  "cta.exploreLibrary": "גלה את ספריית הקורסים",

  // נקודות / רצף / דרגות
  "points.earned": "+{count} נקודות צמיחה",
  "streak.active": "רצף השקיה: {count} ימים",
  "streak.todayDone": "הושקה להיום. הרצף נשמר.",
  "streak.atRisk": "הרצף שלך מחכה להשקיה של היום.",
  "streak.broken": "הרצף נעצר — וזה בסדר. צמיחה היא לא קו ישר. מתחילים רצף חדש היום.",
  "level.up": "צמחת לדרגת {tier}",
  "level.progress": "עוד {count} נקודות צמיחה לדרגת {tier}",

  // מצבים ריקים
  "empty.myCourses": "עוד לא שתלת כלום. בחר קורס ראשון — משם הכל צומח.",
  "empty.communityFeed": "כאן עוד שקט. היה הראשון לפתוח שיחה.",
  "empty.notifications": "הכל מושקה ומטופל. אין התראות חדשות.",
  "empty.searchResults": "לא מצאנו את זה בחממה. נסה מילה אחרת.",

  // סטטוסים כלליים
  "state.locked": "נפתח בדרגת {tier}",
  "state.loading": "רק רגע, מכינים את החממה...",

  // הצלחות
  "success.lessonComplete": "שיעור הושלם. +20 נקודות צמיחה",
  "success.courseComplete": 'סיימת את "{course}". זה גדל ממש מול העיניים.',
  "success.profileSaved": "נשמר. הפרופיל שלך מעודכן.",
  "success.postPublished": "פורסם בקהילה.",

  // שגיאות
  "error.generic": "משהו השתבש אצלנו. נסה שוב, ואם זה חוזר — אנחנו כאן בקהילה.",
  "error.network": "נראה שאין חיבור. החממה מחכה — נסה לרענן.",
  "error.videoLoad": "הווידאו מתעכב. רענן את הדף או נסה שוב בעוד רגע.",
  "error.form": "חסר פרט קטן: {field}.",

  // אימות
  "auth.loginTitle": "ברוכים השבים לחממה",
  "auth.loginCta": "כניסה לחממה",
  "auth.logout": "יציאה (החממה נשארת פתוחה)",

  // Onboarding / לייב / נוכחות
  "onboarding.kitTitle": "ערכת השתילה שלך",
  "live.upcoming": "הלייב הבא: {topic} · {date}",
  "community.presence": "{count} חברים בחממה עכשיו",
} as const;

export type CopyKey = keyof typeof copy;

/** מחזיר מחרוזת קנונית עם החלפת פלייסהולדרים: t("points.earned", { count: 20 }) */
export function t(key: CopyKey, vars?: Record<string, string | number>): string {
  let s: string = copy[key];
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      s = s.replaceAll(`{${k}}`, String(v));
    }
  }
  return s;
}

/** ברכה לפי שעת היום (פרק 1.4, מחרוזות 1–4) */
export function greetingKey(hour = new Date().getHours()): CopyKey {
  if (hour >= 5 && hour < 12) return "greeting.morning";
  if (hour >= 12 && hour < 17) return "greeting.noon";
  if (hour >= 17 && hour < 22) return "greeting.evening";
  return "greeting.night";
}
