import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell, useTheme } from "@/components/app-shell";
import { Switch } from "@/components/ui/switch";
import { useAuth, userMeta } from "@/lib/auth";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — VoxaVault" },
      { name: "description", content: "Manage appearance and your VoxaVault account." },
      { property: "og:title", content: "Settings — VoxaVault" },
      { property: "og:description", content: "Manage appearance and your account." },
    ],
  }),
  component: () => (
    <AppShell>
      <SettingsPage />
    </AppShell>
  ),
});

function SettingsPage() {
  const { dark, toggle } = useTheme();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const m = userMeta(user);
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-4xl">Settings</h1>
      <section className="paper divide-y divide-border">
        <div className="flex items-center justify-between p-5">
          <div><p className="font-medium">Dark mode</p><p className="text-sm text-muted-foreground">Late-night coffee shop.</p></div>
          <Switch checked={dark} onCheckedChange={toggle} />
        </div>
        <div className="flex items-center justify-between p-5">
          <div><p className="font-medium">Account</p><p className="text-sm text-muted-foreground">{m.email} · Google</p></div>
        </div>
        <div className="flex items-center justify-between p-5">
          <div><p className="font-medium">Sign out</p><p className="text-sm text-muted-foreground">Your progress stays saved.</p></div>
          <button onClick={async () => { await signOut(); navigate({ to: "/" }); }} className="rounded-lg border border-border px-4 py-2 text-sm hover:border-destructive hover:text-destructive">
            Sign out
          </button>
        </div>
      </section>
    </div>
  );
}
