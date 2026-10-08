import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./auth";
import { patterns, TOTAL_PROBLEMS } from "./patterns";

export interface ProgressRow {
  problem_id: string;
  completed_at: string;
}

export function useProgress() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const key = ["progress", user?.id];

  const query = useQuery({
    queryKey: key,
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("progress")
        .select("problem_id, completed_at")
        .eq("completed", true);
      if (error) throw error;
      return (data ?? []) as ProgressRow[];
    },
  });

  const toggle = useMutation({
    mutationFn: async ({ id, done }: { id: string; done: boolean }) => {
      if (!user) throw new Error("Not signed in");
      if (done) {
        const { error } = await supabase
          .from("progress")
          .upsert(
            { user_id: user.id, problem_id: id, completed: true, completed_at: new Date().toISOString() },
            { onConflict: "user_id,problem_id" },
          );
        if (error) throw error;
      } else {
        const { error } = await supabase.from("progress").delete().eq("problem_id", id).eq("user_id", user.id);
        if (error) throw error;
      }
    },
    onMutate: async ({ id, done }) => {
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<ProgressRow[]>(key);
      qc.setQueryData<ProgressRow[]>(key, (rows = []) =>
        done
          ? [...rows.filter((r) => r.problem_id !== id), { problem_id: id, completed_at: new Date().toISOString() }]
          : rows.filter((r) => r.problem_id !== id),
      );
      return { prev };
    },
    onError: (_e, _v, ctx) => ctx?.prev && qc.setQueryData(key, ctx.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: key }),
  });

  const rows = query.data ?? [];
  const done = new Set(rows.map((r) => r.problem_id));
  return { rows, done, isLoading: query.isLoading, toggle: (id: string, d: boolean) => toggle.mutate({ id, done: d }) };
}

const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

export function computeStats(rows: ProgressRow[], done: Set<string>) {
  const days = new Set(rows.map((r) => dayKey(new Date(r.completed_at))));
  // current streak
  let current = 0;
  const d = new Date();
  if (!days.has(dayKey(d))) d.setDate(d.getDate() - 1);
  while (days.has(dayKey(d))) {
    current++;
    d.setDate(d.getDate() - 1);
  }
  // longest
  const sorted = [...new Set(rows.map((r) => new Date(r.completed_at).setHours(0, 0, 0, 0)))].sort((a, b) => a - b);
  let longest = 0;
  let run = 0;
  for (let i = 0; i < sorted.length; i++) {
    run = i > 0 && Math.round((sorted[i]! - sorted[i - 1]!) / 86400000) === 1 ? run + 1 : 1;
    longest = Math.max(longest, run);
  }
  const perPattern = patterns.map((p) => {
    const c = p.problems.filter((x) => done.has(x.id)).length;
    return { pattern: p, completed: c, total: p.problems.length, pct: Math.round((c / p.problems.length) * 100) };
  });
  const solved = done.size;
  return {
    solved,
    total: TOTAL_PROBLEMS,
    pct: Math.round((solved / TOTAL_PROBLEMS) * 100),
    current,
    longest,
    perPattern,
    started: perPattern.filter((p) => p.completed > 0).length,
    completed: perPattern.filter((p) => p.completed === p.total).length,
  };
}
