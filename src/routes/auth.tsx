import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ShieldCheck } from "lucide-react";
import logo from "../assets/gbs-logo.png.asset.json";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Admin Sign In — Gratom Babz Security" },
      { name: "description", content: "Secure staff sign-in for the Gratom Babz Security administration dashboard." },
      { property: "og:title", content: "Admin Sign In — Gratom Babz Security" },
      { property: "og:description", content: "Staff access to the Gratom Babz admin dashboard." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: "error" | "info"; text: string } | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/admin", replace: true });
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/admin", data: { full_name: fullName } },
        });
        if (error) {
          if (/already registered|already exists/i.test(error.message)) {
            setMode("signin");
            setMsg({ type: "info", text: "You already have an account. Please sign in with your email and password." });
            return;
          }
          throw error;
        }
        if (data.session) navigate({ to: "/admin", replace: true });
        else setMsg({ type: "info", text: "Check your email to confirm your account, then sign in." });
      }
    } catch (err) {
      setMsg({ type: "error", text: err instanceof Error ? err.message : "Something went wrong" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-muted/40">
      <div className="w-full max-w-md rounded-2xl border bg-background p-8 shadow-lg">
        <div className="flex flex-col items-center text-center">
          <img src={logo.url} alt="Gratom Babz Security" className="h-16 w-auto" />
          <h1 className="mt-4 text-2xl font-bold text-navy">Admin Portal</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "signin" ? "Sign in to manage messages and site content." : "Invited staff only — create your account."}
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          {mode === "signup" && (
            <div>
              <label className="text-sm font-medium">Full Name</label>
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} required className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:border-navy" />
            </div>
          )}
          <div>
            <label className="text-sm font-medium">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:border-navy" />
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} autoComplete={mode === "signin" ? "current-password" : "new-password"} className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:border-navy" />
          </div>

          {msg && (
            <div className={`rounded-md border p-3 text-sm ${msg.type === "error" ? "border-destructive/40 bg-destructive/10 text-destructive" : "border-gold bg-gold/15 text-navy"}`}>
              {msg.text}
            </div>
          )}

          <button disabled={busy} className="w-full rounded-md gradient-navy text-white font-semibold py-3 disabled:opacity-60 inline-flex items-center justify-center gap-2">
            <ShieldCheck className="h-4 w-4" /> {busy ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Account"}
          </button>
        </form>

        {mode === "signin" && (
          <button
            type="button"
            onClick={async () => {
              if (!email) { setMsg({ type: "error", text: "Enter your email above first, then tap Forgot password." }); return; }
              setBusy(true); setMsg(null);
              const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
              setBusy(false);
              setMsg(error ? { type: "error", text: error.message } : { type: "info", text: "If that email has an account, a password reset link has been sent. Check your inbox and spam folder." });
            }}
            className="mt-3 w-full text-sm text-navy font-medium hover:underline"
          >
            Forgot password?
          </button>
        )}

        <button
          onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setMsg(null); }}
          className="mt-4 w-full text-sm text-muted-foreground hover:text-navy"
        >
          {mode === "signin" ? "Invited? Create your admin account" : "Already have an account? Sign in"}
        </button>

        <a href="/" className="mt-6 block text-center text-xs text-muted-foreground hover:text-navy">← Back to website</a>
      </div>
    </div>
  );
}
