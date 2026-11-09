"use client";

import { useEffect } from "react";
import { motion } from "motion/react";
import { useLenis } from "lenis/react";
import { profile } from "@/content/profile";
import { setSoundEnabled } from "@/lib/sound";

export function StartScreen({ onStart }: { onStart: () => void }) {
  const lenis = useLenis();

  useEffect(() => {
    lenis?.stop();
    return () => lenis?.start();
  }, [lenis]);

  function start(withSound: boolean) {
    setSoundEnabled(withSound);
    onStart();
  }

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="start-title"
      className="start-screen curtain fixed inset-0 z-[80] flex items-center justify-center px-6"
      exit={{ y: "-100%" }}
      transition={{ duration: 0.9, ease: [0.7, 0, 0.3, 1] }}
    >
      <div className="relative z-10 flex max-w-xl flex-col items-center text-center">
        <p className="font-display text-xs tracking-[0.3em] text-gold sm:text-sm">
          Tonight&apos;s episode
        </p>
        <h1
          id="start-title"
          className="title-3d mt-3 font-display text-[clamp(3rem,12vw,6rem)] leading-[0.9]"
        >
          CV Show
        </h1>
        <p className="mt-6 text-lg font-medium text-ink/90 sm:text-xl">
          A short interview with {profile.name}, {profile.role.toLowerCase()}{" "}
          ({profile.headlineStack.join(", ")}).
        </p>

        <div className="mt-10 flex w-full flex-col items-center gap-3 sm:w-auto">
          <motion.button
            autoFocus
            onClick={() => start(true)}
            whileHover={{ y: -4 }}
            whileTap={{ y: 4 }}
            className="w-full rounded-2xl bg-gold px-7 py-4 font-display text-lg tracking-[0.04em] text-stage shadow-[0_7px_0_#a8740a] sm:w-auto sm:text-xl"
          >
            Start with sound
          </motion.button>
          <button
            onClick={() => start(false)}
            className="w-full rounded-2xl border-2 border-ink/40 px-6 py-3 text-base font-semibold transition-colors hover:border-ink sm:w-auto"
          >
            Start without sound
          </button>
        </div>
        <p className="mt-5 text-sm text-ink/60">
          You can switch sound on or off anytime in the top bar.
        </p>
      </div>
      <div aria-hidden className="curtain-fringe absolute inset-x-0 bottom-0" />
    </motion.div>
  );
}
