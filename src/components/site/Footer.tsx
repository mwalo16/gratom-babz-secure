import { Link } from "@tanstack/react-router";
import { ShieldCheck, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-navy text-navy-foreground mt-24">
      <div className="container-x py-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-md bg-white/10 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-gold" />
            </div>
            <div>
              <div className="font-display font-bold">Gratom Babz</div>
              <div className="text-[11px] uppercase tracking-wider text-white/60">Security Services Ltd</div>
            </div>
          </div>
          <p className="mt-4 text-sm text-white/70 leading-relaxed">
            A licensed Kenyan private security company delivering 24/7 protection to homes, businesses and industries nationwide.
          </p>
          <div className="mt-5 flex gap-3">
            {[Facebook, Twitter, Instagram, Linkedin].map((I, i) => (
              <a key={i} href="#" className="h-9 w-9 rounded-md bg-white/10 hover:bg-gold hover:text-navy flex items-center justify-center transition-colors" aria-label="social">
                <I className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-white/80">
            {["about","services","gallery","branches","careers","contact"].map((s) => (
              <li key={s}><Link to={`/${s}`} className="hover:text-gold capitalize">{s}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gold mb-4">Emergency Numbers</h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li className="flex items-start gap-2"><Phone className="h-4 w-4 mt-0.5 text-gold" /> Control Room: 0729 337 005</li>
            <li className="flex items-start gap-2"><Phone className="h-4 w-4 mt-0.5 text-gold" /> Ops: 0726 382 638</li>
            <li className="flex items-start gap-2"><Phone className="h-4 w-4 mt-0.5 text-gold" /> Head Office: 020 234 1729</li>
            <li className="flex items-start gap-2"><Mail className="h-4 w-4 mt-0.5 text-gold" /> gtbabzservices@gmail.com</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gold mb-4">Newsletter</h4>
          <p className="text-sm text-white/70 mb-3">Security tips and company updates.</p>
          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input type="email" required placeholder="Email address" className="flex-1 rounded-md bg-white/10 border border-white/20 px-3 py-2 text-sm placeholder:text-white/50 focus:outline-none focus:border-gold" />
            <button className="rounded-md gradient-gold text-navy font-semibold px-4 py-2 text-sm">Join</button>
          </form>
          <div className="mt-5 flex items-start gap-2 text-sm text-white/70">
            <MapPin className="h-4 w-4 mt-0.5 text-gold" /> Head Office, Nairobi, Kenya
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/60">
          <div>© {new Date().getFullYear()} Gratom Babz Security Services Ltd. All Rights Reserved.</div>
          <div>Licensed & Regulated | PSIA Compliant</div>
        </div>
      </div>
    </footer>
  );
}
