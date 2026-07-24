import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Shield, Users, Radio, MapPin, Clock, Zap, ArrowRight, CheckCircle2, Award, HeartHandshake, Star } from "lucide-react";
import heroImg from "../assets/hero.jpg";
import k9Img from "../assets/k9.jpg";
import motoImg from "../assets/motorcycle.jpg";
import teamImg from "../assets/team.jpg";
import controlImg from "../assets/control-room.jpg";
import { SectionHeader } from "../components/site/Section";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gratom Babz Security Services Ltd — Trusted Security in Kenya" },
      { name: "description", content: "Licensed Kenyan security company offering manned guarding, CCTV, K9, mobile patrol and 24/7 alarm response nationwide." },
      { property: "og:title", content: "Gratom Babz Security Services Ltd" },
      { property: "og:description", content: "Professional 24/7 security solutions across Kenya. Your Security, Our Priority." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function useCounter(target: number, duration = 1600, start = false) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf = 0; const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - t0) / duration, 1);
      setN(Math.floor(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);
  return n;
}

function Stat({ n, suffix, label, visible }: { n: number; suffix: string; label: string; visible: boolean }) {
  const v = useCounter(n, 1800, visible);
  return (
    <div className="rounded-xl bg-white/10 backdrop-blur border border-white/15 p-5 text-center">
      <div className="text-3xl md:text-4xl font-bold text-gold">{v.toLocaleString()}{suffix}</div>
      <div className="mt-1 text-xs md:text-sm text-white/80 uppercase tracking-wider">{label}</div>
    </div>
  );
}

function Counters() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); }}, { threshold: 0.3 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  const stats = [
    { n: 24, suffix: "/7", label: "Operations" },
    { n: 15, suffix: "+", label: "Rapid Response Teams" },
    { n: 4, suffix: "", label: "Branches Nationwide" },
    { n: 1200, suffix: "+", label: "Trained Officers" },
    { n: 5000, suffix: "+", label: "Protected Properties" },
  ];
  return (
    <div ref={ref} className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
      {stats.map((s) => <Stat key={s.label} {...s} visible={visible} />)}
    </div>
  );
}

function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <img src={heroImg} alt="Gratom Babz patrol vehicle and motorcycle unit at dusk" width={1920} height={1080} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/80 to-navy/40" />
        <div className="container-x relative py-20 md:py-28 text-navy-foreground">
          <div className="max-w-3xl animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold text-gold uppercase tracking-widest">
              <Shield className="h-3.5 w-3.5" /> Licensed by PSIA Kenya
            </div>
            <h1 className="mt-5 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05]">
              Professional Security<br />
              Solutions You Can <span className="text-gold">Trust</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/85 max-w-2xl">
              Providing reliable, innovative and professional security services across Kenya — 24 hours a day, every day.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/contact" className="inline-flex items-center gap-2 rounded-md gradient-gold text-navy font-semibold px-6 py-3.5 shadow-lg hover:shadow-xl transition-shadow">
                Request Security Services <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 rounded-md border border-white/30 bg-white/10 backdrop-blur text-white font-semibold px-6 py-3.5 hover:bg-white/20 transition-colors">
                Get a Free Quote
              </Link>
            </div>
          </div>
          <div className="mt-14">
            <Counters />
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="py-20 md:py-28 bg-muted/40">
        <div className="container-x">
          <SectionHeader eyebrow="Why Choose Us" title="Why Choose Gratom Babz" subtitle="Six reasons Kenya's leading homes, corporates and industries trust us with their security." />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { i: Shield, t: "Licensed Security Company", d: "Fully licensed and regulated under Kenya's PSIA framework." },
              { i: Users, t: "Highly Trained Officers", d: "Rigorous vetting, physical training and continuous professional development." },
              { i: Zap, t: "Modern Technology", d: "GPS-tracked patrols, digital reporting and integrated alarm systems." },
              { i: Radio, t: "24-Hour Control Room", d: "Live monitoring and dispatch every hour of every day." },
              { i: MapPin, t: "Nationwide Coverage", d: "Branches across the Central and Rift Valley regions with expansion in progress." },
              { i: Clock, t: "Rapid Response Teams", d: "Armed and unarmed reaction units ready to deploy in minutes." },
            ].map((f) => (
              <div key={f.t} className="group rounded-xl bg-background p-6 shadow-sm border hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className="h-12 w-12 rounded-lg gradient-navy flex items-center justify-center text-gold mb-4 group-hover:scale-110 transition-transform">
                  <f.i className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-navy">{f.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT STRIP */}
      <section className="py-20 md:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-2 items-center">
          <div className="relative">
            <img src={teamImg} alt="Gratom Babz security team in formation" loading="lazy" width={1600} height={900} className="rounded-2xl shadow-xl w-full h-auto object-cover" />
            <div className="absolute -bottom-6 -right-4 md:-right-8 rounded-xl bg-navy text-navy-foreground px-6 py-4 shadow-xl border border-gold/30">
              <div className="text-3xl font-bold text-gold">15+</div>
              <div className="text-xs uppercase tracking-wider">Years of Excellence</div>
            </div>
          </div>
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-gold mb-3">
              <span className="h-px w-8 bg-gold" /> About Us
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-navy">A trusted name in Kenyan security.</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Gratom Babz Security Services Ltd is a fully licensed Kenyan private security company committed to protecting people, property and business continuity. From residential estates to industrial complexes, we deliver disciplined, technology-driven security.
            </p>
            <ul className="mt-6 space-y-3">
              {["Vetted, uniformed, insured officers","Integrated CCTV, alarm and access control","Dedicated key account managers","Transparent monthly reporting"].map((t) => (
                <li key={t} className="flex items-start gap-3"><CheckCircle2 className="h-5 w-5 text-gold mt-0.5 shrink-0" /><span className="text-sm">{t}</span></li>
              ))}
            </ul>
            <div className="mt-8 flex gap-3">
              <Link to="/about" className="inline-flex items-center gap-2 rounded-md gradient-navy text-white px-5 py-3 text-sm font-semibold">Our Story <ArrowRight className="h-4 w-4" /></Link>
              <Link to="/services" className="inline-flex items-center gap-2 rounded-md border-2 border-navy text-navy px-5 py-3 text-sm font-semibold hover:bg-navy hover:text-white transition-colors">Explore Services</Link>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="py-20 md:py-28 bg-navy text-navy-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 30% 20%, #D4A017 0%, transparent 40%)" }} />
        <div className="container-x relative">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-gold mb-3">
                <span className="h-px w-8 bg-gold" /> Our Services
              </div>
              <h2 className="text-3xl md:text-5xl font-bold">End-to-end security, one trusted partner.</h2>
            </div>
            <Link to="/services" className="inline-flex items-center gap-2 text-gold font-semibold hover:gap-3 transition-all">See all services <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { img: teamImg, t: "Manned Guarding", d: "Uniformed officers for residential, commercial and industrial sites." },
              { img: motoImg, t: "Mobile Patrol", d: "GPS-tracked motorcycle and vehicle patrols across every zone." },
              { img: k9Img, t: "K9 Dog Unit", d: "Trained detection and deterrence dogs with certified handlers." },
              { img: controlImg, t: "CCTV & Monitoring", d: "Installation, remote monitoring and rapid alarm response." },
              { img: heroImg, t: "VIP Protection", d: "Discreet close-protection for executives, dignitaries and families." },
              { img: teamImg, t: "Event Security", d: "Crowd management and access control for events of any scale." },
            ].map((s) => (
              <Link key={s.t} to="/services" className="group relative overflow-hidden rounded-xl aspect-[4/3]">
                <img src={s.img} alt={s.t} loading="lazy" className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/70 to-transparent" />
                <div className="absolute inset-0 p-5 flex flex-col justify-end">
                  <h3 className="text-lg font-semibold">{s.t}</h3>
                  <p className="mt-1 text-sm text-white/80">{s.d}</p>
                  <div className="mt-3 inline-flex items-center gap-1 text-gold text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="py-20 md:py-24">
        <div className="container-x">
          <SectionHeader eyebrow="Industries We Protect" title="Trusted across every sector" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {["Residential","Corporate","Retail","Banking","Hospitality","Education","Healthcare","Manufacturing","Logistics","Construction","Government","NGOs"].map((i) => (
              <div key={i} className="rounded-lg border bg-background p-4 text-center text-sm font-medium hover:border-gold hover:text-navy transition-colors">{i}</div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 md:py-24 bg-muted/40">
        <div className="container-x">
          <SectionHeader eyebrow="Testimonials" title="What our clients say" />
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { n: "Jane M.", r: "Estate Chairperson, Kiambu", q: "Gratom Babz has transformed how our estate feels at night. Response times are excellent and officers are disciplined." },
              { n: "Peter K.", r: "Operations Director, Nakuru", q: "Their integrated CCTV and manned guarding stack has cut our incident rate to almost zero." },
              { n: "Aisha H.", r: "Homeowner, Nyeri", q: "Professional from the guards on site to the control room. Peace of mind, delivered." },
            ].map((t) => (
              <div key={t.n} className="rounded-xl bg-background p-6 border shadow-sm">
                <div className="flex text-gold mb-3">{[...Array(5)].map((_,i)=><Star key={i} className="h-4 w-4 fill-current" />)}</div>
                <p className="text-sm text-foreground leading-relaxed">"{t.q}"</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full gradient-navy text-gold font-bold flex items-center justify-center">{t.n[0]}</div>
                  <div>
                    <div className="font-semibold text-sm">{t.n}</div>
                    <div className="text-xs text-muted-foreground">{t.r}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container-x">
          <div className="relative overflow-hidden rounded-3xl gradient-navy px-8 py-16 md:p-16 text-center text-navy-foreground">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, #D4A017 0%, transparent 40%), radial-gradient(circle at 80% 70%, #D4A017 0%, transparent 40%)" }} />
            <div className="relative max-w-2xl mx-auto">
              <HeartHandshake className="h-12 w-12 text-gold mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold">Ready to secure what matters?</h2>
              <p className="mt-4 text-white/80">Speak to our security advisors and get a tailored quotation within 24 hours.</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link to="/contact" className="inline-flex items-center gap-2 rounded-md gradient-gold text-navy font-semibold px-6 py-3.5">Get a Free Quote <ArrowRight className="h-4 w-4" /></Link>
                <a href="tel:0729337005" className="inline-flex items-center gap-2 rounded-md border border-white/30 text-white font-semibold px-6 py-3.5 hover:bg-white/10">Call 0729 337 005</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency banner */}
      <section className="py-6 bg-gold text-navy">
        <div className="container-x flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="font-semibold text-lg flex items-center gap-2"><Award className="h-5 w-5" /> 24-Hour Emergency Hotline</div>
          <a href="tel:0729337005" className="font-bold text-xl md:text-2xl hover:underline">0729 337 005</a>
        </div>
      </section>
    </>
  );
}
