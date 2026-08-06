import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "../components/site/Section";
import { Shield, Home, Building2, Factory, UserCheck, Users, Bike, Bell, Camera, Video, KeyRound, Fingerprint, Zap, Dog, ClipboardList, ShieldAlert, Car, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Security Services in Kenya — Gratom Babz" },
      { name: "description", content: "Manned guarding, CCTV, K9, mobile patrol, alarm response, access control and more — a complete security stack for Kenya." },
      { property: "og:title", content: "Services — Gratom Babz Security" },
      { property: "og:description", content: "Explore our full range of security services." },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: Services,
});

const services = [
  { i: Shield, t: "Security Guards & Guardettes", d: "Uniformed, vetted male and female officers for every environment." },
  { i: Home, t: "Residential Security", d: "Guards, patrols and monitoring for estates and homes." },
  { i: Building2, t: "Commercial Security", d: "Offices, retail, banks and hospitality protection." },
  { i: Factory, t: "Industrial Security", d: "Perimeter, asset and personnel protection for plants." },
  { i: UserCheck, t: "VIP Protection", d: "Trained close-protection officers for executives and dignitaries." },
  { i: Users, t: "Event Security", d: "Crowd control, access and rapid response for events." },
  { i: Bike, t: "Mobile Patrol", d: "GPS-tracked motorcycle and vehicle patrols." },
  { i: Bell, t: "Alarm Response & Back-up", d: "24/7 dispatch of reaction and back-up units on alarm trigger." },
  { i: Camera, t: "CCTV Installation", d: "Design, supply and installation of surveillance systems." },
  { i: Video, t: "CCTV Monitoring", d: "Live remote monitoring from our control room." },
  { i: KeyRound, t: "Access Control Systems", d: "Card, PIN and mobile-based site access." },
  { i: Fingerprint, t: "Biometric Systems", d: "Fingerprint and facial recognition entry solutions." },
  { i: Zap, t: "Electric Fence Installation", d: "Certified, energized perimeter fencing." },
  { i: Dog, t: "Security Dog Services", d: "Detection and deterrence dogs with certified handlers." },
  { i: Bell, t: "Intruder Alarm Systems", d: "Supply, installation and maintenance of intruder alarms." },
  { i: Car, t: "Car Tracking & Fleet Management", d: "GPS vehicle tracking, fuel monitoring and fleet reporting." },
  { i: ClipboardList, t: "Security Consultancy", d: "Advisory on strategy, policy and technology." },
  { i: ShieldAlert, t: "Risk Assessment", d: "Comprehensive on-site threat and vulnerability audits." },
];

function Services() {
  return (
    <>
      <PageHero title="Complete Security Services" subtitle="From uniformed officers to integrated technology stacks — everything you need under one accountable partner." />
      <section className="py-20">
        <div className="container-x">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div key={s.t} className="group rounded-xl bg-background border p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
                <div className="h-14 w-14 rounded-xl gradient-navy flex items-center justify-center text-gold mb-4 group-hover:scale-110 transition-transform">
                  <s.i className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-semibold text-navy">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.d}</p>
                <Link to="/contact" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-navy hover:text-gold transition-colors">
                  Learn more <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 bg-navy text-navy-foreground">
        <div className="container-x text-center">
          <h2 className="text-3xl md:text-4xl font-bold">Need a customized security solution?</h2>
          <p className="mt-3 text-white/80 max-w-2xl mx-auto">Every site is different. Our advisors will design a bundle to fit your risk profile and budget.</p>
          <Link to="/contact" className="mt-6 inline-flex items-center gap-2 rounded-md gradient-gold text-navy font-semibold px-6 py-3.5">Request a Consultation <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </>
  );
}
