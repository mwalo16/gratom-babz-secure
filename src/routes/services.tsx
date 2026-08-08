import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "../components/site/Section";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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

const ICONS: Record<string, typeof Shield> = {
  Shield, Home, Building2, Factory, UserCheck, Users, Bike, Bell, Camera, Video,
  KeyRound, Fingerprint, Zap, Dog, ClipboardList, ShieldAlert, Car,
};

function Services() {
  const { data: services = [], isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("id, title, description, icon")
        .eq("published", true)
        .order("sort_order");
      if (error) throw error;
      return data;
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
                  <div key={s.id} className="group rounded-xl bg-background border p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
                    <div className="h-14 w-14 rounded-xl gradient-navy flex items-center justify-center text-gold mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-lg font-semibold text-navy">{s.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.description}</p>
                    <Link to="/contact" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-navy hover:text-gold transition-colors">
                      Learn more <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
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
