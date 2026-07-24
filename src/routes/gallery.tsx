import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "../components/site/Section";
import { useState } from "react";
import heroImg from "../assets/hero.jpg";
import k9Img from "../assets/k9.jpg";
import motoImg from "../assets/motorcycle.jpg";
import teamImg from "../assets/team.jpg";
import controlImg from "../assets/control-room.jpg";
import patrolImg from "../assets/patrol.jpg";
import cctvImg from "../assets/cctv.jpg";
import officerImg from "../assets/officer.jpg";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Gratom Babz Security" },
      { name: "description", content: "See our patrol vehicles, K9 unit, officers, CCTV installations and control room in action." },
      { property: "og:title", content: "Gallery — Gratom Babz Security" },
      { property: "og:description", content: "Photos of our teams, vehicles and operations." },
      { property: "og:url", content: "/gallery" },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
  component: Gallery,
});

const items = [
  { src: patrolImg, cat: "Patrol Vehicles", w: 6, h: 4 },
  { src: motoImg, cat: "Motorcycle Patrol", w: 4, h: 5 },
  { src: officerImg, cat: "Security Officers", w: 4, h: 6 },
  { src: k9Img, cat: "K9 Unit", w: 6, h: 4 },
  { src: cctvImg, cat: "CCTV Installation", w: 6, h: 4 },
  { src: controlImg, cat: "Control Room", w: 6, h: 5 },
  { src: teamImg, cat: "Corporate Events", w: 8, h: 5 },
  { src: heroImg, cat: "Patrol Vehicles", w: 8, h: 4 },
];

const cats = ["All","Patrol Vehicles","Motorcycle Patrol","Security Officers","K9 Unit","CCTV Installation","Control Room","Corporate Events"];

function Gallery() {
  const [active, setActive] = useState("All");
  const [preview, setPreview] = useState<string | null>(null);
  const filtered = active === "All" ? items : items.filter(i => i.cat === active);
  return (
    <>
      <PageHero title="Our Gallery" subtitle="A look inside our operations — the people, vehicles and technology keeping Kenya safe." />
      <section className="py-16">
        <div className="container-x">
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {cats.map(c => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${active === c ? "bg-navy text-navy-foreground border-navy" : "bg-background text-foreground hover:border-navy"}`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
            {filtered.map((it, i) => (
              <button
                key={i}
                onClick={() => setPreview(it.src)}
                className="mb-4 block w-full break-inside-avoid rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow group relative"
              >
                <img src={it.src} alt={it.cat} loading="lazy" className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/30 transition-colors flex items-end p-4">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-sm font-semibold bg-navy/80 px-3 py-1.5 rounded-full">{it.cat}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
      {preview && (
        <div onClick={() => setPreview(null)} className="fixed inset-0 z-50 bg-navy/90 backdrop-blur flex items-center justify-center p-4 cursor-zoom-out">
          <img src={preview} alt="preview" className="max-h-[90vh] max-w-[95vw] rounded-lg shadow-2xl" />
        </div>
      )}
    </>
  );
}
