import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "../components/site/Section";
import { MapPin, Phone, Clock } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/branches")({
  head: () => ({
    meta: [
      { title: "Our Branches — Gratom Babz Security" },
      { name: "description", content: "Branches in Kiambu, Murang'a, Nyeri and Nakuru with nationwide expansion." },
      { property: "og:title", content: "Branches — Gratom Babz Security" },
      { property: "og:description", content: "Where we operate across Kenya." },
      { property: "og:url", content: "/branches" },
    ],
    links: [{ rel: "canonical", href: "/branches" }],
  }),
  component: Branches,
});

// approximate coordinates as percentages within a stylized Kenya bounding box
const branches = [
  { name: "Kiambu", region: "Central", phone: "0726 459 010", x: 46, y: 62 },
  { name: "Murang'a", region: "Central", phone: "0736 859 500", x: 50, y: 55 },
  { name: "Nyeri", region: "Central", phone: "0725 478 460", x: 48, y: 48 },
  { name: "Nakuru", region: "Rift Valley", phone: "0723 684 901", x: 36, y: 55 },
];

function Branches() {
  const [active, setActive] = useState<string>("Kiambu");
  return (
    <>
      <PageHero title="Branches Across Kenya" subtitle="A growing network of regional offices coordinated from a central 24-hour control room." />

      <section className="py-16">
        <div className="container-x grid gap-10 lg:grid-cols-[1.1fr_1fr] items-start">
          {/* Stylized map */}
          <div className="relative rounded-2xl border bg-muted/40 aspect-[4/5] overflow-hidden shadow-inner">
            {/* Kenya silhouette (stylized) */}
            <svg viewBox="0 0 100 120" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="mapGrad" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stopColor="#0B2341" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#0B2341" stopOpacity="0.18" />
                </linearGradient>
              </defs>
              <path
                d="M20,30 L55,20 L80,28 L90,50 L82,72 L78,90 L65,105 L45,110 L28,100 L18,80 L15,55 Z"
                fill="url(#mapGrad)"
                stroke="#0B2341"
                strokeWidth="0.6"
                strokeOpacity="0.4"
              />
            </svg>
            {branches.map((b) => (
              <button
                key={b.name}
                onClick={() => setActive(b.name)}
                className="absolute -translate-x-1/2 -translate-y-full group"
                style={{ left: `${b.x}%`, top: `${b.y}%` }}
                aria-label={b.name}
              >
                <div className="relative">
                  <MapPin className={`h-8 w-8 drop-shadow-lg transition-all ${active === b.name ? "text-gold scale-125" : "text-navy hover:text-gold"}`} strokeWidth={2.5} fill={active === b.name ? "#D4A017" : "transparent"} />
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-xs font-bold text-navy whitespace-nowrap bg-white/90 px-2 py-0.5 rounded shadow">
                    {b.name}
                  </div>
                  {active === b.name && <div className="absolute inset-0 rounded-full bg-gold/40 animate-ping" />}
                </div>
              </button>
            ))}
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-navy mb-6">Our Locations</h2>
            <div className="space-y-4">
              {branches.map((b) => (
                <div
                  key={b.name}
                  onMouseEnter={() => setActive(b.name)}
                  className={`rounded-xl border p-5 bg-background transition-all cursor-pointer ${active === b.name ? "border-gold shadow-lg" : "hover:border-navy"}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-gold" />
                        <h3 className="font-bold text-lg text-navy">{b.name} Branch</h3>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">{b.region} Region, Kenya</div>
                    </div>
                    <a href={`tel:${b.phone.replace(/\s/g,"")}`} className="inline-flex items-center gap-2 rounded-md gradient-navy text-white px-4 py-2 text-sm font-semibold whitespace-nowrap">
                      <Phone className="h-4 w-4" /> Call
                    </a>
                  </div>
                  <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4 text-gold" /> {b.phone}</div>
                    <div className="flex items-center gap-2 text-muted-foreground"><Clock className="h-4 w-4 text-gold" /> Open 24 Hours</div>
                  </div>
                </div>
              ))}
              <div className="rounded-xl border border-dashed p-5 text-sm text-muted-foreground text-center">
                Expanding soon to Mombasa, Kisumu and Eldoret.
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
