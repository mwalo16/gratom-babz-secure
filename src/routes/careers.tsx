import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "../components/site/Section";
import { Briefcase, GraduationCap, Heart, TrendingUp, Upload } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Vacancy = { id: string; title: string; location: string; employment_type: string };
type Requirement = { id: string; requirement: string };

async function loadCareers(): Promise<{ vacancies: Vacancy[]; requirements: Requirement[] }> {
  const [v, r] = await Promise.all([
    supabase
      .from("job_vacancies")
      .select("id,title,location,employment_type")
      .eq("published", true)
      .order("sort_order"),
    supabase.from("application_requirements").select("id,requirement").order("sort_order"),
  ]);
  return {
    vacancies: (v.data ?? []) as Vacancy[],
    requirements: (r.data ?? []) as Requirement[],
  };
}

export const Route = createFileRoute("/careers")({
  loader: () => loadCareers(),
  errorComponent: () => (
    <div className="container-x py-24 text-center text-muted-foreground">Careers information is unavailable right now. Please try again shortly.</div>
  ),
  notFoundComponent: () => <div className="container-x py-24 text-center">Page not found.</div>,
  head: ({ loaderData }) => ({
    meta: [
      { title: "Careers — Gratom Babz Security" },
      { name: "description", content: "Join Kenya's leading security team. Current vacancies, benefits and online application." },
      { property: "og:title", content: "Careers — Gratom Babz Security" },
      { property: "og:description", content: "Join our team." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/careers" },
    ],
    links: [{ rel: "canonical", href: "/careers" }],
    scripts: (loaderData?.vacancies ?? []).map((v) => ({
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "JobPosting",
        title: v.title,
        description: `${v.employment_type} ${v.title} position with Gratom Babz Security Services Ltd in ${v.location}, Kenya. Full training provided; disciplined, vetted professionals encouraged to apply.`,
        employmentType: "FULL_TIME",
        hiringOrganization: {
          "@type": "Organization",
          name: "Gratom Babz Security Services Ltd",
          sameAs: "/",
        },
        jobLocation: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: v.location,
            addressCountry: "KE",
          },
        },
        directApply: true,
      }),
    })),
  }),
  component: Careers,
});


function Careers() {
  const { vacancies, requirements } = Route.useLoaderData() as { vacancies: Vacancy[]; requirements: Requirement[] };
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onApply(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setError(null);

    const parsed = applicationSchema.safeParse({
      name: String(fd.get("name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      email: String(fd.get("email") ?? ""),
      position: String(fd.get("position") ?? ""),
      cover_note: String(fd.get("cover_note") ?? ""),
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check the form and try again.");
      return;
    }

    setBusy(true);
    const { error: err } = await supabase.from("job_applications").insert(parsed.data);
    setBusy(false);
    if (err) setError("Sorry, we couldn't submit your application. Please try again later.");
    else setSubmitted(true);
  }



  return (
    <>
      <PageHero title="Join Our Team" subtitle="Build a career you're proud of. We're hiring disciplined, motivated professionals across Kenya." />

      <section className="py-16">
        <div className="container-x grid gap-10 lg:grid-cols-3">
          {[
            { i: GraduationCap, t: "Continuous Training", d: "Ongoing physical, tactical and customer-service training." },
            { i: TrendingUp, t: "Career Growth", d: "Clear pathways from officer to supervisor to management." },
            { i: Heart, t: "Great Benefits", d: "Medical cover, welfare fund, uniform and meal allowances." },
          ].map((b) => (
            <div key={b.t} className="rounded-xl bg-muted/40 p-6 border">
              <b.i className="h-8 w-8 text-gold mb-3" />
              <h3 className="font-semibold text-navy">{b.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{b.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 bg-muted/40">
        <div className="container-x">
          <h2 className="text-3xl font-bold text-navy mb-2">Current Vacancies</h2>
          <p className="text-muted-foreground mb-8">
            {vacancies.length > 0 ? "Explore open roles and apply below." : "We advertise all open roles on this page."}
          </p>
          {vacancies.length === 0 ? (
            <div className="rounded-xl bg-background border border-dashed p-8 text-center">
              <Briefcase className="h-8 w-8 text-gold mx-auto mb-3" />
              <p className="font-semibold text-navy">No current job vacancy</p>
              <p className="mt-1 text-sm text-muted-foreground">
                There are no openings at the moment. You're still welcome to submit an application below and we'll keep it on file.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {vacancies.map((v) => (
                <div key={v.id} className="rounded-xl bg-background p-5 border flex items-start justify-between gap-4 hover:border-gold transition-colors">
                  <div>
                    <div className="flex items-center gap-2 text-navy font-semibold">
                      <Briefcase className="h-4 w-4 text-gold" /> {v.title}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">{v.location} · {v.employment_type}</div>
                  </div>
                  <a href="#apply" className="text-sm font-semibold text-navy hover:text-gold">Apply →</a>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="apply" className="py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="text-3xl font-bold text-navy">Application Requirements</h2>
            {requirements.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">Requirements will be listed here soon.</p>
            ) : (
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground list-disc pl-5">
                {requirements.map((r) => (
                  <li key={r.id}>{r.requirement}</li>
                ))}
              </ul>
            )}
          </div>
          <form
            onSubmit={onApply}
            className="rounded-2xl bg-muted/40 border p-6 md:p-8 space-y-4"
          >
            <h3 className="text-xl font-bold text-navy">Online Application</h3>
            {submitted ? (
              <div className="rounded-md bg-gold/20 border border-gold p-4 text-sm text-navy">Thank you — your application has been submitted. Our HR team will be in touch.</div>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Full Name" name="name" required />
                  <Field label="Phone" name="phone" type="tel" required />
                  <Field label="Email" name="email" type="email" required />
                  <Field label="Position Applying For" name="position" required />
                </div>
                <div>
                  <label className="text-sm font-medium">Cover Note</label>
                  <textarea name="cover_note" rows={4} maxLength={3000} className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:border-navy" />
                </div>
                <div className="flex items-center gap-3 rounded-md border-2 border-dashed p-4 text-sm text-muted-foreground">
                  <Upload className="h-5 w-5 text-gold" />
                  <span>After submitting, email your CV to gtbabzservices@gmail.com</span>
                </div>
                {error && <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
                <button disabled={busy} className="w-full rounded-md gradient-navy text-white font-semibold py-3 disabled:opacity-60">{busy ? "Submitting…" : "Submit Application"}</button>
              </>
            )}
          </form>

        </div>
      </section>
    </>
  );
}

function Field({ label, name, type = "text", required = false }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input name={name} type={type} required={required} className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:border-navy" />
    </div>
  );
}
