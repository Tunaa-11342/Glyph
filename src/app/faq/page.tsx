import Link from "next/link";

const faqs = [
  ["Is Glyph only for gamers?", "No. Gaming cards are optional. The core product is a personal profile page."],
  ["Can I claim a custom username?", "Yes. The handle becomes the public profile path people can visit and remember."],
  ["Do I need to code?", "No. The dashboard is built around visual controls and live preview."],
  ["Can pricing change later?", "Yes. The current plan copy is placeholder content."],
];

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-[#050509] px-5 py-10 text-white sm:px-8">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="text-sm text-white/45 hover:text-white">Glyph</Link>
        <section className="py-24">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-white/35">FAQ</p>
          <h1 className="font-display text-6xl font-medium leading-[0.92] tracking-[-0.065em]">
            Questions before the first page.
          </h1>
          <div className="mt-12 space-y-3">
            {faqs.map(([q, a]) => (
              <details key={q} className="group rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5 open:bg-white/[0.065]">
                <summary className="cursor-pointer list-none font-display text-lg font-medium tracking-[-0.025em] marker:hidden">
                  <div className="flex items-center justify-between gap-4">
                    <span>{q}</span>
                    <span className="text-white/35 transition group-open:rotate-45">+</span>
                  </div>
                </summary>
                <p className="mt-4 text-sm leading-7 text-white/46">{a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
