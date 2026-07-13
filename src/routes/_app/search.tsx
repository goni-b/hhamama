// src/routes/_app/search.tsx — חיפוש (פרק 3.3 §16)
// כפילות מכוונת של ה-Command Palette לטובת mobile ו-deep-linking (/search?q=)
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  BookOpen,
  ChevronLeft,
  History,
  Library,
  MessageSquare,
  PlayCircle,
  Radio,
  Route as RouteIcon,
  Search,
  UserRound,
  Users,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { data } from "../../lib/data";
import type { SearchResult } from "../../lib/data/types";
import { copy } from "../../lib/copy";
import { EASE, revealUp, staggerContainer, useGatedVariants } from "../../lib/motion";
import { EmptyState } from "../../components/greenhouse/EmptyState";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";

type SearchPageParams = { q?: string };

export const Route = createFileRoute("/_app/search")({
  validateSearch: (search: Record<string, unknown>): SearchPageParams => ({
    q: typeof search.q === "string" && search.q.length > 0 ? search.q : undefined,
  }),
  component: SearchPage,
});

type TypeFilter = "all" | SearchResult["type"];

const FILTERS: { id: TypeFilter; label: string }[] = [
  { id: "all", label: "הכל" },
  { id: "course", label: "קורסים" },
  { id: "lesson", label: "שיעורים" },
  { id: "post", label: "פוסטים" },
  { id: "person", label: "אנשים" },
];

const TYPE_META: Record<SearchResult["type"], { label: string; icon: LucideIcon }> = {
  course: { label: "קורסים", icon: BookOpen },
  lesson: { label: "שיעורים", icon: PlayCircle },
  post: { label: "פוסטים", icon: MessageSquare },
  person: { label: "אנשים", icon: UserRound },
};

const SHORTCUTS = [
  {
    to: "/courses",
    label: copy["nav.library"],
    description: "כל הקורסים במקום אחד",
    icon: Library,
  },
  {
    to: "/community",
    label: copy["nav.community"],
    description: "שאלות, ניצחונות ושיחות",
    icon: Users,
  },
  { to: "/events", label: copy["nav.lives"], description: "הלייבים הקרובים וההקלטות", icon: Radio },
  {
    to: "/achievements",
    label: copy["nav.journey"],
    description: "הדרגות וההישגים שלך",
    icon: RouteIcon,
  },
] as const;

const RECENT_KEY = "hachamama.recentSearches";
const RESULT_ORDER: SearchResult["type"][] = ["course", "lesson", "post", "person"];

/** פיצול טקסט למקטעים לפי מונח החיפוש — להדגשה בזהב */
function splitByTerm(text: string, term: string): { part: string; hit: boolean }[] {
  const t = term.trim();
  if (!t || !text) return [{ part: text, hit: false }];
  const lowerText = text.toLowerCase();
  const lowerTerm = t.toLowerCase();
  const parts: { part: string; hit: boolean }[] = [];
  let i = 0;
  while (i < text.length) {
    const idx = lowerText.indexOf(lowerTerm, i);
    if (idx === -1) {
      parts.push({ part: text.slice(i), hit: false });
      break;
    }
    if (idx > i) parts.push({ part: text.slice(i, idx), hit: false });
    parts.push({ part: text.slice(idx, idx + t.length), hit: true });
    i = idx + t.length;
  }
  return parts;
}

function Highlighted({ text, term }: { text: string; term: string }) {
  const parts = useMemo(() => splitByTerm(text, term), [text, term]);
  return (
    <>
      {parts.map((p, i) =>
        p.hit ? (
          <mark
            key={i}
            className="font-bold"
            style={{ background: "transparent", color: "var(--accent)" }}
          >
            {p.part}
          </mark>
        ) : (
          <span key={i}>{p.part}</span>
        ),
      )}
    </>
  );
}

function SearchPage() {
  const { q: urlQ } = Route.useSearch();
  const router = useRouter();
  const [q, setQ] = useState(urlQ ?? "");
  const [filter, setFilter] = useState<TypeFilter>("all");
  const [recent, setRecent] = useState<string[]>([]);
  const debounced = useDebouncedValue(q, 300);
  const term = debounced.trim();
  const gated = useGatedVariants(revealUp);

  /* deep-linking — סנכרון המונח ל-?q= */
  useEffect(() => {
    router.navigate({ to: "/search", search: term ? { q: term } : {}, replace: true });
  }, [term, router]);

  /* חיפושים אחרונים — נטענים רק בדפדפן (אין localStorage ב-SSR) */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      if (!raw) return;
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setRecent(parsed.filter((x): x is string => typeof x === "string").slice(0, 6));
      }
    } catch {
      /* אחסון לא זמין — מתעלמים */
    }
  }, []);

  useEffect(() => {
    if (term.length < 2) return;
    setRecent((prev) => {
      const next = [term, ...prev.filter((x) => x !== term)].slice(0, 6);
      try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      } catch {
        /* אחסון לא זמין — מתעלמים */
      }
      return next;
    });
  }, [term]);

  const clearRecent = () => {
    setRecent([]);
    try {
      localStorage.removeItem(RECENT_KEY);
    } catch {
      /* אחסון לא זמין — מתעלמים */
    }
  };

  const {
    data: results,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["search", term, filter],
    queryFn: () => data.search.query(term, filter === "all" ? undefined : filter),
    enabled: term.length > 0,
    placeholderData: keepPreviousData,
  });

  const groups = useMemo(() => {
    const list = results ?? [];
    return RESULT_ORDER.map((type) => ({
      type,
      items: list.filter((r) => r.type === type),
    })).filter((g) => g.items.length > 0);
  }, [results]);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="relative mb-6">
        <span className="ghost-number" aria-hidden="true">
          16
        </span>
        <span className="label-mono">חיפוש</span>
        <h1 className="mt-1 text-h1 text-ink">מה מחפשים בחממה?</h1>
      </div>

      {/* שדה חיפוש ענק */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <div className="surface-card flex items-center gap-3 px-4 transition-colors focus-within:border-[color:var(--accent-border)]">
          <Search className="h-5 w-5 shrink-0 text-muted" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="קורס, שיעור, פוסט או חבר..."
            aria-label="חיפוש בחממה"
            className="h-14 w-full flex-1 bg-transparent text-body-lg text-ink outline-none placeholder:text-muted-2"
          />
          {q.length > 0 && (
            <button
              onClick={() => setQ("")}
              aria-label="ניקוי החיפוש"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted transition-colors hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* צ'יפים לסינון לפי סוג */}
        <div className="mt-4 flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className="rounded-full border px-4 py-1.5 text-small transition-all"
                style={{
                  borderColor: active ? "var(--accent)" : "var(--line)",
                  background: active ? "var(--accent-faint)" : "transparent",
                  color: active ? "var(--accent)" : "var(--ink-2)",
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </motion.div>

      <div className="mt-8">
        {!term ? (
          /* מצב התחלתי — חיפושים אחרונים + קיצורים פופולריים */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.08 }}
            className="space-y-8"
          >
            {recent.length > 0 && (
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <History className="h-4 w-4 text-muted" />
                    <span className="label-mono">חיפושים אחרונים</span>
                  </div>
                  <button
                    onClick={clearRecent}
                    className="text-small text-muted transition-colors hover:text-ink"
                  >
                    ניקוי
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recent.map((r) => (
                    <button
                      key={r}
                      onClick={() => setQ(r)}
                      className="rounded-full border border-line px-4 py-1.5 text-small text-ink-2 transition-colors hover:border-[color:var(--accent-border)] hover:text-ink"
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </section>
            )}

            <section>
              <span className="label-mono">קיצורים פופולריים</span>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {SHORTCUTS.map((s) => {
                  const Icon = s.icon;
                  return (
                    <Link
                      key={s.to}
                      to={s.to}
                      className="surface-card group flex items-center gap-3 p-4 transition-colors hover:border-[color:var(--accent-border)]"
                    >
                      <span
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md"
                        style={{ background: "var(--accent-faint)" }}
                      >
                        <Icon className="h-5 w-5 text-accent" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-body text-ink">{s.label}</span>
                        <span className="block truncate text-small text-muted">
                          {s.description}
                        </span>
                      </span>
                      <ChevronLeft className="h-4 w-4 shrink-0 text-muted-2 transition-transform group-hover:-translate-x-0.5" />
                    </Link>
                  );
                })}
              </div>
            </section>
          </motion.div>
        ) : isLoading ? (
          /* טעינה */
          <div className="space-y-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="space-y-2">
                <div className="skeleton h-4 w-24" />
                <div className="skeleton h-32 rounded-lg" />
              </div>
            ))}
          </div>
        ) : isError ? (
          /* שגיאה */
          <div className="surface-card p-8 text-center">
            <p className="text-body text-ink-2">{copy["error.generic"]}</p>
            <button onClick={() => refetch()} className="btn-secondary mt-4 text-small">
              נסה שוב
            </button>
          </div>
        ) : groups.length === 0 ? (
          /* אין תוצאות */
          <div className="surface-card">
            <EmptyState
              title={copy["empty.searchResults"]}
              description="אולי בקהילה מישהו יודע — שווה לפתוח שם שאלה."
              action={
                <Link to="/community" className="btn-primary text-small">
                  שאל בקהילה
                </Link>
              }
            />
          </div>
        ) : (
          /* תוצאות מקובצות לפי סוג */
          <div
            style={{
              opacity: isFetching ? 0.55 : 1,
              transition: "opacity 160ms var(--ease)",
            }}
          >
            <p className="mb-4 font-mono text-[11px] tabular text-muted">
              {(results ?? []).length} תוצאות
            </p>
            <motion.div
              className="space-y-6"
              variants={staggerContainer(0.06)}
              initial="hidden"
              animate="visible"
            >
              {groups.map((g) => {
                const meta = TYPE_META[g.type];
                const Icon = meta.icon;
                return (
                  <motion.section key={g.type} variants={gated}>
                    <div className="mb-2 flex items-center gap-2">
                      <Icon className="h-4 w-4 text-muted" />
                      <span className="label-mono">{meta.label}</span>
                      <span className="font-mono text-[11px] tabular text-muted-2">
                        {g.items.length}
                      </span>
                    </div>
                    <div className="surface-card divide-y divide-[color:var(--line-soft)] overflow-hidden">
                      {g.items.map((r) => (
                        <a
                          key={`${g.type}-${r.id}`}
                          href={r.href}
                          onClick={(e) => {
                            e.preventDefault();
                            void router.navigate({ to: r.href });
                          }}
                          className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[color:var(--panel-2)]"
                        >
                          <span
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md"
                            style={{ background: "var(--accent-faint)" }}
                          >
                            <Icon className="h-4 w-4 text-accent" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-body text-ink">
                              <Highlighted text={r.title} term={term} />
                            </span>
                            <span className="block truncate text-small text-muted">
                              {r.subtitle}
                            </span>
                          </span>
                          <ChevronLeft className="h-4 w-4 shrink-0 text-muted-2 transition-transform group-hover:-translate-x-0.5" />
                        </a>
                      ))}
                    </div>
                  </motion.section>
                );
              })}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
