import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { KeyRound } from "lucide-react";
import logo from "../assets/gbs-logo.png.asset.json";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset Password — Gratom Babz Security" },
      { name: "description", content: "Set a new password for your Gratom Babz admin account." },
      { property: "og:title", content: "Reset Password — Gratom Babz Security" },
      { property: "og:description", content: "Set a new password for your admin account." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: "error" | "info"; text: string } | null>(null);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => { if (data.session) setReady(true); });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setMsg({ type: "error", text: "The two passwords don't match." }); return; }
    setBusy(true); setMsg(null);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) { setMsg({ type: "error", text: error.message }); return; }
    setMsg({ type: "info", text: "Password updated. Taking you to the dashboard…" });
    setTimeout(() => navigate({ to: "/admin", replace: true }), 1200);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-muted/40">
      <div className="w-full max-w-md rounded-2xl border bg-background p-8 shadow-lg">
        <div className="flex flex-col items-center text-center">
          <img src={logo.url} alt="Gratom Babz Security" className="h-16 w-auto" />
          <h1 className="mt-4 text-2xl font-bold text-navy">Set a new password</h1>
        </div>
        {!ready ? (
          <p className="mt-6 text-sm text-center text-muted-foreground">
            Open this page from the reset link in your email. If the link has expired, go back to sign in and tap "Forgot password?" again.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium">New password</label>
              <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:border-navy" />
            </div>
            <div>
              <label className="text-sm font-medium">Confirm new password</label>
              <input type="password" required minLength={8} value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:border-navy" />
            </div>
            {msg && (
              <div className={`rounded-md border p-3 text-sm ${msg.type === "error" ? "border-destructive/40 bg-destructive/10 text-destructive" : "border-gold bg-gold/15 text-navy"}`}>{msg.text}</div>
            )}
            <button disabled={busy} className="w-full rounded-md gradient-navy text-white font-semibold py-3 disabled:opacity-60 inline-flex items-center justify-center gap-2">
              <KeyRound className="h-4 w-4" /> {busy ? "Please wait…" : "Save new password"}
            </button>
          </form>
        )}
        <a href="/auth" className="mt-6 block text-center text-xs text-muted-foreground hover:text-navy">← Back to sign in</a>
      </div>
    </div>
  );
}
