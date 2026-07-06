// src/lib/data/index.ts — נקודת הכניסה היחידה לשכבת הדאטה.
// בחירת provider לפי VITE_DATA_MODE; בפאזה 9 נוסף מימוש supabase והשורה הזו בלבד משתנה.
import type { DataClient } from "./types";
import { mockClient } from "./mock";

const mode = import.meta.env.VITE_DATA_MODE ?? "mock";

export const data: DataClient = mode === "supabase" ? mockClient : mockClient;

export * from "./types";
