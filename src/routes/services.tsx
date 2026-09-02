import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "../components/site/Section";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Home, Building2, Factory, UserCheck, Users, Bike, Bell, Camera, Video, KeyRound, Fingerprint, Zap, Dog, ClipboardList, ShieldAlert, Car, ArrowRight, Phone } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

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

const ICONS: Record<string, typeof Shield> = {
  Shield, Home, Building2, Factory, UserCheck, Users, Bike, Bell, Camera, Video,
  KeyRound, Fingerprint, Zap, Dog, ClipboardList, ShieldAlert, Car,
};

type Service = {
  id: string;
  title: string;
  description: string;
  details: string | null;
  icon: string;
  image_url: string | null;
};

function Services() {
  const [selected, setSelected] = useState<Service | null>(null);
  const { data: services = [], isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("id, title, description, details, icon, image_url")
        .eq("published", true)
        .order("sort_order");
      if (error) throw error;
      return data as Service[];
    },
  });

  return (
    <>
      <PageHero title="Complete Security Services" subtitle="From uniformed officers to integrated technology stacks — everything you need under one accountable partner." />
      <section className="py-20">
        <div className="container-x">
          {isLoading ? (
            <p className="text-center text-sm text-muted-foreground py-12">Loading services…</p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => {
                const Icon = ICONS[s.icon] ?? Shield;
                return (
                  <div key={s.id} className="group rounded-xl bg-background border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden flex flex-col">
                    {s.image_url ? (
                      <div className="relative h-56 overflow-hidden">
                        <img src={s.image_url} alt={`${s.title} — Gratom Babz Security`} loading="lazy" className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
                        <div className="absolute bottom-3 left-3 h-11 w-11 rounded-lg gradient-navy flex items-center justify-center text-gold shadow-lg">
                          <Icon className="h-6 w-6" />
                        </div>
                      </div>
                    ) : (
                      <div className="h-14 w-14 rounded-xl gradient-navy flex items-center justify-center text-gold mt-6 ml-6">
                        <Icon className="h-7 w-7" />
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-lg font-semibold text-navy">{s.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">{s.description}</p>
                    <button
                      onClick={() => setSelected(s)}
                      className="mt-4 self-start inline-flex items-center gap-1.5 text-sm font-semibold text-navy hover:text-gold transition-colors"
                    >
                      Learn more <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  {(() => {
                    const Icon = ICONS[selected.icon] ?? Shield;
                    return (
                      <div className="h-11 w-11 rounded-lg gradient-navy flex items-center justify-center text-gold shrink-0">
                        <Icon className="h-6 w-6" />
                      </div>
                    );
                  })()}
                  <DialogTitle className="text-xl text-navy">{selected.title}</DialogTitle>
                </div>
                <DialogDescription className="text-sm text-muted-foreground pt-1">{selected.description}</DialogDescription>
              </DialogHeader>
              <div className="space-y-5">
                {selected.image_url && (
                  <img src={selected.image_url} alt={`${selected.title} — Gratom Babz Security`} className="w-full max-h-[26rem] object-contain rounded-xl bg-navy/5" />
                )}
                <p className="text-sm leading-relaxed text-foreground/90">
                  {selected.details || "Detailed description coming soon. Contact us for more information about this service."}
                </p>
                <div className="rounded-xl bg-muted/40 border p-4">
                  <h4 className="text-sm font-semibold text-navy mb-2">Interested in this service?</h4>
                  <p className="text-sm text-muted-foreground mb-3">Speak with our team for a tailored quote or site assessment.</p>
                  <div className="flex flex-wrap gap-3">
                    <Link to="/contact" onClick={() => setSelected(null)} className="inline-flex items-center gap-2 rounded-md gradient-gold text-navy font-semibold px-4 py-2.5 text-sm">
                      <Phone className="h-4 w-4" /> Get in touch
                    </Link>
                    <a href="tel:0729337005" className="inline-flex items-center gap-2 rounded-md border px-4 py-2.5 text-sm font-medium hover:border-navy transition-colors">
                      <Phone className="h-4 w-4" /> Call 0729 337 005
                    </a>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

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
