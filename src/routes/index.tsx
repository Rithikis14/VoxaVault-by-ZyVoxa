import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/pattern-ui";
import { useAuth } from "@/lib/auth";
import { patterns, TOTAL_PROBLEMS, pad2 } from "@/lib/patterns";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VoxaVault — Learn the Pattern. Recognize It. Master It." },
      { name: "description", content: "Stop solving random problems. Master DSA through 30 carefully ordered patterns with progress tracking." },
      { property: "og:title", content: "VoxaVault — Master DSA by Pattern" },
      { property: "og:description", content: "30 ordered patterns, curated LeetCode problems, cheat sheets and progress tracking." },
    ],
  }),
  component: Landing,
});

const features = [
  [`${patterns.length}`, "Patterns", "Ordered from foundations to design."],
  [`${TOTAL_PROBLEMS}`, "Problems", "Curated, never random."],
  ["◐", "Progress Tracking", "Synced across every device."],
  ["{ }", "Cheat Sheets", "The core idea, in a few lines."],
  ["↗", "LeetCode Links", "One click to practice."],
  ["▶", "Video Walkthroughs", "When you need a second view."],
];

const flow = ["Pattern", "Problems", "Progress", "Mastery"];

function Landing() {
  const { user } = useAuth();
  const start = user ? "/dashboard" : "/login";
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex h-16 max-w-6xl items-center px-6">
        <Logo />
        <div className="ml-auto flex items-center gap-2">
          <Link to="/patterns" className="hidden rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground sm:block">Patterns</Link>
          <Link to={start} className="rounded-lg border border-border bg-card px-4 py-1.5 text-sm hover:border-primary">
            {user ? "Dashboard" : "Sign in"}
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-16 pt-14 md:pt-24">
        <p className="eyebrow">Learn the pattern · Recognize it · Master it</p>
        <h1 className="mt-6 text-6xl font-semibold leading-[0.95] md:text-8xl">
          Master DSA
          <br />
          <span className="italic text-primary">by pattern.</span>
        </h1>
        <div className="mt-8 grid max-w-xl gap-1 text-lg text-muted-foreground">
          <p className="text-foreground">Stop solving random problems.</p>
          <p>Learn patterns. Understand variations. Track progress. Master interviews.</p>
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link to={start} className="inline-flex items-center gap-2 rounded-xl bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform hover:-translate-y-0.5">
            Start Learning <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/patterns" className="inline-flex items-center rounded-xl border border-border bg-card px-6 py-3 text-sm font-medium hover:border-primary">
            Explore Patterns
          </Link>
        </div>

        {/* Flow illustration */}
        <div className="paper mt-20 overflow-hidden p-6 md:p-10">
          <div className="grid gap-6 md:grid-cols-4 md:gap-0">
            {flow.map((f, i) => (
              <div key={f} className="relative flex items-center gap-4 md:flex-col md:items-start">
                <div className="flex w-full items-center">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-border bg-background font-mono text-sm">
                    {pad2(i + 1)}
                  </span>
                  {i < flow.length - 1 && <span className="mx-3 hidden h-px flex-1 border-t border-dashed border-earth/60 md:block" />}
                </div>
                <div className="md:mt-4">
                  <p className="font-serif text-2xl">{f}</p>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">
                    {["two-pointers", "125 · 344 · 167", "▮▮▮▮▯▯ 64%", "recognized ✓"][i]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {features.map(([k, t, d]) => (
            <div key={t} className="bg-card p-7">
              <p className="font-mono text-2xl text-primary">{k}</p>
              <p className="mt-3 font-serif text-xl">{t}</p>
              <p className="mt-1 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <p className="eyebrow">The path</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {patterns.map((p) => (
            <Link
              key={p.slug}
              to="/patterns/$slug"
              params={{ slug: p.slug }}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-sm transition-colors hover:border-primary hover:text-primary"
            >
              <span className="mr-1.5 font-mono text-xs text-muted-foreground">{pad2(p.number)}</span>
              {p.name}
            </Link>
          ))}
        </div>
      </section>

      <footer className="border-t border-[#D8D0C5] bg-[#F7F4EE] dark:border-[#3A342F] dark:bg-[#1C1917]">
  <div className="mx-auto max-w-6xl px-6 py-10">

    <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">

      <div
        className="text-xl font-semibold tracking-[-0.03em]"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        <span className="text-[#2A211C] dark:text-[#F5F1EB]">VOXA</span>
        <span className="text-[#C96A3D]">VAULT</span>
      </div>

      <p className="text-sm text-[#756B63] dark:text-[#B8AEA5]">
        Learn the pattern. Recognize it. Master it.
      </p>

    </div>

    <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-[#DED7CE] pt-5 text-xs text-[#8A8179] dark:border-[#3A342F] dark:text-[#91877F] sm:flex-row">
      <p>© 2026 VoxaVault. Built for problem solvers.</p>

      <p className="font-mono tracking-wide">
        YOUR DSA JOURNEY STARTS HERE.
      </p>
    </div>

  </div>
</footer>
    </div>
  );
}
