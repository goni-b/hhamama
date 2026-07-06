// src/routes/admin/members.tsx — ניהול חברים (פרק 3.4 §18)
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Search, KeyRound, Copy, UserPlus, RefreshCw } from "lucide-react";
import { data } from "../../lib/data";
import type { Profile, Role } from "../../lib/data/types";
import { tierName } from "../../lib/data/types";
import { GrowthRing } from "../../components/greenhouse/GrowthRing";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../../components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";

export const Route = createFileRoute("/admin/members")({
  component: MembersPage,
});

const ROLE_HE: Record<Role, string> = {
  "super-admin": "מנהלת-על",
  mentor: "מנטור",
  student: "תלמידה",
};

function genPassword() {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 10; i++) out += chars[(i * 7 + 11) % chars.length];
  return out;
}

function MembersPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Profile | null>(null);

  const {
    data: members,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["admin", "members", search],
    queryFn: () => data.admin.listMembers(search || undefined),
  });

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="label-mono">ניהול חברים</span>
          <h1 className="mt-1 text-h1 text-ink">החברים בחממה</h1>
        </div>
        <NewMemberDialog onCreated={() => refetch()} />
      </div>

      <div className="mb-4 flex items-center gap-2 rounded-md border border-line bg-bg-2 px-3 py-2 md:max-w-sm">
        <Search className="h-4 w-4 text-muted" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="חיפוש לפי שם או אימייל..."
          className="flex-1 bg-transparent text-small text-ink outline-none placeholder:text-muted-2"
        />
      </div>

      <div className="surface-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-small">
            <thead>
              <tr className="border-b border-line">
                {["חברה", "תפקיד", "דרגה", "XP", "רצף", ""].map((h, i) => (
                  <th key={i} className="px-4 py-3 text-start label-mono">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? [0, 1, 2, 3].map((i) => (
                    <tr key={i} className="border-b border-line-soft">
                      <td colSpan={6} className="px-4 py-3">
                        <div className="skeleton h-8 rounded" />
                      </td>
                    </tr>
                  ))
                : (members ?? []).map((m) => (
                    <tr
                      key={m.id}
                      className="cursor-pointer border-b border-line-soft transition-colors last:border-0 hover:bg-[color:var(--panel-2)]"
                      onClick={() => setSelected(m)}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <GrowthRing
                            size="sm"
                            tier={m.growthStage}
                            progress={0}
                            name={m.fullName}
                          />
                          <div>
                            <div className="font-medium text-ink">{m.fullName}</div>
                            <div className="font-mono text-[11px] text-muted">{m.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-ink-2">{ROLE_HE[m.role]}</td>
                      <td className="px-4 py-3 text-ink-2">{tierName(m.growthStage)}</td>
                      <td className="px-4 py-3 font-mono tabular text-ink-2">
                        {m.xpTotal.toLocaleString("en-US")}
                      </td>
                      <td className="px-4 py-3 font-mono tabular text-ink-2">{m.streakDays}</td>
                      <td className="px-4 py-3 text-end">
                        <button className="btn-ghost text-[12px]">נהל</button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>

      <MemberDrawer
        member={selected}
        onClose={() => setSelected(null)}
        onChanged={() => refetch()}
      />
    </div>
  );
}

function MemberDrawer({
  member,
  onClose,
  onChanged,
}: {
  member: Profile | null;
  onClose: () => void;
  onChanged: () => void;
}) {
  const [tempPw, setTempPw] = useState<string | null>(null);

  const reset = useMutation({
    mutationFn: () => data.admin.resetPassword(member!.id),
    onSuccess: (res) => {
      setTempPw(res.tempPassword);
      toast.success("נוצרה סיסמה זמנית חדשה");
    },
  });
  const setRole = useMutation({
    mutationFn: (role: Role) => data.admin.setRole(member!.id, role),
    onSuccess: () => {
      toast.success("התפקיד עודכן");
      onChanged();
    },
  });

  return (
    <Sheet
      open={!!member}
      onOpenChange={(o) => {
        if (!o) {
          onClose();
          setTempPw(null);
        }
      }}
    >
      <SheetContent side="left" className="w-[380px] border-line bg-panel">
        {member && (
          <>
            <SheetHeader>
              <SheetTitle className="text-ink">{member.fullName}</SheetTitle>
            </SheetHeader>
            <div className="mt-4 space-y-6">
              <div className="flex items-center gap-3">
                <GrowthRing
                  size="md"
                  tier={member.growthStage}
                  progress={0}
                  name={member.fullName}
                />
                <div>
                  <div className="font-mono text-[12px] text-muted">{member.email}</div>
                  <div className="mt-1 text-small text-ink-2">
                    דרגת {tierName(member.growthStage)} · {member.xpTotal.toLocaleString("en-US")}{" "}
                    XP
                  </div>
                </div>
              </div>

              {/* תפקיד */}
              <div>
                <span className="label-mono">תפקיד</span>
                <div className="mt-2 flex gap-2">
                  {(["student", "mentor", "super-admin"] as Role[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => setRole.mutate(r)}
                      className="rounded-md border px-3 py-1.5 text-[12px] transition-all"
                      style={{
                        borderColor: member.role === r ? "var(--accent)" : "var(--line)",
                        background: member.role === r ? "var(--accent-faint)" : "transparent",
                        color: member.role === r ? "var(--accent)" : "var(--ink-2)",
                      }}
                    >
                      {ROLE_HE[r]}
                    </button>
                  ))}
                </div>
              </div>

              {/* איפוס סיסמה */}
              <div>
                <span className="label-mono">אבטחה</span>
                <div className="mt-2">
                  {tempPw ? (
                    <div className="rounded-lg border border-[color:var(--accent-border)] bg-bg-2 p-3">
                      <div className="mb-2 text-[12px] text-muted">
                        סיסמה זמנית חדשה — העבירי לחברה:
                      </div>
                      <div className="flex items-center gap-2">
                        <code
                          dir="ltr"
                          className="flex-1 rounded bg-panel-2 px-3 py-2 text-start font-mono text-[15px] tracking-[0.12em] text-ink"
                        >
                          {tempPw}
                        </code>
                        <button
                          onClick={() => {
                            navigator.clipboard?.writeText(tempPw);
                            toast.success("הועתק");
                          }}
                          className="flex h-9 w-9 items-center justify-center rounded-md border border-line text-muted transition-colors hover:text-accent"
                          aria-label="העתקה"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => reset.mutate()}
                      disabled={reset.isPending}
                      className="btn-secondary inline-flex items-center gap-2 text-small"
                    >
                      {reset.isPending ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <KeyRound className="h-4 w-4" />
                      )}
                      איפוס סיסמה
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function NewMemberDialog({ onCreated }: { onCreated: () => void }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [pw, setPw] = useState(genPassword());
  const [created, setCreated] = useState(false);

  const create = useMutation({
    mutationFn: () => data.admin.subscriptions.createMember({ email, fullName: name }),
    onSuccess: () => {
      setCreated(true);
      toast.success("החברה נוצרה");
      onCreated();
    },
  });

  return (
    <Dialog
      onOpenChange={(o) => {
        if (!o) {
          setCreated(false);
          setEmail("");
          setName("");
          setPw(genPassword());
        }
      }}
    >
      <DialogTrigger asChild>
        <button className="btn-primary inline-flex items-center gap-2 text-small">
          <UserPlus className="h-4 w-4" />
          חברה חדשה
        </button>
      </DialogTrigger>
      <DialogContent className="glass-panel">
        <DialogHeader>
          <DialogTitle className="text-ink">יצירת גישה לחברה חדשה</DialogTitle>
        </DialogHeader>
        {created ? (
          <div className="space-y-3">
            <p className="text-small text-success">הגישה נוצרה. העבירי לחברה את פרטי הכניסה:</p>
            <div className="rounded-lg border border-line bg-bg-2 p-3 text-small">
              <div className="text-muted">
                אימייל:{" "}
                <span dir="ltr" className="font-mono text-ink">
                  {email}
                </span>
              </div>
              <div className="mt-1 text-muted">
                סיסמה זמנית:{" "}
                <span dir="ltr" className="font-mono tracking-[0.12em] text-ink">
                  {pw}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="mb-1.5 block text-small text-ink-2">שם מלא</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="שם החברה"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-small text-ink-2">אימייל</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="member@example.com"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-small text-ink-2">סיסמה זמנית</label>
              <div className="flex items-center gap-2">
                <code
                  dir="ltr"
                  className="flex-1 rounded bg-bg-2 px-3 py-2 text-start font-mono text-[15px] tracking-[0.12em] text-ink"
                >
                  {pw}
                </code>
                <button
                  onClick={() => setPw(genPassword())}
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-line text-muted transition-colors hover:text-accent"
                  aria-label="חדש"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            </div>
            <button
              onClick={() => email && name && create.mutate()}
              disabled={!email || !name || create.isPending}
              className="btn-primary w-full disabled:opacity-50"
            >
              יצירת גישה ושליחה
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
