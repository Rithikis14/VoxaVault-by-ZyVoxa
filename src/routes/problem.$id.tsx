import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ExternalLink, Youtube } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { CheckBox, DifficultyBadge } from "@/components/pattern-ui";
import { useProgress } from "@/lib/progress";
import { patternBySlug, problemById, pad2 } from "@/lib/patterns";

export const Route = createFileRoute("/problem/$id")({
  loader: ({ params }) => {
    const p = problemById.get(params.id);
    if (!p) throw notFound();
    return { id: p.id, title: p.title, num: p.leetcode_number };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Not found — VoxaVault" }, { name: "robots", content: "noindex" }] };
    const t = `${loaderData.num}. ${loaderData.title} — VoxaVault`;
    const d = `Practice LeetCode ${loaderData.num} ${loaderData.title} as part of its DSA pattern.`;
    return { meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }] };
  },
  component: () => (
    <AppShell>
      <ProblemPage />
    </AppShell>
  ),
});

function ProblemPage() {
  const { id } = Route.useLoaderData();
  const p = problemById.get(id)!;
  const pt = patternBySlug.get(p.pattern_slug)!;
  const { done, toggle } = useProgress();
  const isDone = done.has(p.id);

  return (
    <div className="mx-auto max-w-2xl">
      <Link to="/patterns/$slug" params={{ slug: pt.slug }} className="eyebrow hover:text-primary">
        ← {pad2(pt.number)} {pt.name}
      </Link>
      <div className="paper mt-6 p-8">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm text-muted-foreground">#{p.leetcode_number}</span>
          <DifficultyBadge d={p.difficulty} />
          <span className="ml-auto font-mono text-xs text-muted-foreground">{p.order_number}/{pt.problems.length} in pattern</span>
        </div>
        <h1 className="mt-4 text-4xl">{p.title}</h1>
        <label className="mt-8 flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-background p-4">
          <CheckBox checked={isDone} onChange={(v) => toggle(p.id, v)} label="Mark complete" />
          <span className="text-sm">{isDone ? "Solved. Nicely done." : "Mark as solved"}</span>
        </label>
        <div className="mt-6 flex flex-wrap gap-2">
          <a href={p.leetcode_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-2.5 text-sm text-background">
            Open on LeetCode <ExternalLink className="h-4 w-4" />
          </a>
          {p.youtube_url && (
            <a href={p.youtube_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm hover:border-primary">
              <Youtube className="h-4 w-4" /> Walkthroughs
            </a>
          )}
        </div>
        <div className="mt-8 border-t border-border pt-6">
          <p className="eyebrow">Pattern reminder</p>
          <p className="mt-3 font-mono text-primary">{pt.core_idea}</p>
          <p className="mt-2 text-sm text-muted-foreground">{pt.recognition_signals.join(" · ")}</p>
        </div>
      </div>
    </div>
  );
}
