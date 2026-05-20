import Link from "next/link";

const features = [
  ["Identity", "Tune layout, colors, motion, audio, bio, links, and profile cards."],
  ["Gaming", "Show Valorant stats and gear setup when the profile needs it."],
  ["Analytics", "Track views, clicks, devices, referrers, and top links."],
];

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-[#050509] px-5 py-10 text-white sm:px-8">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="text-sm text-white/45 hover:text-white">Glyph</Link>
        <section className="py-24">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-white/35">Features</p>
          <h1 className="max-w-4xl font-display text-6xl font-medium leading-[0.92] tracking-[-0.065em]">
            Not a link list. A profile system.
          </h1>
          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {features.map(([title, desc]) => (
              <div key={title} className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6">
                <h2 className="font-display text-3xl font-medium tracking-[-0.05em]">{title}</h2>
                <p className="mt-5 text-sm leading-7 text-white/46">{desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
