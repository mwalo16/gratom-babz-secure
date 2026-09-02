import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import logo from "../../assets/gbs-logo.png.asset.json";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/gallery", label: "Gallery" },
  { to: "/branches", label: "Branches" },
  { to: "/careers", label: "Careers" },
  { to: "/contact", label: "Contact" },
] as const;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="hidden md:block bg-navy text-navy-foreground text-xs">
        <div className="container-x flex items-center justify-between py-2">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5"><Phone className="h-3 w-3 text-gold" /> 24/7 Control Room: 0729 337 005 · Hotline: 0707 846 623 · Head Office: 020 234 1729</span>
            <span className="opacity-70">gtbabzservices@gmail.com</span>
          </div>
          <span className="text-gold font-medium">...be assured of the BEST!</span>
        </div>
      </div>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-background/95 backdrop-blur shadow-md" : "bg-background"
        }`}
      >
        <div className="container-x flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2.5 group">
            <img src={logo.url} alt="Gratom Babz Security Services Ltd logo" width={48} height={48} className="h-11 w-auto object-contain" />
            <div className="leading-tight">
              <div className="font-display font-bold text-navy text-base sm:text-lg">Gratom Babz</div>
              <div className="text-[10px] sm:text-[11px] text-muted-foreground tracking-wider uppercase">Security Services Ltd</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                activeProps={{ className: "text-navy bg-muted" }}
                inactiveProps={{ className: "text-foreground/70 hover:text-navy hover:bg-muted" }}
                className="px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="tel:0729337005"
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-md gradient-gold text-navy font-semibold text-sm shadow-sm hover:shadow-md transition-shadow"
            >
              <Phone className="h-4 w-4" /> Emergency
            </a>
            <button
              className="lg:hidden p-2 rounded-md hover:bg-muted"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        {open && (
          <div className="lg:hidden border-t bg-background">
            <div className="container-x py-3 flex flex-col">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  activeOptions={{ exact: l.to === "/" }}
                  activeProps={{ className: "text-navy bg-muted" }}
                  className="px-3 py-3 rounded-md text-sm font-medium hover:bg-muted"
                >
                  {l.label}
                </Link>
              ))}
              <a href="tel:0729337005" className="mt-2 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-md gradient-gold text-navy font-semibold text-sm">
                <Phone className="h-4 w-4" /> Call Emergency Line
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
