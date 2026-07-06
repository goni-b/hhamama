// src/lib/data/mock/store.ts — מצב mutable (התקדמות, פוסטים, ריאקציות, הערות) עם localStorage
import type { Comment, LessonProgress, Post, ReactionKind } from "../types";

const K = {
  progress: "hachamama.progress.v1",
  posts: "hachamama.posts.v1",
  comments: "hachamama.comments.v1",
  notes: "hachamama.notes.v1",
};

function isBrowser() {
  return typeof window !== "undefined" && !!window.localStorage;
}

function read<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, val: T): void {
  if (isBrowser()) window.localStorage.setItem(key, JSON.stringify(val));
}

/* ---------- התקדמות בשיעורים ---------- */
export type ProgressMap = Record<string, LessonProgress>;

export function getProgress(): ProgressMap {
  return read<ProgressMap>(K.progress, {});
}
export function setLessonProgress(p: LessonProgress): void {
  const map = getProgress();
  map[p.lessonId] = p;
  write(K.progress, map);
}

/* ---------- פוסטים שנוצרו ע"י המשתמש ---------- */
export function getCreatedPosts(): Post[] {
  return read<Post[]>(K.posts, []);
}
export function addCreatedPost(p: Post): void {
  const arr = getCreatedPosts();
  arr.unshift(p);
  write(K.posts, arr);
}

/* ---------- ריאקציות (postId -> kind[]) ---------- */
type ReactionState = Record<string, ReactionKind[]>;
const RK = "hachamama.reactions.v1";
export function getMyReactions(): ReactionState {
  return read<ReactionState>(RK, {});
}
export function toggleReactionState(postId: string, kind: ReactionKind): ReactionKind[] {
  const state = getMyReactions();
  const cur = state[postId] ?? [];
  state[postId] = cur.includes(kind) ? cur.filter((k) => k !== kind) : [...cur, kind];
  write(RK, state);
  return state[postId];
}

/* ---------- תגובות (postId -> Comment[]) ---------- */
type CommentMap = Record<string, Comment[]>;
export function getComments(postId: string): Comment[] {
  return read<CommentMap>(K.comments, {})[postId] ?? [];
}
export function addComment(postId: string, c: Comment): void {
  const map = read<CommentMap>(K.comments, {});
  map[postId] = [...(map[postId] ?? []), c];
  write(K.comments, map);
}

/* ---------- הערות שיעור (lessonId -> text) ---------- */
type NotesMap = Record<string, string>;
export function getNote(lessonId: string): string {
  return read<NotesMap>(K.notes, {})[lessonId] ?? "";
}
export function setNote(lessonId: string, text: string): void {
  const map = read<NotesMap>(K.notes, {});
  map[lessonId] = text;
  write(K.notes, map);
}
