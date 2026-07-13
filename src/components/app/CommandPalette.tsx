// src/components/app/CommandPalette.tsx — לוח פקודות גלובלי Ctrl+K / Cmd+K (פרק 3.2)
// קבוצות: המשך למידה / קורסים / שיעורים / פוסטים / אנשים / פעולות.
// Enter — ניווט; Escape — סגירה; במובייל הכניסה היא דרך עמוד /search.
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import {
  BookOpen,
  CornerDownLeft,
  Home,
  Library,
  MessageSquare,
  Play,
  PlayCircle,
  Radio,
  Route as RouteIcon,
  Search,
  Trophy,
  UserRound,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { data } from "../../lib/data";
import type { SearchResult } from "../../lib/data/types";
import { copy } from "../../lib/copy";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";

const TYPE_META: Record<SearchResult["type"], { label: string; icon: LucideIcon }> = {
  course: { label: "קורסים", icon: BookOpen },
  lesson: { label: "שיעורים", icon: PlayCircle },
  post: { label: "פוסטים", icon: MessageSquare },
  person: { label: "אנשים", icon: UserRound },
};

const RESULT_ORDER: SearchResult["type"][] = ["course", "lesson", "post", "person"];

const ACTIONS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/", label: copy["nav.dashboard"], icon: Home },
  { href: "/courses", label: copy["nav.library"], icon: Library },
  { href: "/community", label: copy["nav.community"], icon: Users },
  { href: "/events", label: copy["nav.lives"], icon: Radio },
  { href: "/achievements", label: copy["nav.journey"], icon: RouteIcon },
  { href: "/leaderboard", label: copy["nav.leaderboard"], icon: Trophy },
  { href: "/search", label: "עמוד החיפוש המלא", icon: Search },
];

/* עקיפת סגנון הבחירה של shadcn (bg-accent = זהב מלא) לטובת הדגשה עדינה */
const ITEM_CLS =
  "cursor-pointer gap-3 rounded-md px-2.5 py-2.5 data-[selected=true]:bg-[color:var(--accent-faint)] data-[selected=true]:text-[color:var(--ink)]";

const GROUP_CLS =
  "[&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.1em]";

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const debounced = useDebouncedValue(q, 300);
  const term = debounced.trim();

  /* Ctrl+K / Cmd+K — פתיחה וסגירה גלובלית (כולל מקלדת עברית — "ק") */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && !e.altKey && (e.key.toLowerCase() === "k" || e.key === "ק")) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  /* איפוס המונח בסגירה */
  useEffect(() => {
    if (!open) setQ("");
  }, [open]);

  const {
    data: results,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["search", "palette", term],
    queryFn: () => data.search.query(term),
    enabled: open && term.length > 0,
  });

  /* "המשך למידה" — אותו queryKey כמו בדשבורד, לשיתוף cache */
  const { data: continueItem } = useQuery({
    queryKey: ["continue"],
    queryFn: () => data.progress.continueLearning(),
    enabled: open,
    staleTime: 60_000,
  });

  const go = (href: string) => {
    onOpenChange(false);
    void router.navigate({ to: href });
  };

  const groups = useMemo(() => {
    const list = results ?? [];
    return RESULT_ORDER.map((type) => ({
      type,
      items: list.filter((r) => r.type === type),
    })).filter((g) => g.items.length > 0);
  }, [results]);

  const visibleActions = term ? ACTIONS.filter((a) => a.label.includes(term)) : ACTIONS;
  const hasResultsArea = term.length > 0;

  /* cmdk לא בוחר אוטומטית פריט ראשון כשהתוצאות נטענות אסינכרונית —
     שולטים ב-value ומאפסים לפריט הראשון בכל שינוי תוצאות, כדי ש-Enter תמיד יעבוד */
  const [selected, setSelected] = useState("");
  const firstValue = groups.length
    ? `${groups[0].type}-${groups[0].items[0].id}`
    : !term && continueItem
      ? "continue-learning"
      : visibleActions.length
        ? `action-${visibleActions[0].href}`
        : "";
  useEffect(() => {
    setSelected(firstValue);
  }, [firstValue]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby={undefined}
        className="top-[16%] max-w-xl translate-y-0 gap-0 overflow-hidden p-0"
      >
        <DialogTitle className="sr-only">חיפוש בחממה</DialogTitle>
        <Command shouldFilter={false} value={selected} onValueChange={setSelected}>
          <CommandInput
            value={q}
            onValueChange={setQ}
            placeholder="חיפוש קורס, שיעור, פוסט או חבר..."
          />
          <CommandList className="max-h-[400px] p-1.5">
            {/* טעינה */}
            {hasResultsArea && isLoading && (
              <div className="space-y-1.5 p-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="skeleton h-11 rounded-md" />
                ))}
              </div>
            )}

            {/* שגיאה */}
            {hasResultsArea && isError && (
              <div className="px-4 py-8 text-center">
                <p className="text-small text-ink-2">{copy["error.generic"]}</p>
                <button onClick={() => refetch()} className="btn-secondary mt-3 text-small">
                  נסה שוב
                </button>
              </div>
            )}

            {/* אין תוצאות */}
            {hasResultsArea &&
              !isLoading &&
              !isError &&
              groups.length === 0 &&
              visibleActions.length === 0 && (
                <div className="px-4 py-8 text-center">
                  <p className="text-small text-ink-2">{copy["empty.searchResults"]}</p>
                  <button
                    onClick={() => go("/community")}
                    className="mt-3 text-small text-accent transition-opacity hover:opacity-80"
                  >
                    אולי בקהילה מישהו יודע — שאל שם
                  </button>
                </div>
              )}

            {/* המשך למידה — במצב התחלתי בלבד */}
            {!term && continueItem && (
              <CommandGroup heading="המשך למידה" className={GROUP_CLS}>
                <CommandItem
                  value="continue-learning"
                  onSelect={() =>
                    go(`/learn/${continueItem.course.slug}/${continueItem.lesson.id}`)
                  }
                  className={ITEM_CLS}
                >
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
                    style={{ background: "var(--accent-faint)" }}
                  >
                    <Play className="h-4 w-4 fill-current text-accent" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-small text-ink">
                      {continueItem.lesson.title}
                    </span>
                    <span className="block truncate text-[11.5px] text-muted">
                      {continueItem.course.title}
                    </span>
                  </span>
                  {continueItem.progress.watchedPct > 0 && (
                    <span className="font-mono text-[10px] tabular text-muted">
                      {Math.round(continueItem.progress.watchedPct)}%
                    </span>
                  )}
                </CommandItem>
              </CommandGroup>
            )}

            {/* תוצאות מקובצות לפי סוג */}
            {!isLoading &&
              !isError &&
              groups.map((g) => {
                const meta = TYPE_META[g.type];
                const Icon = meta.icon;
                return (
                  <CommandGroup key={g.type} heading={meta.label} className={GROUP_CLS}>
                    {g.items.map((r) => (
                      <CommandItem
                        key={`${g.type}-${r.id}`}
                        value={`${g.type}-${r.id}`}
                        onSelect={() => go(r.href)}
                        className={ITEM_CLS}
                      >
                        <span
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
                          style={{ background: "var(--accent-faint)" }}
                        >
                          <Icon className="h-4 w-4 text-accent" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-small text-ink">{r.title}</span>
                          <span className="block truncate text-[11.5px] text-muted">
                            {r.subtitle}
                          </span>
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                );
              })}

            {/* פעולות — מעבר מהיר לעמודים */}
            {visibleActions.length > 0 && (
              <>
                {(groups.length > 0 || (!term && continueItem)) && (
                  <CommandSeparator className="my-1" />
                )}
                <CommandGroup heading="פעולות" className={GROUP_CLS}>
                  {visibleActions.map((a) => {
                    const Icon = a.icon;
                    return (
                      <CommandItem
                        key={a.href}
                        value={`action-${a.href}`}
                        onSelect={() => go(a.href)}
                        className={ITEM_CLS}
                      >
                        <Icon className="h-4 w-4 text-muted" />
                        <span className="text-small text-ink-2">{a.label}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </>
            )}
          </CommandList>

          {/* פוטר קיצורי מקלדת */}
          <div className="flex items-center gap-4 border-t px-4 py-2.5">
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-muted-2">
              <CornerDownLeft className="h-3 w-3" />
              מעבר
            </span>
            <span className="font-mono text-[10px] text-muted-2">Esc סגירה</span>
            <span className="font-mono text-[10px] text-muted-2">חצים לניווט</span>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
