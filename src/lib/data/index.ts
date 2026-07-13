// src/lib/data/index.ts — נקודת הכניסה היחידה לשכבת הדאטה.
// בחירת provider לפי VITE_DATA_MODE. supabase = production; mock = פיתוח מקומי.
import type { DataClient } from "./types";
import { mockClient } from "./mock";
import { supabaseClient } from "./supabase";

const mode = import.meta.env.VITE_DATA_MODE ?? "supabase";

export const data: DataClient = mode === "mock" ? mockClient : supabaseClient;

export * from "./types";
