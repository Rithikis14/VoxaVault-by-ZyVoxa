import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Sign in — VoxaVault" }],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Automatically redirect if already authenticated
    if (!authLoading && user) {
      navigate({ to: "/dashboard" });
    }
  }, [user, authLoading, navigate]);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        toast.error(error.message || "Failed to sign in with Google.");
        setLoading(false);
      }
    } catch (err) {
      console.error("Sign in error:", err);
      toast.error("An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center px-6">
  <div className="paper w-full max-w-sm p-8 text-center">
    {/* Centered logo container with proper horizontal alignment and spacing */}
    <div className="flex items-center justify-center">
      <img
        src="/Orange V Emblem with White Brackets.png"
        alt="VoxaVault Logo"
        className="h-15 w-15 object-contain"
      />
      <div
        className="flex items-center text-xl font-bold tracking-[-0.03em] leading-none"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        <span className="text-[#2A211C] dark:text-foreground">VOXA</span>
        <span className="text-[#C96A3D]">VAULT</span>
      </div>
    </div>

    <h1 className="mt-5 text-3xl">Welcome to your notebook.</h1>
    <p className="mt-2 text-sm text-muted-foreground">
      One account. Every pattern. Progress that follows you.
    </p>

    <button
      type="button"
      onClick={handleGoogleLogin}
      disabled={loading || authLoading}
      className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium transition-colors hover:border-primary disabled:opacity-60"
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24">
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          fill="#EA4335"
        />
      </svg>
      {loading ? "Connecting..." : "Continue with Google"}
    </button>

    <p className="mt-6 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
      No passwords. Ever.
    </p>
  </div>
</div>
  );
}