import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "../components/site/Section";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Gratom Babz Security — 24/7 Kenya" },
      { name: "description", content: "Reach our 24-hour control room, head office and operations team. Request a quote or emergency response." },
      { property: "og:title", content: "Contact — Gratom Babz Security" },
      { property: "og:description", content: "Talk to our security advisors." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <>
      <PageHero title="Get in Touch" subtitle="Available around the clock. Whether you're planning security for a new site or need emergency assistance, we're one call away." />

      <section className="py-16">
        <div className="container-x grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            { i: Phone, t: "Head Office", lines: ["020 234 1729", "0726 459 010", "0736 859 500"] },
            { i: Phone, t: "24-Hour Control Room", lines: ["0729 337 005"], accent: true },
            { i: Phone, t: "Operations Department", lines: ["0726 382 638", "0723 684 901", "0725 478 460"] },
            { i: Mail, t: "Email", lines: ["gtbabzservices@gmail.com", "gratombabzservices@yahoo.com"] },
          ].map((c) => (
            <div key={c.t} className={`rounded-xl p-6 border shadow-sm ${c.accent ? "gradient-navy text-navy-foreground border-gold/40" : "bg-background"}`}>
              <c.i className={`h-8 w-8 mb-3 ${c.accent ? "text-gold" : "text-gold"}`} />
              <h3 className={`font-bold ${c.accent ? "text-white" : "text-navy"}`}>{c.t}</h3>
              <div className="mt-3 space-y-1">
                {c.lines.map((l) => (
                  <a key={l} href={l.includes("@") ? `mailto:${l}` : `tel:${l.replace(/\s/g,"")}`} className={`block text-sm hover:underline ${c.accent ? "text-white/90" : "text-muted-foreground hover:text-navy"}`}>
                    {l}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 bg-muted/40">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold text-navy">Send us a message</h2>
            <p className="mt-2 text-muted-foreground">We respond to all quote requests within 24 hours.</p>
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="mt-6 space-y-4 rounded-2xl bg-background border p-6 md:p-8">
              {sent ? (
                <div className="rounded-md bg-gold/20 border border-gold p-4 text-sm text-navy">Thank you — we've received your message and will be in touch shortly.</div>
              ) : (
                <>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <F label="Full Name" required />
                    <F label="Phone" type="tel" required />
                    <F label="Email" type="email" required />
                    <F label="Service Needed" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Message</label>
                    <textarea rows={5} required className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:border-navy" />
                  </div>
                  <button className="w-full rounded-md gradient-navy text-white font-semibold py-3">Send Message</button>
                </>
              )}
            </form>
          </div>
          <div className="space-y-6">
            <div className="rounded-2xl overflow-hidden border shadow-md">
              <iframe
                title="Google Maps"
                src="https://www.google.com/maps?q=Nairobi,+Kenya&output=embed"
                width="100%"
                height="380"
                loading="lazy"
                className="block"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-background border p-5">
                <Clock className="h-6 w-6 text-gold" />
                <div className="mt-2 font-semibold text-navy">Business Hours</div>
                <div className="text-sm text-muted-foreground">Open 24 Hours · 7 Days</div>
              </div>
              <div className="rounded-xl bg-background border p-5">
                <MapPin className="h-6 w-6 text-gold" />
                <div className="mt-2 font-semibold text-navy">Head Office</div>
                <div className="text-sm text-muted-foreground">Nairobi, Kenya</div>
              </div>
            </div>
            <a href="https://wa.me/254729337005" target="_blank" rel="noopener" className="flex items-center justify-center gap-2 rounded-xl px-6 py-4 font-semibold text-white shadow-lg hover:shadow-xl transition-shadow" style={{ backgroundColor: "#25D366" }}>
              <MessageCircle className="h-5 w-5" /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function F({ label, type = "text", required = false }: { label: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input type={type} required={required} className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:border-navy" />
    </div>
  );
}
