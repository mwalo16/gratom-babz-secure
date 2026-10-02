import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import logo from "../../assets/gbs-logo.png.asset.json";
import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(5, { message: "Please enter a valid email address." })
  .max(200, { message: "That email address is too long." })
  .email({ message: "Please enter a valid email address." });


export function Footer() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please enter a valid email address.");
      return;
    }
    const value = parsed.data;
    setSubmitting(true);
    try {
      const { error } = await supabase.from("newsletter_subscribers").insert({ email: value });
      if (error) {
        if (error.code === "23505") {
          toast.success("You're already subscribed. Thank you!");
          setEmail("");
        } else {
          toast.error("Could not subscribe right now. Please try again.");
        }
      } else {
        toast.success("Thanks for subscribing! We'll be in touch.");
        setEmail("");
      }
    } catch {
      toast.error("Could not subscribe right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <footer className="bg-navy text-navy-foreground mt-24">
      <div className="container-x py-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center rounded-lg bg-white p-1.5 shadow-sm">
              <img src={logo.url} alt="Gratom Babz Security Services Ltd logo" width={48} height={48} className="h-12 w-auto object-contain" />
            </span>
            <div>
              <div className="font-display font-bold">Gratom Babz</div>
              <div className="text-[11px] uppercase tracking-wider text-white/60">Security Services Ltd</div>
            </div>
          </div>
          <p className="mt-4 text-sm text-white/70 leading-relaxed">
            ...be assured of the BEST. A licensed Kenyan private security company delivering 24/7 guarding, dog services, alarm response, CCTV, electric fencing and fleet tracking.
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
            {(["/about","/services","/gallery","/branches","/careers","/contact"] as const).map((s) => (
              <li key={s}><Link to={s} className="hover:text-gold capitalize">{s.slice(1)}</Link></li>
            ))}
            <li><Link to="/blog/choosing-a-security-company-kenya" className="hover:text-gold">Choosing a Security Company</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gold mb-4">Emergency Numbers</h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li className="flex items-start gap-2"><Phone className="h-4 w-4 mt-0.5 text-gold" /> HQ Control Room Hotline: 0729 337 005</li>
            <li className="flex items-start gap-2"><Phone className="h-4 w-4 mt-0.5 text-gold" /> Limuru Control Room Hotline: 0707 846 623</li>
            <li className="flex items-start gap-2"><Phone className="h-4 w-4 mt-0.5 text-gold" /> Alt: 0726 459 010</li>
            <li className="flex items-start gap-2"><Phone className="h-4 w-4 mt-0.5 text-gold" /> Alt: 0716 383 502</li>
            <li className="flex items-start gap-2"><Phone className="h-4 w-4 mt-0.5 text-gold" /> Head Office: 020 234 1729</li>
            {["gtbabzservices@gmail.com", "info@gratombabzservices.com", "Gratombabzservices@yahoo.com"].map((m) => (
              <li key={m} className="flex items-start gap-2"><Mail className="h-4 w-4 mt-0.5 text-gold" /> <a href={`mailto:${m}`} className="hover:text-gold break-all">{m}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gold mb-4">Newsletter</h4>
          <p className="text-sm text-white/70 mb-3">Security tips and company updates.</p>
          <form className="flex gap-2" onSubmit={handleSubscribe}>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="flex-1 rounded-md bg-white/10 border border-white/20 px-3 py-2 text-sm placeholder:text-white/50 focus:outline-none focus:border-gold"
            />
            <button type="submit" disabled={submitting} className="rounded-md gradient-gold text-navy font-semibold px-4 py-2 text-sm inline-flex items-center gap-1.5 disabled:opacity-70">
              {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Join
            </button>
          </form>
          <div className="mt-5 flex items-start gap-2 text-sm text-white/70">
            <MapPin className="h-4 w-4 mt-0.5 text-gold" /> Head Office: Kiambu Rd, off Kugeria North · P.O. Box 1800–00900, Kiambu
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/60">
          <div>© {new Date().getFullYear()} Gratom Babz Security Services Ltd. All Rights Reserved.</div>
          <div>Licensed & Regulated · Affiliate member of PSIA, KNCCI, KEPSA & FKE</div>
        </div>
      </div>
    </footer>
  );
}
