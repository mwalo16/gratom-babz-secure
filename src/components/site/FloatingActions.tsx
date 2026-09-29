import { useEffect, useState } from "react";
import { Phone, MessageCircle, ArrowUp } from "lucide-react";

export const WHATSAPP_URL = "https://wa.me/254729337005";

export function FloatingActions() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed right-4 bottom-4 z-40 flex flex-col gap-3">
      {show && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="h-11 w-11 rounded-full bg-navy text-navy-foreground shadow-lg flex items-center justify-center hover:bg-navy/90 animate-fade-in"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
      <a href="tel:0729337005" aria-label="Call" title="Call Us Now" className="group relative h-12 w-12 rounded-full gradient-navy text-white shadow-lg flex items-center justify-center hover:scale-105 transition-transform">
        <span className="absolute inset-0 rounded-full bg-gold/60 animate-ping" />
        <span className="absolute -inset-1 rounded-full border-2 border-gold/50 animate-pulse" />
        <Phone className="relative h-5 w-5 animate-[wiggle_1.5s_ease-in-out_infinite]" />
        <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-md bg-navy px-3 py-1.5 text-sm font-medium text-navy-foreground shadow-lg opacity-0 translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0">
          Call Us Now
        </span>
      </a>
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="h-12 w-12 rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
        style={{ backgroundColor: "#25D366", color: "white" }}
      >
        <MessageCircle className="h-5 w-5" />
      </a>
    </div>
  );
}
