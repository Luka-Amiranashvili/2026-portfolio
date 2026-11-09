"use client";

import { useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { profile } from "@/content/profile";
import { prefersReducedMotion } from "@/lib/gsap";
import { play } from "@/lib/sound";

const CONFETTI_COLORS = ["var(--pink)", "var(--cyan)", "var(--gold)", "var(--ink)"];

function Confetti() {
  // Fixed pseudo-random spread so the burst looks the same on every render.
  const pieces = useMemo(
    () =>
      Array.from({ length: 48 }, (_, i) => {
        const angle = (i / 48) * Math.PI * 2;
        const dist = 160 + ((i * 37) % 220);
        return {
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist * 0.7 - 120,
          rotate: (i * 47) % 360,
          color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
          delay: (i % 6) * 0.02,
        };
      }),
    [],
  );

  return (
    <div aria-hidden className="pointer-events-none absolute left-1/2 top-[38%] z-0">
      {pieces.map((p, i) => (
        <motion.span
          key={i}
          className="absolute block h-3 w-2 rounded-xs"
          style={{ background: p.color }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0 }}
          animate={{ x: p.x, y: [0, p.y, p.y + 260], opacity: [1, 1, 0], rotate: p.rotate + 540, scale: 1 }}
          transition={{ duration: 2.2, delay: 0.9 + p.delay, ease: [0.2, 0.8, 0.4, 1] }}
        />
      ))}
    </div>
  );
}

/** Semicircle gauge. The needle wobbles through MAYBE before landing on HIRE. */
function HireOMeter() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <svg viewBox="0 0 200 115" className="w-full overflow-visible" role="img" aria-label="Hire-o-meter pointing at Hire">
        <path d="M 20 100 A 80 80 0 0 1 73 25" fill="none" stroke="var(--pink)" strokeWidth="22" />
        <path d="M 73 25 A 80 80 0 0 1 127 25" fill="none" stroke="var(--gold)" strokeWidth="22" />
        <path d="M 127 25 A 80 80 0 0 1 180 100" fill="none" stroke="var(--cyan)" strokeWidth="22" />
        <text x="30" y="62" fill="var(--ink)" fontSize="9" fontFamily="var(--font-bungee)" transform="rotate(-52 30 62)">
          Pass
        </text>
        <text x="86" y="14" fill="var(--ink)" fontSize="9" fontFamily="var(--font-bungee)">
          Maybe
        </text>
        <text x="152" y="44" fill="var(--ink)" fontSize="9" fontFamily="var(--font-bungee)" transform="rotate(52 152 44)">
          Hire
        </text>
        {/* Motion rotates SVG around the element's own bounding box: the needle's base sits
            exactly at the dial center (100,100), so originX 0.5 / originY 1 is the pivot. */}
        <motion.polygon
          points="95,100 105,100 100,26"
          fill="var(--ink)"
          style={{ originX: 0.5, originY: 1 }}
          initial={{ rotate: -85 }}
          animate={{ rotate: [-85, 10, -20, 62, 55, 60] }}
          transition={{ duration: 1.8, delay: 0.3, times: [0, 0.3, 0.45, 0.7, 0.85, 1], ease: "easeInOut" }}
        />
        <circle cx="100" cy="100" r="9" fill="var(--ink)" stroke="var(--stage)" strokeWidth="3" />
      </svg>
    </div>
  );
}

export function Finale({ hasCv, onOpenCv }: { hasCv: boolean; onOpenCv: () => void }) {
  const mailto = `mailto:${profile.email}?subject=${encodeURIComponent("Next round with Luka")}`;

  useEffect(() => {
    const reduced = prefersReducedMotion();
    const timers = [
      window.setTimeout(() => play("confetti"), reduced ? 0 : 900),
      window.setTimeout(() => play("fanfare"), reduced ? 300 : 2100),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 160, damping: 20 }}
      className="relative mt-24 text-center"
    >
      <Confetti />
      <div className="relative z-10">
        <span className="inline-block -rotate-3 rounded-full bg-pink px-4 py-1.5 font-display text-xs tracking-[0.2em]">
          Final round
        </span>
        <h2 className="title-3d mt-5 font-display text-[clamp(2.2rem,7vw,4.5rem)] leading-[0.95]">The verdict</h2>
        <p className="mx-auto mt-4 max-w-md text-lg text-ink/80">
          That&apos;s every question. The Hire-o-meter has made up its mind. Your turn.
        </p>

        <div className="mt-10">
          <p className="mb-3 font-display text-xs tracking-[0.25em] text-gold">Hire-o-meter</p>
          <HireOMeter />
        </div>

        <div className="mt-10 flex flex-col items-center gap-4">
          <motion.a
            href={mailto}
            whileHover={{ y: -4 }}
            whileTap={{ y: 4 }}
            className="rounded-2xl bg-pink px-7 py-4 font-display text-lg tracking-[0.04em] text-ink shadow-[0_7px_0_#9e1450] sm:text-2xl"
          >
            Invite Luka to the next round
          </motion.a>
          <div className="flex flex-wrap justify-center gap-3 text-sm font-semibold">
            <button onClick={onOpenCv} className="rounded-full bg-ink/10 px-4 py-2 transition-colors hover:bg-ink hover:text-stage">
              Read the plain CV
            </button>
            {hasCv && (
              <a
                href="/cv.pdf"
                download="Luka_Amiranashvili_CV.pdf"
                className="rounded-full bg-ink/10 px-4 py-2 transition-colors hover:bg-ink hover:text-stage"
              >
                Download PDF
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
