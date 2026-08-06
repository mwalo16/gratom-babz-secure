import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "../components/site/Section";
import { MapPin, Phone, Clock } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/branches")({
  head: () => ({
    meta: [
      { title: "Our Branches — Gratom Babz Security" },
      { name: "description", content: "Head office on Kiambu Rd plus branches in Kiambu, Kikuyu/Wangige, Nairobi, Limuru, Thika and Mombasa/Malindi." },
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
  { name: "Head Office", location: "Kiambu Rd, off Kugeria North", region: "Kiambu County", postal: "P.O. Box 1800 – 00900 Kiambu", phone: "020 234 1729", alt: "0726 459 010 · 0729 337 005 · 0716 383 502", x: 40, y: 46 },
  { name: "Kiambu", location: "Rumathi House", region: "Kiambu County", phone: "0723 684 901", x: 47, y: 55 },
  { name: "Kikuyu / Wangige", location: "Bishop Kariuki Community Centre", region: "Kiambu County", phone: "0716 546 096", x: 33, y: 60 },
  { name: "Nairobi", location: "Ngara Fig Tree – Bhaveshi Centre", region: "Nairobi County", phone: "0726 382 628", x: 45, y: 70 },
  { name: "Limuru", location: "Ushirika Centre", region: "Kiambu County", phone: "0707 846 623", x: 26, y: 47 },
  { name: "Thika", location: "Savannah Building", region: "Kiambu County", phone: "0736 859 500", x: 58, y: 63 },
  { name: "Mombasa / Malindi", location: "Savannah Building", region: "Coast Region", phone: "0725 478 460", x: 72, y: 95 },
];

function Branches() {
  const [active, setActive] = useState<string>("Head Office");
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
                        <h3 className="font-bold text-lg text-navy">{b.name === "Head Office" ? "Head Office" : `${b.name} Branch`}</h3>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">{b.location} · {b.region}</div>
                      {b.postal && <div className="text-sm text-muted-foreground">{b.postal}</div>}
                    </div>
                    <a href={`tel:${b.phone.replace(/\s/g,"")}`} className="inline-flex items-center gap-2 rounded-md gradient-navy text-white px-4 py-2 text-sm font-semibold whitespace-nowrap">
                      <Phone className="h-4 w-4" /> Call
                    </a>
                  </div>
                  <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4 text-gold" /> {b.phone}</div>
                    <div className="flex items-center gap-2 text-muted-foreground"><Clock className="h-4 w-4 text-gold" /> Open 24 Hours</div>
                    {b.alt && <div className="sm:col-span-2 flex items-start gap-2 text-muted-foreground"><Phone className="h-4 w-4 text-gold mt-0.5" /> {b.alt}</div>}
                  </div>
                </div>
              ))}
              <div className="rounded-xl border border-dashed p-5 text-sm text-muted-foreground text-center">
                Affiliate members of PSIA, KNCCI, KEPSA and the Federation of Kenya Employers.
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
