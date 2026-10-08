import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ProblemRow, ProgressBar } from "@/components/pattern-ui";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useProgress } from "@/lib/progress";
import { patterns, pad2 } from "@/lib/patterns";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/patterns/")({
  head: () => ({
    meta: [
      { title: "Pattern Roadmap — VoxaVault" },
      { name: "description", content: "All 30 DSA patterns in order, with every problem, filters and search." },
      { property: "og:title", content: "Pattern Roadmap — VoxaVault" },
      { property: "og:description", content: "All 30 DSA patterns in order, with every problem." },
    ],
  }),
  component: () => (
    <AppShell>
      <Roadmap />
    </AppShell>
  ),
});

const filters = ["All", "Completed", "Incomplete", "Easy", "Medium", "Hard"] as const;

function Roadmap() {
  const { done, toggle } = useProgress();
  const [q, setQ] = useState("");
  const [f, setF] = useState<(typeof filters)[number]>("All");

  const groups = useMemo(() => {
    const t = q.trim().toLowerCase();
    return patterns
      .map((pt) => {
        const ptMatch = t && pt.name.toLowerCase().includes(t);
        const problems = pt.problems.filter((p) => {
          if (f === "Completed" && !done.has(p.id)) return false;
          if (f === "Incomplete" && done.has(p.id)) return false;
          if ((f === "Easy" || f === "Medium" || f === "Hard") && p.difficulty !== f) return false;
          if (!t || ptMatch) return true;
          return String(p.leetcode_number).startsWith(t) || p.title.toLowerCase().includes(t) || p.difficulty.toLowerCase() === t;
        });
        return { pt, problems };
      })
      .filter((g) => g.problems.length > 0);
  }, [q, f, done]);

  return (
    <div>
      <p className="eyebrow">Problem roadmap</p>
      <h1 className="mt-2 text-4xl md:text-5xl">Thirty patterns, in order.</h1>

      <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder='Try "125", "palindrome", "heap", "hard"'
            className="h-11 w-full rounded-xl border border-border bg-card pl-10 pr-3 text-sm outline-none focus:border-primary"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {filters.map((x) => (
            <button
              key={x}
              onClick={() => setF(x)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-xs transition-colors",
                f === x ? "border-foreground bg-foreground text-background" : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {x}
            </button>
          ))}
        </div>
      </div>

      <Accordion type="multiple" defaultValue={q ? groups.map((g) => g.pt.slug) : []} key={q + f} className="mt-6 space-y-2">
        {groups.map(({ pt, problems }) => {
          const c = pt.problems.filter((p) => done.has(p.id)).length;
          return (
            <AccordionItem key={pt.slug} value={pt.slug} className="paper border-b-0 px-2">
              <AccordionTrigger className="px-3 hover:no-underline">
                <div className="flex flex-1 items-center gap-4 pr-4">
                  <span className="font-mono text-sm text-muted-foreground">{pad2(pt.number)}</span>
                  <span className="font-serif text-lg">{pt.name}</span>
                  <div className="ml-auto hidden w-32 items-center gap-2 sm:flex">
                    <ProgressBar value={(c / pt.problems.length) * 100} />
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">{c}/{pt.problems.length}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-3">
                <div className="mb-2 flex items-center justify-between border-b border-border/60 px-3 pb-3">
                  <p className="text-sm text-muted-foreground">{pt.description}</p>
                  <Link to="/patterns/$slug" params={{ slug: pt.slug }} className="shrink-0 pl-4 text-xs text-primary hover:underline">
                    Cheat sheet →
                  </Link>
                </div>
                {problems.map((p) => (
                  <ProblemRow key={p.id} p={p} done={done.has(p.id)} onToggle={(v) => toggle(p.id, v)} />
                ))}
              </AccordionContent>
            </AccordionItem>
          );
        })}
        {groups.length === 0 && <p className="py-16 text-center text-sm text-muted-foreground">No problems match.</p>}
      </Accordion>
    </div>
  );
}
