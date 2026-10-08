import { Link } from "@tanstack/react-router";
import { Check, Github, BookOpen, Youtube, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Difficulty, Problem } from "@/lib/patterns";

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn("flex items-center", className)}>
  <img 
    src="/Orange V Emblem with White Brackets.png" 
    alt="ZyVoxa Logo" 
    className="h-13 w-13 object-contain rounded-md" 
  />
 <div
  className="text-xl font-bold tracking-[-0.03em] leading-none"
  style={{ fontFamily: "'Playfair Display', serif" }}
>
  <span className="text-[#2A211C] dark:text-[#F5F1EB]">VOXA</span>
  <span className="text-[#C96A3D]">VAULT</span>
</div>
</Link>
  );
}

export function ProgressBar({ value, className, thick }: { value: number; className?: string; thick?: boolean }) {
  return (
    <div className={cn("w-full overflow-hidden rounded-full bg-secondary", thick ? "h-3" : "h-1.5", className)}>
      <div className="bar-fill h-full rounded-full bg-primary" style={{ width: `${Math.min(100, value)}%` }} />
    </div>
  );
}

const diffStyles: Record<Difficulty, string> = {
  Easy: "text-easy border-easy/30 bg-easy/10",
  Medium: "text-medium border-medium/30 bg-medium/10",
  Hard: "text-hard border-hard/30 bg-hard/10",
};

export function DifficultyBadge({ d }: { d: Difficulty }) {
  return (
    <span className={cn("rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider", diffStyles[d])}>
      {d}
    </span>
  );
}

export function CheckBox({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "grid h-5 w-5 shrink-0 place-items-center rounded-[6px] border transition-all duration-200",
        checked ? "scale-100 border-success bg-success text-success-foreground" : "border-border bg-card hover:border-primary",
      )}
    >
      <Check className={cn("h-3.5 w-3.5 transition-all duration-200", checked ? "scale-100 opacity-100" : "scale-50 opacity-0")} strokeWidth={3} />
    </button>
  );
}

function ResLink({ href, label, icon: Icon }: { href?: string | undefined; label: string; icon: typeof Github }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary hover:text-primary"
    >
      <Icon className="h-3 w-3" />
      <span className="hidden sm:inline">{label}</span>
    </a>
  );
}

export function ProblemRow({ p, done, onToggle }: { p: Problem; done: boolean; onToggle: (v: boolean) => void }) {
  return (
    <div className="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-secondary/60">
      <CheckBox checked={done} onChange={onToggle} label={`Mark ${p.title} complete`} />
      <span className="w-11 shrink-0 font-mono text-xs text-muted-foreground">{p.leetcode_number}</span>
      <a
        href={p.leetcode_url}
        target="_blank"
        rel="noreferrer"
        className={cn("min-w-0 flex-1 truncate text-sm transition-colors hover:text-primary", done && "text-muted-foreground line-through decoration-border")}
      >
        {p.title}
      </a>
      <DifficultyBadge d={p.difficulty} />
      <div className="flex items-center gap-1">
        <ResLink href={p.leetcode_url} label="LeetCode" icon={ExternalLink} />
        <ResLink href={p.github_url} label="GitHub" icon={Github} />
        <ResLink href={p.docs_url} label="Docs" icon={BookOpen} />
        <ResLink href={p.youtube_url} label="YouTube" icon={Youtube} />
        <Link to="/problem/$id" params={{ id: p.id }} className="hidden px-1 font-mono text-[11px] text-muted-foreground hover:text-primary md:inline">
          ↗
        </Link>
      </div>
    </div>
  );
}
