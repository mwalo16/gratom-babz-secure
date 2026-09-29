import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "../components/site/Section";
import { MapPin, Phone, Clock } from "lucide-react";
import { useState } from "react";

// approximate coordinates as percentages within a stylized Kenya bounding box
const branches = [
  { name: "Head Office", location: "Kiambu Rd, off Kugeria North", region: "Kiambu County", postal: "P.O. Box 1800 – 00900 Kiambu", phone: "020 234 1729", alt: "0726 459 010 · 0729 337 005 · 0716 383 502" },
  { name: "Kiambu", location: "Rumathi House", region: "Kiambu County", phone: "0723 684 901" },
  { name: "Kikuyu / Wangige", location: "Bishop Kariuki Centre", region: "Kiambu County", phone: "0716 546 096" },
  { name: "Nairobi", location: "Ngara Fig Tree – Bhaveshi Centre", region: "Nairobi County", phone: "0726 382 628" },
  { name: "Limuru", location: "Ushirika Centre", region: "Kiambu County", phone: "0707 846 623" },
  { name: "Thika", location: "Thika town", region: "Kiambu County", phone: "0736 859 500" },
  { name: "Mombasa / Malindi", location: "Savannah Building", region: "Coast Region", phone: "0725 478 460" },
];

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
    scripts: branches.map((b) => ({
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SecurityService",
        name: `Gratom Babz Security Services Ltd — ${b.name}`,
        parentOrganization: { "@type": "Organization", name: "Gratom Babz Security Services Ltd" },
        telephone: b.phone,
        areaServed: b.region,
        address: {
          "@type": "PostalAddress",
          streetAddress: b.location,
          addressLocality: b.name === "Head Office" ? "Kiambu" : b.name,
          addressRegion: b.region,
          addressCountry: "KE",
        },
      }),
    })),
  }),
  component: Branches,
});


function Branches() {
  const [active, setActive] = useState<string>("Head Office");
  const current = branches.find((b) => b.name === active) ?? branches[0];
  const mapQuery = `${current.location}, ${current.name === "Head Office" ? "Kiambu" : current.name}, Kenya`;
  return (
    <>
      <PageHero title="Branches Across Kenya" subtitle="A growing network of regional offices coordinated from a central 24-hour control room." />

      <section className="py-16">
        <div className="container-x grid gap-10 lg:grid-cols-[1.1fr_1fr] items-start">
          {/* Map of the selected office */}
          <div className="lg:sticky lg:top-28 space-y-4">
            <div className="rounded-2xl border overflow-hidden shadow-md">
              <iframe
                title={`Map of ${active}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
                width="100%"
                height="460"
                loading="lazy"
                className="block"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {branches.map((b) => (
                <button
                  key={b.name}
                  onClick={() => setActive(b.name)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${active === b.name ? "bg-navy text-navy-foreground border-navy" : "bg-background hover:border-navy"}`}
                >
                  <MapPin className="h-3.5 w-3.5" /> {b.name}
                </button>
              ))}
            </div>
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

      <section className="py-16 bg-muted/40 border-t">
        <div className="container-x">
          <div className="max-w-3xl mb-10">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-gold mb-3">
              <span className="h-px w-8 bg-gold" /> Client Deployments
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-navy">Fresha Dairy Brands — Guarding Services</h2>
            <p className="mt-3 text-muted-foreground">
              We provide manned guarding for Fresha Dairy Brands, a milk processing and production company, at its headquarters and regional depots across Kenya.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {freshaSites.map((s) => (
              <a
                key={s.name}
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.q)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`rounded-xl border p-5 bg-background transition-all hover:shadow-lg ${s.hq ? "border-gold" : "hover:border-navy"}`}
              >
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-gold" />
                  <h3 className="font-bold text-lg text-navy">{s.name}</h3>
                </div>
                <div className="text-sm text-muted-foreground mt-1">{s.hq ? "Fresha Headquarters (Main Offices)" : "Fresha Depot"}</div>
                {s.street && <div className="text-sm text-muted-foreground">{s.street}</div>}
                <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground"><Clock className="h-4 w-4 text-gold" /> 24/7 Manned Guarding</div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

const freshaSites = [
  { name: "Githunguri", hq: true, q: "WQRH+H4H Githunguri, Kenya" },
  { name: "Nakuru", q: "9G48+3M Nakuru, Kenya" },
  { name: "Kisumu", q: "VQC9+P9 Kisumu, Kenya" },
  { name: "Mwingi", q: "3384+5V2 Mwingi, Kenya", street: "K.C.B – Kenya Power Road, Mwingi Township" },
  { name: "Emali", q: "GG2G+XG Emali, Kenya" },
  { name: "Chaka", q: "X94X+H7 Chaka, Kenya" },
] as { name: string; hq?: boolean; q: string; street?: string }[];
