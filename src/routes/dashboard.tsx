import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Flame } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ProgressBar, DifficultyBadge } from "@/components/pattern-ui";
import { useAuth, userMeta } from "@/lib/auth";
import { computeStats, useProgress } from "@/lib/progress";
import { pad2 } from "@/lib/patterns";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — VoxaVault" },
      { name: "description", content: "Your overall progress, streaks and next problem." },
      { property: "og:title", content: "Dashboard — VoxaVault" },
      { property: "og:description", content: "Your overall progress, streaks and next problem." },
    ],
  }),
  component: () => (
    <AppShell>
      <Dashboard />
    </AppShell>
  ),
});

function Dashboard() {
  const { user } = useAuth();
  const { rows, done } = useProgress();
  const s = computeStats(rows, done);
  const m = userMeta(user);

  const next = s.perPattern.find((p) => p.completed < p.total);
  const nextProblem = next?.pattern.problems.find((p) => !done.has(p.id));

  const stats = [
    ["Patterns Started", s.started],
    ["Patterns Completed", s.completed],
    ["Problems Solved", s.solved],
    ["Current Streak", `${s.current}d`],
    ["Longest Streak", `${s.longest}d`],
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">{new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</p>
        <h1 className="mt-2 text-4xl md:text-5xl">Welcome back, {m.firstName}.</h1>
      </div>

      <section className="paper p-6 md:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Overall progress</p>
            <p className="mt-3 font-serif text-5xl">
              {s.solved} <span className="text-2xl text-muted-foreground">/ {s.total}</span>
            </p>
          </div>
          <p className="font-mono text-4xl text-primary">{s.pct}%</p>
        </div>
        <ProgressBar value={s.pct} thick className="mt-6" />
      </section>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {stats.map(([k, v]) => (
          <div key={k} className="paper p-5">
            <p className="eyebrow">{k}</p>
            <p className="mt-3 flex items-center gap-1.5 font-serif text-3xl">
              {String(k).includes("Streak") && <Flame className="h-5 w-5 text-primary" />}
              {v}
            </p>
          </div>
        ))}
      </section>

      {next && nextProblem && (
        <section className="paper flex flex-col gap-5 p-6 md:flex-row md:items-center md:p-8">
          <div className="flex-1">
            <p className="eyebrow">Continue learning · Pattern {pad2(next.pattern.number)}</p>
            <h2 className="mt-2 text-3xl">{next.pattern.name}</h2>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              Problem {next.completed + 1}/{next.total}
            </p>
            <div className="mt-4 flex items-center gap-3">
              <span className="font-mono text-sm text-muted-foreground">{nextProblem.leetcode_number}</span>
              <span className="text-lg">{nextProblem.title}</span>
              <DifficultyBadge d={nextProblem.difficulty} />
            </div>
            <ProgressBar value={next.pct} className="mt-4 max-w-sm" />
          </div>
          <Link
            to="/patterns/$slug"
            params={{ slug: next.pattern.slug }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform hover:-translate-y-0.5"
          >
            Continue <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      )}

      <section>
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-2xl">Your patterns</h2>
          <Link to="/patterns" className="text-sm text-muted-foreground hover:text-primary">View roadmap →</Link>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {s.perPattern.map(({ pattern, completed, total, pct }) => (
            <Link key={pattern.slug} to="/patterns/$slug" params={{ slug: pattern.slug }} className="paper block p-4 transition-colors hover:border-primary/50">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-muted-foreground">{pad2(pattern.number)}</span>
                <span className="flex-1 truncate text-sm font-medium">{pattern.name}</span>
                <span className="font-mono text-xs text-muted-foreground">{completed}/{total}</span>
              </div>
              <ProgressBar value={pct} className="mt-3" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
