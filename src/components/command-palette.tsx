import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { patterns, pad2 } from "@/lib/patterns";
import { DifficultyBadge } from "./pattern-ui";

export const openPalette = () => window.dispatchEvent(new Event("open-cmdk"));

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-cmdk", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-cmdk", onOpen);
    };
  }, []);

  const go = (fn: () => void) => {
    setOpen(false);
    fn();
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search problems, patterns, numbers, difficulty…" />
      <CommandList className="max-h-[420px]">
        <CommandEmpty>Nothing found.</CommandEmpty>
        <CommandGroup heading="Patterns">
          {patterns.map((p) => (
            <CommandItem key={p.slug} value={`pattern ${p.number} ${p.name}`} onSelect={() => go(() => navigate({ to: "/patterns/$slug", params: { slug: p.slug } }))}>
              <span className="w-6 font-mono text-xs text-muted-foreground">{pad2(p.number)}</span>
              {p.name}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Problems">
          {patterns.flatMap((pt) =>
            pt.problems.map((p) => (
              <CommandItem
                key={p.id}
                value={`${p.leetcode_number} ${p.title} ${pt.name} ${p.difficulty}`}
                onSelect={() => go(() => navigate({ to: "/problem/$id", params: { id: p.id } }))}
              >
                <span className="w-10 font-mono text-xs text-muted-foreground">{p.leetcode_number}</span>
                <span className="flex-1 truncate">{p.title}</span>
                <span className="hidden text-xs text-muted-foreground sm:inline">{pt.name}</span>
                <DifficultyBadge d={p.difficulty} />
              </CommandItem>
            )),
          )}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
