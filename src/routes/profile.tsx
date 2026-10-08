import { createFileRoute, Link } from "@tanstack/react-router";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { AppShell } from "@/components/app-shell";
import { ProgressBar } from "@/components/pattern-ui";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth, userMeta } from "@/lib/auth";
import { computeStats, useProgress } from "@/lib/progress";
import { problemById, pad2 } from "@/lib/patterns";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — VoxaVault" },
      { name: "description", content: "Your solved problems, pattern completion, streaks and recent activity." },
      { property: "og:title", content: "Profile — VoxaVault" },
      { property: "og:description", content: "Your DSA journey at a glance." },
    ],
  }),
  component: () => (
    <AppShell>
      <Profile />
    </AppShell>
  ),
});

function dayLabel(d: Date) {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  const diff = Math.round((t.getTime() - x.getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return x.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function Profile() {
  const { user } = useAuth();
  const m = userMeta(user);
  const { rows, done } = useProgress();
  const s = computeStats(rows, done);

  const chart = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    const k = d.toDateString();
    return { day: d.toLocaleDateString(undefined, { day: "numeric" }), solved: rows.filter((r) => new Date(r.completed_at).toDateString() === k).length };
  });

  const recent = [...rows].sort((a, b) => b.completed_at.localeCompare(a.completed_at)).slice(0, 12);
  const grouped = recent.reduce<Record<string, typeof recent>>((acc, r) => {
    const l = dayLabel(new Date(r.completed_at));
    (acc[l] ||= []).push(r);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <section className="paper flex flex-col items-start gap-5 p-6 sm:flex-row sm:items-center md:p-8">
        <Avatar className="h-20 w-20 border border-border">
          <AvatarImage src={m.avatar} alt={m.name} />
          <AvatarFallback className="bg-accent text-2xl text-accent-foreground">{m.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="text-4xl">{m.name}</h1>
          <p className="text-sm text-muted-foreground">{m.email}</p>
        </div>
        <div className="grid grid-cols-3 gap-6 text-center">
          {[["Solved", s.solved], ["Streak", `${s.current}d`], ["Best", `${s.longest}d`]].map(([k, v]) => (
            <div key={k}><p className="font-serif text-3xl">{v}</p><p className="eyebrow mt-1">{k}</p></div>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-5">
        <section className="paper p-6 lg:col-span-3">
          <p className="eyebrow">Problems solved · last 14 days</p>
          <div className="mt-4 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chart}>
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                <Tooltip cursor={{ fill: "var(--secondary)" }} contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 12 }} />
                <Bar dataKey="solved" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="paper p-6 lg:col-span-2">
          <p className="eyebrow">Recent activity</p>
          {recent.length === 0 && <p className="mt-6 text-sm text-muted-foreground">Nothing yet. <Link to="/patterns" className="text-primary">Solve your first problem →</Link></p>}
          <div className="mt-4 space-y-4">
            {Object.entries(grouped).map(([label, items]) => (
              <div key={label}>
                <p className="text-sm font-medium">{label}</p>
                <ul className="mt-1 space-y-1">
                  {items.map((r) => {
                    const p = problemById.get(r.problem_id);
                    return p ? (
                      <li key={r.problem_id} className="flex gap-2 text-sm text-muted-foreground">
                        <span className="text-success">✓</span>
                        <Link to="/problem/$id" params={{ id: p.id }} className="hover:text-primary">{p.title}</Link>
                      </li>
                    ) : null;
                  })}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="paper p-6">
        <p className="eyebrow">Pattern completion</p>
        <div className="mt-4 grid gap-x-8 gap-y-3 md:grid-cols-2">
          {s.perPattern.map(({ pattern, completed, total, pct }) => (
            <div key={pattern.slug} className="flex items-center gap-3">
              <span className="w-6 font-mono text-xs text-muted-foreground">{pad2(pattern.number)}</span>
              <span className="w-44 truncate text-sm">{pattern.name}</span>
              <ProgressBar value={pct} />
              <span className="w-10 text-right font-mono text-xs text-muted-foreground">{completed}/{total}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
