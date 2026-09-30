import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "../components/site/Section";
import { CheckCircle2 } from "lucide-react";

const TITLE = "How to Choose a Private Security Company in Kenya";
const DESC =
  "A practical guide to choosing a private security company in Kenya: PSRA licensing, vetted and trained guards, rapid response, contracts and red flags.";

const faqs = [
  { q: "Who regulates private security companies in Kenya?", a: "The Private Security Regulatory Authority (PSRA), set up under the Private Security Regulation Act, 2016. Every security firm and guard must be registered and licensed with PSRA." },
  { q: "How can I check if a security company is licensed?", a: "Ask for the company's current PSRA licence and registration details, then confirm them with PSRA. A reputable firm will share them without hesitation." },
  { q: "What is PSIA?", a: "The Protective and Safety Industry Association is an industry body for security companies in Kenya. Membership shows a firm engages with industry standards, but it does not replace a PSRA licence." },
  { q: "What should a security contract include?", a: "Scope of services, number and hours of guards, supervision, response times, reporting, liability and insurance, pricing, and notice terms." },
];

export const Route = createFileRoute("/blog/choosing-a-security-company-kenya")({
  head: () => ({
    meta: [
      { title: "Choosing a Security Company in Kenya | Gratom Babz" },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/blog/choosing-a-security-company-kenya" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: "/blog/choosing-a-security-company-kenya" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "Article", headline: TITLE, description: DESC, author: { "@type": "Organization", name: "Gratom Babz Security Services Ltd" }, publisher: { "@type": "Organization", name: "Gratom Babz Security Services Ltd" } },
            { "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
          ],
        }),
      },
    ],
  }),
  component: Guide,
});

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-12 mb-4 text-2xl md:text-3xl font-bold text-navy">{children}</h2>;
}
function List({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 space-y-3">
      {items.map((i) => (
        <li key={i} className="flex gap-3"><CheckCircle2 className="h-5 w-5 text-gold shrink-0 mt-0.5" /><span>{i}</span></li>
      ))}
    </ul>
  );
}

function Guide() {
  return (
    <>
      <PageHero title={TITLE} subtitle="What to check before you hire a private security company in Kenya, from licensing to guard training to rapid response." />
      <article className="py-16">
        <div className="container-x max-w-3xl text-muted-foreground leading-relaxed">
          <p>
            Your security provider protects your people, property and reputation, so price shouldn't be the only thing you compare. Whether you need security guard services in Nairobi, manned guarding for a factory, or alarm response for your home, these are the checks that separate a reliable private security company in Kenya from a risky one.
          </p>

          <H2>1. Confirm the company is licensed by PSRA</H2>
          <p>
            Private security in Kenya is regulated by the Private Security Regulatory Authority (PSRA) under the Private Security Regulation Act, 2016. A company that isn't registered and licensed is operating illegally, and that can leave you exposed if something goes wrong.
          </p>
          <List items={[
            "Ask for a current PSRA licence and check it with the authority.",
            "Check that guards are registered too, not just the company.",
            "Look for industry membership such as PSIA as a sign the firm engages with professional standards.",
            "Confirm the company is up to date with statutory obligations such as NSSF, SHIF and minimum wage.",
          ]} />

          <H2>2. Ask how guards are vetted and trained</H2>
          <p>A guard is only as reliable as the vetting and training behind them. Ask the provider to explain its process:</p>
          <List items={[
            "Background checks, including a police clearance certificate (certificate of good conduct).",
            "Verified identity, references and previous employment.",
            "Formal training in patrolling, access control, report writing, first aid and fire safety.",
            "Refresher training and regular on-site supervision.",
            "Proper uniforms, identification and communication equipment.",
          ]} />

          <H2>3. Evaluate rapid response capability</H2>
          <p>An alarm or panic button is only useful if someone arrives quickly. Ask:</p>
          <List items={[
            "Is there a 24-hour control room, and how is it staffed?",
            "How many response vehicles cover your area, and what are the typical response times?",
            "How are incidents escalated to the police and reported back to you?",
            "Can they supply specialist support such as K9 units or motorcycle patrols?",
          ]} />

          <H2>4. Check that services match your needs</H2>
          <p>
            A residential estate, a warehouse and a corporate office have very different risks. A good provider will carry out a site risk assessment and suggest a mix of manned guarding, CCTV, alarms, electric fencing, access control or vehicle tracking, rather than selling a one-size-fits-all package.
          </p>

          <H2>5. Look for local presence and references</H2>
          <p>
            Branches and supervisors near your site mean faster support and better oversight. Ask for references from clients similar to you, and how long the provider has worked with them.
          </p>

          <H2>6. Read the contract carefully</H2>
          <List items={[
            "Clear scope: number of guards, shifts and duties.",
            "Supervision and reporting schedule.",
            "Response time commitments.",
            "Liability and insurance cover.",
            "Transparent pricing with no hidden charges, and fair notice terms.",
          ]} />

          <H2>Red flags to watch for</H2>
          <List items={[
            "Unable or unwilling to show a PSRA licence.",
            "Prices far below the market, which often means underpaid, untrained guards.",
            "No control room or response team.",
            "Vague contracts and no named supervisor.",
          ]} />

          <H2>Frequently asked questions</H2>
          <div className="space-y-6">
            {faqs.map((f) => (
              <div key={f.q}>
                <h3 className="font-semibold text-navy">{f.q}</h3>
                <p className="mt-1">{f.a}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 rounded-2xl border bg-muted/40 p-8">
            <h2 className="text-2xl font-bold text-navy">How Gratom Babz measures up</h2>
            <p className="mt-3">
              Gratom Babz Security Services Ltd is fully licensed and regulated by PSRA and is an affiliate member of PSIA. We deploy vetted, trained officers, run a 24-hour control room with rapid response units and K9 teams, and have branches across Kiambu, Nairobi, Limuru, Thika and the coast.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/contact" className="inline-flex rounded-md bg-gold px-5 py-3 font-semibold text-navy hover:opacity-90">Request a free site assessment</Link>
              <Link to="/services" className="inline-flex rounded-md border border-navy px-5 py-3 font-semibold text-navy hover:bg-navy hover:text-navy-foreground">View our services</Link>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
