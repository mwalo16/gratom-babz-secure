import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "../components/site/Section";
import { Briefcase, GraduationCap, Heart, TrendingUp, Upload } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers — Gratom Babz Security" },
      { name: "description", content: "Join Kenya's leading security team. Current vacancies, benefits and online application." },
      { property: "og:title", content: "Careers — Gratom Babz Security" },
      { property: "og:description", content: "Join our team." },
      { property: "og:url", content: "/careers" },
    ],
    links: [{ rel: "canonical", href: "/careers" }],
  }),
  component: Careers,
});

const vacancies = [
  { title: "Security Officer", loc: "Kiambu, Nakuru, Nyeri", type: "Full-time" },
  { title: "K9 Handler", loc: "Nairobi", type: "Full-time" },
  { title: "Control Room Operator", loc: "Head Office", type: "Shift" },
  { title: "Mobile Patrol Officer", loc: "Central Region", type: "Full-time" },
  { title: "CCTV Technician", loc: "Nairobi", type: "Full-time" },
  { title: "Operations Supervisor", loc: "Murang'a", type: "Full-time" },
];

function Careers() {
  const [submitted, setSubmitted] = useState(false);
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
          <p className="text-muted-foreground mb-8">Explore open roles and apply below.</p>
          <div className="grid gap-4 md:grid-cols-2">
            {vacancies.map((v) => (
              <div key={v.title} className="rounded-xl bg-background p-5 border flex items-start justify-between gap-4 hover:border-gold transition-colors">
                <div>
                  <div className="flex items-center gap-2 text-navy font-semibold">
                    <Briefcase className="h-4 w-4 text-gold" /> {v.title}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{v.loc} · {v.type}</div>
                </div>
                <a href="#apply" className="text-sm font-semibold text-navy hover:text-gold">Apply →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="apply" className="py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="text-3xl font-bold text-navy">Application Requirements</h2>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground list-disc pl-5">
              <li>KCSE Certificate (D+ and above)</li>
              <li>Valid National ID and Certificate of Good Conduct</li>
              <li>Physically fit, minimum height 5'6"</li>
              <li>Aged between 21 and 45 years</li>
              <li>Previous security or disciplined-forces experience is an advantage</li>
            </ul>
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
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
                  <textarea rows={4} className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:border-navy" />
                </div>
                <label className="flex items-center gap-3 rounded-md border-2 border-dashed p-4 cursor-pointer hover:border-navy transition-colors">
                  <Upload className="h-5 w-5 text-gold" />
                  <span className="text-sm">Upload CV (PDF, DOC)</span>
                  <input type="file" className="hidden" />
                </label>
                <button className="w-full rounded-md gradient-navy text-white font-semibold py-3">Submit Application</button>
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
