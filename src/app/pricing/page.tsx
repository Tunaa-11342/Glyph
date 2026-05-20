import Link from "next/link";
import { Check } from "lucide-react";

const plans = [
  { name: "Starter", price: "Free", items: ["Public profile", "Core links", "Basic themes"] },
  { name: "Studio", price: "$4", items: ["Advanced styling", "Audio and effects", "Analytics dashboard"] },
  { name: "Creator", price: "$9", items: ["Valorant cards", "Gear cards", "Premium layouts"] },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#050509] px-5 py-10 text-white sm:px-8">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="text-sm text-white/45 hover:text-white">Glyph</Link>
        <section className="py-24">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-white/35">Pricing</p>
          <h1 className="max-w-4xl font-display text-6xl font-medium leading-[0.92] tracking-[-0.065em]">
            Plans are placeholders for now.
          </h1>
          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {plans.map((plan) => (
              <div key={plan.name} className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="font-display text-3xl font-medium tracking-[-0.05em]">{plan.name}</h2>
                  <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-black">{plan.price}</span>
                </div>
                <div className="mt-8 space-y-3">
                  {plan.items.map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-black/20 px-4 py-3 text-sm text-white/62">
                      <Check size={14} className="text-emerald-200" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
