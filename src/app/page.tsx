"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { FormEvent, useState } from "react";

const navItems = [
  { label: "Product", href: "/" },
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
];

const heroCards = [
  { className: "left-[3%] top-[26%] h-[220px] w-[168px] -rotate-[11deg] opacity-45 blur-[0.2px]", y: [0, -18, 0], d: 5.8 },
  { className: "left-[20%] top-[36%] h-[270px] w-[205px] -rotate-[5deg]", y: [0, 16, 0], d: 6.4 },
  { className: "left-1/2 top-[20%] h-[330px] w-[250px] -translate-x-1/2 rotate-[1deg] scale-110", y: [0, -22, 0], d: 7 },
  { className: "right-[20%] top-[36%] h-[270px] w-[205px] rotate-[6deg]", y: [0, 14, 0], d: 6.2 },
  { className: "right-[3%] top-[26%] h-[220px] w-[168px] rotate-[11deg] opacity-45 blur-[0.2px]", y: [0, -16, 0], d: 5.6 },
];

export default function HomePage() {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [handle, setHandle] = useState("");

  const submitHandle = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const username = handle.trim().replace(/^@+/, "").toLowerCase();
    router.push(username ? `/sign-up?claim=${encodeURIComponent(username)}` : "/sign-up");
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#050509] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(115deg,rgba(255,68,90,0.12)_0%,transparent_26%,rgba(244,174,66,0.11)_48%,transparent_68%,rgba(124,92,255,0.1)_100%)]" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),transparent_18%,rgba(255,255,255,0.025)_58%,transparent_100%)]" />

      <nav className="fixed left-0 right-0 top-0 z-50 px-4 py-4 sm:px-7">
        <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/10 bg-[#08080d]/72 px-4 py-3 shadow-[0_22px_80px_rgba(0,0,0,0.42)] backdrop-blur-2xl">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-8 w-8">
              <span className="absolute left-1 top-1 h-6 w-3 -rotate-12 rounded-[0.35rem] bg-white" />
              <span className="absolute right-1 top-1 h-6 w-3 rotate-12 rounded-[0.35rem] bg-white/75" />
            </div>
            <span className="text-sm font-bold tracking-tight">Glyph</span>
          </Link>

          <div className="hidden items-center gap-1 text-xs text-white/48 md:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-full px-4 py-2 transition hover:bg-white/[0.07] hover:text-white">
                {item.label}
              </Link>
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

      <section className="relative flex min-h-screen flex-col overflow-hidden px-4 pb-0 pt-28 sm:px-7 lg:pt-32">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[58vh] bg-[linear-gradient(180deg,rgba(255,255,255,0.09),transparent_72%)]" />
        <div className="pointer-events-none absolute left-0 right-0 top-[22%] h-40 bg-[linear-gradient(90deg,transparent,rgba(255,65,91,0.22),rgba(255,186,68,0.16),rgba(114,105,255,0.16),transparent)] blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[44vh] bg-[linear-gradient(180deg,transparent,rgba(255,66,88,0.09)_28%,rgba(255,179,70,0.08)_48%,#050509_100%)]" />

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] px-4 py-2 text-xs font-medium text-white/58 backdrop-blur-xl"
          >
            <Sparkles size={13} className="text-amber-200" />
            Personal pages with real presence
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
            className="mt-7 max-w-6xl font-display text-[clamp(3.4rem,10vw,9.5rem)] font-medium leading-[0.82] tracking-[-0.078em]"
          >
            Make your profile
            <span className="block bg-[linear-gradient(92deg,#fff_0%,#ffd7a1_34%,#ff5f82_67%,#d8d2ff_100%)] bg-clip-text text-transparent">
              impossible to ignore.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mt-7 max-w-2xl text-sm leading-7 text-white/52 sm:text-base"
          >
            One public page for your links, style, music, analytics, gamer stats, and setup.
          </motion.p>

          <motion.form
            onSubmit={submitHandle}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
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
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-black transition hover:-translate-y-0.5 hover:bg-white/90"
            >
              Start today
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-white">
                <ArrowRight size={13} />
              </span>
            </button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, y: 42, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.38, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative mt-auto h-[310px] w-full max-w-6xl sm:h-[390px] lg:h-[430px]"
          >
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
          </motion.div>
        </div>
      </section>
    </main>
  );
}
