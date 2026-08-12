import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Inbox, Briefcase, Wrench, Images, UserPlus, LogOut, Trash2, Plus, ShieldAlert } from "lucide-react";
import logo from "../../assets/gbs-logo.png.asset.json";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Gratom Babz Security" },
      { name: "description", content: "Manage contact messages, job applications, services and gallery for Gratom Babz Security." },
      { property: "og:title", content: "Admin Dashboard — Gratom Babz Security" },
      { property: "og:description", content: "Internal administration dashboard." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type Tab = "messages" | "applications" | "vacancies" | "services" | "gallery" | "admins";

const TABS: { id: Tab; label: string; icon: typeof Inbox }[] = [
  { id: "messages", label: "Messages", icon: Inbox },
  { id: "applications", label: "Applications", icon: Briefcase },
  { id: "vacancies", label: "Vacancies", icon: Briefcase },
  { id: "services", label: "Services", icon: Wrench },
  { id: "gallery", label: "Gallery", icon: Images },
  { id: "admins", label: "Admins", icon: UserPlus },
];

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>("messages");

  const { data: isAdmin, isLoading: checkingRole } = useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return false;
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userData.user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (error) throw error;
      return !!data;
    },
  });

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (checkingRole) {
    return <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">Loading dashboard…</div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md text-center rounded-2xl border p-8">
          <ShieldAlert className="h-10 w-10 text-gold mx-auto" />
          <h1 className="mt-4 text-xl font-bold text-navy">No admin access</h1>
          <p className="mt-2 text-sm text-muted-foreground">Your account isn't on the admin list. Ask an existing admin to invite your email address.</p>
          <button onClick={signOut} className="mt-6 rounded-md gradient-navy text-white px-5 py-2.5 text-sm font-semibold">Sign out</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="gradient-navy text-white">
        <div className="container-x flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <img src={logo.url} alt="" className="h-10 w-auto" />
            <div>
              <div className="font-bold leading-tight">Admin Dashboard</div>
              <div className="text-xs text-white/70">Gratom Babz Security Services Ltd</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href="/" className="rounded-md border border-white/30 px-3 py-2 text-sm hover:bg-white/10">View site</a>
            <button onClick={signOut} className="rounded-md gradient-gold text-navy font-semibold px-3 py-2 text-sm inline-flex items-center gap-1.5">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="container-x py-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${tab === t.id ? "bg-navy text-navy-foreground border-navy" : "bg-background hover:border-navy"}`}
            >
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </div>

        {tab === "messages" && <Messages />}
        {tab === "applications" && <Applications />}
        {tab === "services" && <Services />}
        {tab === "gallery" && <Gallery />}
        {tab === "admins" && <Admins />}
      </div>
    </div>
  );
}

function Panel({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="rounded-2xl border bg-background p-6">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className="text-lg font-bold text-navy">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="text-sm text-muted-foreground py-8 text-center">{text}</p>;
}

function fmt(d: string) {
  return new Date(d).toLocaleString("en-KE", { dateStyle: "medium", timeStyle: "short" });
}

/* ---------------- Messages ---------------- */
function Messages() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["contact_messages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("contact_messages").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["contact_messages"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contact_messages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Message deleted"); qc.invalidateQueries({ queryKey: ["contact_messages"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const unread = data.filter((m) => m.status === "new").length;

  return (
    <Panel title={`Contact Messages${unread ? ` — ${unread} new` : ""}`}>
      {isLoading ? <Empty text="Loading…" /> : data.length === 0 ? <Empty text="No messages yet." /> : (
        <div className="space-y-3">
          {data.map((m) => (
            <div key={m.id} className={`rounded-xl border p-4 ${m.status === "new" ? "border-gold bg-gold/5" : ""}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-navy">{m.name} {m.service ? <span className="text-xs font-normal text-muted-foreground">· {m.service}</span> : null}</div>
                  <div className="text-xs text-muted-foreground">{m.email} {m.phone ? `· ${m.phone}` : ""} · {fmt(m.created_at)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setStatus.mutate({ id: m.id, status: m.status === "new" ? "read" : "new" })}
                    className="rounded-md border px-3 py-1.5 text-xs font-medium hover:border-navy"
                  >
                    Mark as {m.status === "new" ? "read" : "unread"}
                  </button>
                  <button onClick={() => remove.mutate(m.id)} className="rounded-md border px-2 py-1.5 text-xs hover:border-destructive hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <p className="mt-3 text-sm whitespace-pre-wrap">{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

/* ---------------- Applications ---------------- */
function Applications() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["job_applications"],
    queryFn: async () => {
      const { data, error } = await supabase.from("job_applications").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("job_applications").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Application deleted"); qc.invalidateQueries({ queryKey: ["job_applications"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Panel title="Job Applications">
      {isLoading ? <Empty text="Loading…" /> : data.length === 0 ? <Empty text="No applications yet." /> : (
        <div className="space-y-3">
          {data.map((a) => (
            <div key={a.id} className="rounded-xl border p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-navy">{a.name} — <span className="text-sm font-normal">{a.position}</span></div>
                  <div className="text-xs text-muted-foreground">{a.email} {a.phone ? `· ${a.phone}` : ""} · {fmt(a.created_at)}</div>
                </div>
                <button onClick={() => remove.mutate(a.id)} className="rounded-md border px-2 py-1.5 text-xs hover:border-destructive hover:text-destructive">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              {a.cover_note ? <p className="mt-3 text-sm whitespace-pre-wrap">{a.cover_note}</p> : null}
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

/* ---------------- Services ---------------- */
function Services() {
  const qc = useQueryClient();
  const [form, setForm] = useState({ title: "", description: "", details: "", icon: "Shield" });
  const [editing, setEditing] = useState<string | null>(null);
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin-services"],
    queryFn: async () => {
      const { data, error } = await supabase.from("services").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const invalidate = () => { qc.invalidateQueries({ queryKey: ["admin-services"] }); qc.invalidateQueries({ queryKey: ["services"] }); };

  const add = useMutation({
    mutationFn: async () => {
      const next = (data.at(-1)?.sort_order ?? 0) + 1;
      const { error } = await supabase.from("services").insert({ ...form, sort_order: next });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Service added"); setForm({ title: "", description: "", details: "", icon: "Shield" }); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const update = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: Partial<typeof form> }) => {
      const { error } = await supabase.from("services").update(values).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Service updated"); setEditing(null); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const togglePublished = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      const { error } = await supabase.from("services").update({ published }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("services").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Service removed"); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Panel title="Services">
      <form
        onSubmit={(e) => { e.preventDefault(); add.mutate(); }}
        className="grid gap-3 rounded-xl bg-muted/40 border p-4 mb-5"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium">Title</label>
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium">Icon name</label>
            <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="Shield" className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm" />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium">Short description</label>
          <input required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-xs font-medium">Detailed description</label>
          <textarea value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} rows={3} placeholder="Longer description shown when visitors click Learn more…" className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm" />
        </div>
        <div className="flex justify-end">
          <button className="rounded-md gradient-navy text-white text-sm font-semibold px-4 py-2.5 inline-flex items-center gap-1.5">
            <Plus className="h-4 w-4" /> Add service
          </button>
        </div>
      </form>

      {isLoading ? <Empty text="Loading…" /> : (
        <div className="grid gap-3 md:grid-cols-2">
          {data.map((s) => (
            <div key={s.id} className="rounded-xl border p-4">
              {editing === s.id ? (
                <EditServiceForm service={s} onSave={(values) => update.mutate({ id: s.id, values })} onCancel={() => setEditing(null)} />
              ) : (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-navy">{s.title}</div>
                      <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setEditing(s.id)} className="rounded-md border px-2 py-1.5 text-xs hover:border-navy">Edit</button>
                      <button onClick={() => remove.mutate(s.id)} className="rounded-md border px-2 py-1.5 text-xs hover:border-destructive hover:text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <label className="mt-3 flex items-center gap-2 text-xs">
                    <input type="checkbox" checked={s.published} onChange={(e) => togglePublished.mutate({ id: s.id, published: e.target.checked })} />
                    Visible on website
                  </label>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

function EditServiceForm({ service, onSave, onCancel }: { service: any; onSave: (values: { title: string; description: string; details: string; icon: string }) => void; onCancel: () => void }) {
  const [values, setValues] = useState({
    title: service.title,
    description: service.description,
    details: service.details ?? "",
    icon: service.icon,
  });
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(values); }} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium">Title</label>
          <input required value={values.title} onChange={(e) => setValues({ ...values, title: e.target.value })} className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-xs font-medium">Icon name</label>
          <input value={values.icon} onChange={(e) => setValues({ ...values, icon: e.target.value })} className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm" />
        </div>
      </div>
      <div>
        <label className="text-xs font-medium">Short description</label>
        <input required value={values.description} onChange={(e) => setValues({ ...values, description: e.target.value })} className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="text-xs font-medium">Detailed description</label>
        <textarea value={values.details} onChange={(e) => setValues({ ...values, details: e.target.value })} rows={4} className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm" />
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="rounded-md border px-3 py-1.5 text-xs">Cancel</button>
        <button className="rounded-md gradient-navy text-white px-3 py-1.5 text-xs font-semibold">Save</button>
      </div>
    </form>
  );
}

/* ---------------- Gallery ---------------- */
function Gallery() {
  const qc = useQueryClient();
  const [form, setForm] = useState({ image_url: "", category: "", caption: "" });
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin-gallery"],
    queryFn: async () => {
      const { data, error } = await supabase.from("gallery_items").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const invalidate = () => { qc.invalidateQueries({ queryKey: ["admin-gallery"] }); qc.invalidateQueries({ queryKey: ["gallery"] }); };

  const add = useMutation({
    mutationFn: async () => {
      const next = (data.at(-1)?.sort_order ?? 0) + 1;
      const { error } = await supabase.from("gallery_items").insert({
        image_url: form.image_url,
        category: form.category || "General",
        caption: form.caption || null,
        sort_order: next,
      });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Photo added"); setForm({ image_url: "", category: "", caption: "" }); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("gallery_items").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Photo removed"); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Panel title="Gallery">
      <form
        onSubmit={(e) => { e.preventDefault(); add.mutate(); }}
        className="grid gap-3 sm:grid-cols-[1.6fr_1fr_1fr_auto] items-end rounded-xl bg-muted/40 border p-4 mb-5"
      >
        <div>
          <label className="text-xs font-medium">Image URL</label>
          <input required value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://…" className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-xs font-medium">Category</label>
          <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="K9 Unit" className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-xs font-medium">Caption</label>
          <input value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm" />
        </div>
        <button className="rounded-md gradient-navy text-white text-sm font-semibold px-4 py-2.5 inline-flex items-center gap-1.5">
          <Plus className="h-4 w-4" /> Add
        </button>
      </form>

      {isLoading ? <Empty text="Loading…" /> : (
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {data.map((g) => (
            <div key={g.id} className="rounded-xl border overflow-hidden">
              <img src={g.image_url} alt={g.caption ?? g.category} className="h-32 w-full object-cover" loading="lazy" />
              <div className="p-3">
                <div className="text-xs font-semibold text-navy">{g.category}</div>
                {g.caption ? <div className="text-xs text-muted-foreground">{g.caption}</div> : null}
                <button onClick={() => remove.mutate(g.id)} className="mt-2 w-full rounded-md border px-2 py-1.5 text-xs hover:border-destructive hover:text-destructive">Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

/* ---------------- Admins ---------------- */
function Admins() {
  const qc = useQueryClient();
  const [email, setEmail] = useState("");

  const { data: isSuperAdmin = false } = useQuery({
    queryKey: ["is-super-admin"],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return false;
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userData.user.id)
        .eq("role", "super_admin")
        .maybeSingle();
      if (error) throw error;
      return !!data;
    },
  });

  const { data = [], isLoading } = useQuery({
    queryKey: ["admin_invites"],
    queryFn: async () => {
      const { data, error } = await supabase.from("admin_invites").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });


  const { data: admins = [] } = useQuery({
    queryKey: ["admin_profiles"],
    queryFn: async () => {
      const { data: roles, error } = await supabase.from("user_roles").select("user_id").eq("role", "admin");
      if (error) throw error;
      const ids = roles.map((r) => r.user_id);
      if (ids.length === 0) return [];
      const { data: profiles, error: pErr } = await supabase.from("profiles").select("id, email, full_name").in("id", ids);
      if (pErr) throw pErr;
      return profiles;
    },
  });

  const invite = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("admin_invites").insert({ email: email.trim().toLowerCase() });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Invite added"); setEmail(""); qc.invalidateQueries({ queryKey: ["admin_invites"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const revoke = useMutation({
    mutationFn: async (e: string) => {
      const { error } = await supabase.from("admin_invites").delete().eq("email", e);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Invite removed"); qc.invalidateQueries({ queryKey: ["admin_invites"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Panel title="Invite an admin">
        {isSuperAdmin ? (
          <>
            <form onSubmit={(e) => { e.preventDefault(); invite.mutate(); }} className="flex gap-2">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="flex-1 rounded-md border bg-background px-3 py-2 text-sm" />
              <button className="rounded-md gradient-navy text-white text-sm font-semibold px-4">Invite</button>
            </form>
            <p className="mt-2 text-xs text-muted-foreground">Invited people get admin rights automatically when they create their account on the sign-in page.</p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Only the super admin can invite or remove admins. Contact the account owner to request access for someone.</p>
        )}

        {isLoading ? <Empty text="Loading…" /> : data.length === 0 ? <Empty text="No pending invites." /> : (
          <ul className="mt-4 space-y-2">
            {data.map((i) => (
              <li key={i.email} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                {i.email}
                {isSuperAdmin && (
                  <button onClick={() => revoke.mutate(i.email)} className="text-xs text-muted-foreground hover:text-destructive">Remove</button>
                )}
              </li>
            ))}
          </ul>
        )}
      </Panel>


      <Panel title="Current admins">
        {admins.length === 0 ? <Empty text="No admins found." /> : (
          <ul className="space-y-2">
            {admins.map((a) => (
              <li key={a.id} className="rounded-md border px-3 py-2 text-sm">
                <div className="font-medium text-navy">{a.full_name ?? "Admin"}</div>
                <div className="text-xs text-muted-foreground">{a.email}</div>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
