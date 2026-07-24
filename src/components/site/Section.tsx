import type { ReactNode } from "react";

export function SectionHeader({ eyebrow, title, subtitle, center = true }: { eyebrow?: string; title: string; subtitle?: string; center?: boolean }) {
  return (
    <div className={`${center ? "text-center mx-auto" : ""} max-w-3xl mb-12`}>
      {eyebrow && (
        <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-gold mb-3">
          <span className="h-px w-8 bg-gold" /> {eyebrow}
        </div>
      )}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy">{title}</h2>
      {subtitle && <p className="mt-4 text-base sm:text-lg text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

export function PageHero({ title, subtitle, children }: { title: string; subtitle?: string; children?: ReactNode }) {
  return (
    <section className="relative gradient-navy text-navy-foreground overflow-hidden">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, rgba(212,160,23,0.35), transparent 40%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.15), transparent 40%)" }} />
      <div className="container-x relative py-20 md:py-28">
        <div className="max-w-3xl animate-fade-up">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-gold mb-3">
            <span className="h-px w-8 bg-gold" /> Gratom Babz Security
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">{title}</h1>
          {subtitle && <p className="mt-5 text-lg text-white/80 max-w-2xl">{subtitle}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}
