import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { ProblemRow, ProgressBar } from "@/components/pattern-ui";
import { useProgress } from "@/lib/progress";
import { patternBySlug, patterns, pad2 } from "@/lib/patterns";

export const Route = createFileRoute("/patterns/$slug")({
  loader: ({ params }) => {
    const pattern = patternBySlug.get(params.slug);
    if (!pattern) throw notFound();
    return { slug: pattern.slug, name: pattern.name, description: pattern.description };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Not found — VoxaVault" }, { name: "robots", content: "noindex" }] };
    const t = `${loaderData.name} Pattern — VoxaVault`;
    return {
      meta: [
        { title: t },
        { name: "description", content: loaderData.description },
        { property: "og:title", content: t },
        { property: "og:description", content: loaderData.description },
      ],
    };
  },
  component: () => (
    <AppShell>
      <PatternPage />
    </AppShell>
  ),
});

function Block({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="paper p-5">
      <p className="eyebrow">{title}</p>
      <ul className="mt-3 space-y-1.5 text-sm">
        {items.map((i) => (
          <li key={i} className="flex gap-2"><span className="text-primary">•</span>{i}</li>
        ))}
      </ul>
    </div>
  );
}

function PatternPage() {
  const { slug } = Route.useLoaderData();
  const pt = patternBySlug.get(slug)!;
  const { done, toggle } = useProgress();
  const c = pt.problems.filter((p) => done.has(p.id)).length;
  const prev = patterns[pt.number - 2];
  const next = patterns[pt.number];

  return (
    <div className="space-y-6">
      <div>
        <Link to="/patterns" className="eyebrow hover:text-primary">← Roadmap</Link>
        <p className="mt-6 font-mono text-sm text-primary">Pattern {pad2(pt.number)}</p>
        <h1 className="mt-1 text-5xl uppercase tracking-tight md:text-6xl">{pt.name}</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{pt.description}</p>
        <div className="mt-5 flex max-w-md items-center gap-3">
          <ProgressBar value={(c / pt.problems.length) * 100} />
          <span className="font-mono text-xs text-muted-foreground">{c}/{pt.problems.length}</span>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="paper flex flex-col justify-between p-5 md:col-span-1">
          <p className="eyebrow">Core idea</p>
          <p className="my-6 whitespace-pre text-center font-mono text-xl text-primary">{pt.core_idea}</p>
          <p className="font-mono text-xs text-muted-foreground">Complexity: <span className="text-foreground">{pt.complexity}</span></p>
        </div>
        <Block title="When to use" items={pt.when_to_use} />
        <Block title="Recognition signals" items={pt.recognition_signals} />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Block title="Common mistakes" items={pt.common_mistakes} />
        <div className="paper p-5">
          <p className="eyebrow">Mini cheat sheet</p>
          <pre className="mt-3 overflow-x-auto rounded-lg bg-secondary p-4 font-mono text-xs leading-relaxed">{pt.cheat_sheet}</pre>
        </div>
      </div>

      <section className="paper p-2">
        <div className="flex items-baseline justify-between px-3 pb-2 pt-3">
          <h2 className="text-2xl">Problem roadmap</h2>
          <span className="eyebrow">In order</span>
        </div>
        {pt.problems.map((p) => (
          <ProblemRow key={p.id} p={p} done={done.has(p.id)} onToggle={(v) => toggle(p.id, v)} />
        ))}
      </section>

      <div className="flex justify-between text-sm">
        {prev ? <Link to="/patterns/$slug" params={{ slug: prev.slug }} className="text-muted-foreground hover:text-primary">← {prev.name}</Link> : <span />}
        {next && <Link to="/patterns/$slug" params={{ slug: next.slug }} className="text-muted-foreground hover:text-primary">{next.name} →</Link>}
      </div>
    </div>
  );
}
