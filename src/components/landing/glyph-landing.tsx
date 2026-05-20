"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

export type LandingTab = "product" | "features" | "pricing" | "faq";

const navItems: { label: string; tab: LandingTab; href: string }[] = [
  { label: "Product", tab: "product", href: "/" },
  { label: "Features", tab: "features", href: "/features" },
  { label: "Pricing", tab: "pricing", href: "/pricing" },
  { label: "FAQ", tab: "faq", href: "/faq" },
];

const heroCards = [
  { className: "left-[3%] top-[26%] h-[220px] w-[168px] -rotate-[11deg] opacity-45 blur-[0.2px]", y: [0, -18, 0], d: 5.8 },
  { className: "left-[20%] top-[36%] h-[270px] w-[205px] -rotate-[5deg]", y: [0, 16, 0], d: 6.4 },
  { className: "left-1/2 top-[20%] h-[330px] w-[250px] -translate-x-1/2 rotate-[1deg] scale-110", y: [0, -22, 0], d: 7 },
  { className: "right-[20%] top-[36%] h-[270px] w-[205px] rotate-[6deg]", y: [0, 14, 0], d: 6.2 },
  { className: "right-[3%] top-[26%] h-[220px] w-[168px] rotate-[11deg] opacity-45 blur-[0.2px]", y: [0, -16, 0], d: 5.6 },
];

const features = [
  ["Identity", "Profile layout, colors, motion, audio, bio, and links in one studio."],
  ["Gaming", "Valorant cards and gear setup live beside the main profile, not buried under it."],
  ["Analytics", "Views, clicks, devices, and referrers without leaving the dashboard."],
];

const plans = [
  { name: "Starter", price: "Free", items: ["Public profile", "Core links", "Basic themes"] },
  { name: "Studio", price: "$4", items: ["Advanced styling", "Audio and effects", "Analytics dashboard"], featured: true },
  { name: "Creator", price: "$9", items: ["Valorant cards", "Gear cards", "Premium layouts"] },
];

const faqs = [
  ["Is Glyph only for gamers?", "No. Gaming cards are optional. The core product is a personal profile page."],
  ["Can I claim a custom username?", "Yes. The handle becomes the public profile path people can visit and remember."],
  ["Do I need to code?", "No. The dashboard is built around visual controls and live preview."],
  ["Can pricing change later?", "Yes. The current plan copy is placeholder content."],
];

function tabFromPath(path: string): LandingTab {
  if (path.startsWith("/features")) return "features";
  if (path.startsWith("/pricing")) return "pricing";
  if (path.startsWith("/faq")) return "faq";
  return "product";
}

function routeForTab(tab: LandingTab) {
  return navItems.find((item) => item.tab === tab)?.href || "/";
}

const paneMotion = {
  initial: { opacity: 0, y: 22, scale: 0.985, filter: "blur(10px)" },
  animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, y: -18, scale: 0.985, filter: "blur(10px)" },
  transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] },
};

export default function GlyphLanding({ initialTab = "product" }: { initialTab?: LandingTab }) {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [active, setActive] = useState<LandingTab>(initialTab);
  const [handle, setHandle] = useState("");

  useEffect(() => {
    router.prefetch("/features");
    router.prefetch("/pricing");
    router.prefetch("/faq");

    const syncFromPath = () => setActive(tabFromPath(window.location.pathname));
    syncFromPath();
    window.addEventListener("popstate", syncFromPath);
    return () => window.removeEventListener("popstate", syncFromPath);
  }, [router]);

  const switchTab = (tab: LandingTab) => {
    setActive(tab);
    const next = routeForTab(tab);
    if (window.location.pathname !== next) window.history.pushState({}, "", next);
  };

  const submitHandle = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const username = handle.trim().replace(/^@+/, "").toLowerCase();
    router.push(username ? `/sign-up?claim=${encodeURIComponent(username)}` : "/sign-up");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050509] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(115deg,rgba(255,68,90,0.13)_0%,transparent_24%,rgba(244,174,66,0.12)_48%,transparent_68%,rgba(124,92,255,0.11)_100%)]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.08),transparent_28%),radial-gradient(circle_at_50%_92%,rgba(255,85,110,0.13),transparent_34%)]" />

      <nav className="fixed left-0 right-0 top-0 z-50 px-4 py-4 sm:px-7">
        <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/10 bg-[#08080d]/72 px-4 py-3 shadow-[0_22px_80px_rgba(0,0,0,0.42)] backdrop-blur-2xl">
          <button onClick={() => switchTab("product")} className="flex items-center gap-3">
            <div className="relative h-8 w-8">
              <span className="absolute left-1 top-1 h-6 w-3 -rotate-12 rounded-[0.35rem] bg-white" />
              <span className="absolute right-1 top-1 h-6 w-3 rotate-12 rounded-[0.35rem] bg-white/75" />
            </div>
            <span className="text-sm font-bold tracking-tight">Glyph</span>
          </button>

          <div className="hidden items-center gap-1 rounded-full border border-white/8 bg-black/22 p-1 text-xs text-white/48 md:flex">
            {navItems.map((item) => (
              <button
                key={item.tab}
                onClick={() => switchTab(item.tab)}
                className={`relative rounded-full px-4 py-2 transition ${active === item.tab ? "text-black" : "hover:text-white"}`}
              >
                {active === item.tab && (
                  <motion.span
                    layoutId="glyph-active-tab"
                    className="absolute inset-0 rounded-full bg-white"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {isSignedIn ? (
              <Link href="/dashboard" className="rounded-full bg-white px-4 py-2 text-xs font-bold text-black transition hover:bg-white/90">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/sign-in" className="hidden rounded-full px-4 py-2 text-xs font-semibold text-white/58 transition hover:text-white sm:block">
                  Login
                </Link>
                <Link href="/sign-up" className="rounded-full bg-white px-4 py-2 text-xs font-bold text-black transition hover:bg-white/90">
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <section className="relative min-h-screen overflow-hidden px-4 pb-0 pt-28 sm:px-7 lg:pt-32">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[58vh] bg-[linear-gradient(180deg,rgba(255,255,255,0.09),transparent_72%)]" />
        <div className="pointer-events-none absolute left-0 right-0 top-[22%] h-40 bg-[linear-gradient(90deg,transparent,rgba(255,65,91,0.22),rgba(255,186,68,0.16),rgba(114,105,255,0.16),transparent)] blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[44vh] bg-[linear-gradient(180deg,transparent,rgba(255,66,88,0.09)_28%,rgba(255,179,70,0.08)_48%,#050509_100%)]" />

        <AnimatePresence mode="wait">
          {active === "product" && <ProductPane key="product" handle={handle} setHandle={setHandle} submitHandle={submitHandle} />}
          {active === "features" && <FeaturesPane key="features" />}
          {active === "pricing" && <PricingPane key="pricing" />}
          {active === "faq" && <FaqPane key="faq" />}
        </AnimatePresence>
      </section>
    </main>
  );
}

function ProductPane({
  handle,
  setHandle,
  submitHandle,
}: {
  handle: string;
  setHandle: (value: string) => void;
  submitHandle: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <motion.div {...paneMotion} className="relative z-10 mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-7xl flex-col items-center text-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] px-4 py-2 text-xs font-medium text-white/58 backdrop-blur-xl">
        <Sparkles size={13} className="text-amber-200" />
        Personal pages with real presence
      </div>

      <h1 className="mt-7 max-w-6xl font-display text-[clamp(3.4rem,10vw,9.5rem)] font-medium leading-[0.82] tracking-[-0.078em]">
        Make your profile
        <span className="block bg-[linear-gradient(92deg,#fff_0%,#ffd7a1_34%,#ff5f82_67%,#d8d2ff_100%)] bg-clip-text text-transparent">
          impossible to ignore.
        </span>
      </h1>

      <p className="mt-7 max-w-2xl text-sm leading-7 text-white/52 sm:text-base">
        One public page for your links, style, music, analytics, gamer stats, and setup.
      </p>

      <form
        onSubmit={submitHandle}
        className="mt-8 flex w-full max-w-2xl flex-col gap-2 rounded-[1.45rem] border border-white/12 bg-black/32 p-2 shadow-[0_24px_90px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:flex-row"
      >
        <label className="flex min-h-12 flex-1 items-center rounded-2xl bg-white/[0.055] px-4 text-left text-sm text-white/42">
          <span className="shrink-0 text-white/62">glyph.io/</span>
          <input
            value={handle}
            onChange={(event) => setHandle(event.target.value)}
            placeholder="username"
            className="min-w-0 flex-1 bg-transparent px-1 text-white outline-none placeholder:text-white/24"
            aria-label="Choose your Glyph username"
          />
        </label>
        <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-black transition hover:-translate-y-0.5 hover:bg-white/90">
          Start today
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-white">
            <ArrowRight size={13} />
          </span>
        </button>
      </form>

      <div className="relative mt-auto h-[310px] w-full max-w-6xl sm:h-[390px] lg:h-[430px]">
        <div className="absolute inset-x-[-12%] bottom-[-36px] h-56 bg-[linear-gradient(90deg,transparent,rgba(255,70,90,0.24),rgba(255,185,75,0.22),rgba(135,119,255,0.18),transparent)] blur-3xl" />
        <div className="absolute inset-x-[12%] bottom-[-28px] h-20 bg-white/10 blur-3xl" />
        {heroCards.map((slot, index) => (
          <div key={index} className={`absolute ${slot.className}`}>
            <motion.div
              animate={{ y: slot.y }}
              transition={{ duration: slot.d, repeat: Infinity, ease: "easeInOut", delay: index * 0.18 }}
              className="relative h-full w-full overflow-hidden rounded-[1.6rem] border border-white/14 bg-[linear-gradient(145deg,rgba(255,255,255,0.13),rgba(255,255,255,0.035))] shadow-[0_32px_110px_rgba(0,0,0,0.6)] backdrop-blur-xl"
            >
              <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.16),transparent_42%,rgba(255,255,255,0.08))]" />
              <img src="/landing/blank-card.png" alt="" className="relative h-full w-full object-cover" draggable={false} />
            </motion.div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function FeaturesPane() {
  return (
    <motion.div {...paneMotion} className="relative z-10 mx-auto grid min-h-[calc(100vh-8rem)] w-full max-w-7xl gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
      <div>
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-white/35">Features</p>
        <h1 className="font-display text-[clamp(3.2rem,7vw,7.4rem)] font-medium leading-[0.84] tracking-[-0.075em]">
          Not a link list.
          <span className="block bg-[linear-gradient(92deg,#fff,#ffd7a1,#ff5f82)] bg-clip-text text-transparent">A profile system.</span>
        </h1>
        <p className="mt-7 max-w-xl text-sm leading-7 text-white/50">
          Glyph keeps the page visual, the dashboard practical, and every profile flexible enough to feel personal.
        </p>
      </div>
      <div className="grid gap-4">
        {features.map(([title, desc], index) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.07, duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-2xl"
          >
            <div className="absolute right-[-80px] top-[-80px] h-44 w-44 rounded-full bg-white/10 blur-3xl" />
            <h2 className="font-display text-3xl font-medium tracking-[-0.055em]">{title}</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/48">{desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function PricingPane() {
  return (
    <motion.div {...paneMotion} className="relative z-10 mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-7xl flex-col justify-center">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-white/35">Pricing</p>
        <h1 className="font-display text-[clamp(3rem,7vw,6.8rem)] font-medium leading-[0.86] tracking-[-0.075em]">
          Plans are placeholders for now.
        </h1>
      </div>
      <div className="mt-12 grid gap-4 lg:grid-cols-3">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            className={`rounded-[2rem] border p-6 backdrop-blur-2xl ${
              plan.featured
                ? "border-white/22 bg-white/[0.09] shadow-[0_34px_110px_rgba(255,255,255,0.08)]"
                : "border-white/10 bg-white/[0.045]"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <h2 className="font-display text-3xl font-medium tracking-[-0.055em]">{plan.name}</h2>
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
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function FaqPane() {
  return (
    <motion.div {...paneMotion} className="relative z-10 mx-auto grid min-h-[calc(100vh-8rem)] w-full max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
      <div>
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-white/35">FAQ</p>
        <h1 className="font-display text-[clamp(3rem,7vw,6.8rem)] font-medium leading-[0.86] tracking-[-0.075em]">
          Questions before the first page.
        </h1>
      </div>
      <div className="space-y-3">
        {faqs.map(([q, a]) => (
          <details key={q} className="group rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-5 backdrop-blur-2xl open:bg-white/[0.075]">
            <summary className="cursor-pointer list-none font-display text-lg font-medium tracking-[-0.025em] marker:hidden">
              <div className="flex items-center justify-between gap-4">
                <span>{q}</span>
                <span className="text-white/35 transition group-open:rotate-45">+</span>
              </div>
            </summary>
            <p className="mt-4 text-sm leading-7 text-white/48">{a}</p>
          </details>
        ))}
      </div>
    </motion.div>
  );
}
