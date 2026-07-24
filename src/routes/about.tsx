import { createFileRoute } from "@tanstack/react-router";
import { PageHero, SectionHeader } from "../components/site/Section";
import { Target, Eye, Award, Shield, Users, Zap, Star, Heart, Lightbulb, Handshake } from "lucide-react";
import teamImg from "../assets/team.jpg";
import officerImg from "../assets/officer.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Gratom Babz Security Services Ltd" },
      { name: "description", content: "Discover our vision, mission and core values — the story behind one of Kenya's most trusted private security companies." },
      { property: "og:title", content: "About — Gratom Babz Security Services Ltd" },
      { property: "og:description", content: "Our vision, mission and values." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

function About() {
  const values = [
    { i: Shield, t: "Integrity" }, { i: Award, t: "Professionalism" }, { i: Handshake, t: "Accountability" },
    { i: Star, t: "Excellence" }, { i: Eye, t: "Vigilance" }, { i: Heart, t: "Customer Focus" },
    { i: Lightbulb, t: "Innovation" }, { i: Users, t: "Teamwork" },
  ];
  return (
    <>
      <PageHero title="About Gratom Babz" subtitle="A Kenyan security company built on discipline, technology and unwavering customer focus." />

      <section className="py-20">
        <div className="container-x grid gap-12 lg:grid-cols-2 items-center">
          <img src={teamImg} alt="Company team" width={1600} height={900} loading="lazy" className="rounded-2xl shadow-xl object-cover w-full" />
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-gold mb-3">
              <span className="h-px w-8 bg-gold" /> Company Profile
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-navy">Protecting what matters, since day one.</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Gratom Babz Security Services Ltd is a fully-licensed Kenyan private security firm serving residential estates, corporates, industries, retail and government clients. We combine highly-trained officers with modern surveillance technology to deliver measurable security outcomes.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              With branches in Kiambu, Murang'a, Nyeri and Nakuru — and a 24-hour control room coordinating rapid response — we cover Central Kenya and beyond with disciplined, dependable service.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/40">
        <div className="container-x grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-background p-8 border shadow-sm">
            <Eye className="h-10 w-10 text-gold mb-4" />
            <h3 className="text-xl font-bold text-navy">Our Vision</h3>
            <p className="mt-3 text-muted-foreground leading-relaxed">To become Kenya's most trusted provider of professional security and safety solutions.</p>
          </div>
          <div className="rounded-2xl bg-background p-8 border shadow-sm">
            <Target className="h-10 w-10 text-gold mb-4" />
            <h3 className="text-xl font-bold text-navy">Our Mission</h3>
            <p className="mt-3 text-muted-foreground leading-relaxed">To deliver world-class security services through highly trained personnel, modern technology and exceptional customer service.</p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-x">
          <SectionHeader eyebrow="Core Values" title="The principles that guide us" />
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            {values.map((v) => (
              <div key={v.t} className="rounded-xl border bg-background p-6 text-center hover:border-gold hover:-translate-y-1 transition-all">
                <div className="h-12 w-12 mx-auto rounded-lg gradient-navy flex items-center justify-center text-gold mb-3">
                  <v.i className="h-6 w-6" />
                </div>
                <div className="font-semibold text-navy">{v.t}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-navy text-navy-foreground">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.4fr] items-center">
          <img src={officerImg} alt="Security officer" loading="lazy" width={1200} height={1400} className="rounded-2xl shadow-2xl object-cover w-full" />
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-gold mb-3">
              <span className="h-px w-8 bg-gold" /> Management Message
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">"Trust is earned every shift, every patrol, every response."</h2>
            <p className="mt-5 text-white/80 leading-relaxed">
              We built Gratom Babz on a simple promise — that our clients would never have to wonder whether their people and property are safe. Every officer we deploy carries that promise. From our control room operators to our K9 handlers, we operate as one disciplined team focused on outcomes that matter.
            </p>
            <p className="mt-4 text-white/70 leading-relaxed">
              Thank you for considering us. We look forward to earning your trust.
            </p>
            <div className="mt-6">
              <div className="font-semibold text-gold">— Managing Director</div>
              <div className="text-sm text-white/60">Gratom Babz Security Services Ltd</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-x">
          <SectionHeader eyebrow="Why Clients Choose Us" title="Built for measurable security outcomes" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { i: Shield, t: "Licensed & Insured", d: "Regulated under Kenya's PSIA framework with full liability coverage." },
              { i: Users, t: "Vetted Officers", d: "Background checks, medicals and continuous training." },
              { i: Zap, t: "Rapid Response", d: "Deployed reaction teams and armed backup in minutes." },
              { i: Award, t: "Proven Track Record", d: "Trusted by estates, corporates and industrial parks nationwide." },
              { i: Eye, t: "Total Visibility", d: "Digital patrol reports and monthly performance reviews." },
              { i: Handshake, t: "Client-First Culture", d: "Dedicated account managers who understand your site." },
            ].map((f) => (
              <div key={f.t} className="rounded-xl bg-background p-6 border shadow-sm hover:shadow-lg transition-shadow">
                <f.i className="h-8 w-8 text-gold mb-3" />
                <h3 className="font-semibold text-navy">{f.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
