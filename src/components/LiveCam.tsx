"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { RiveLuka } from "./RiveLuka";

function CamBubble() {
  const [settled, setSettled] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6, x: -24 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.6, x: -24 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      onAnimationComplete={(def) =>
        (def as { opacity?: number }).opacity === 1 && setSettled(true)
      }
      className="fixed left-4 top-[68px] z-40 sm:left-8 sm:top-[76px]"
    >
      <div className="relative size-20 overflow-hidden rounded-full border-4 border-gold bg-[radial-gradient(circle_at_50%_38%,#8ff4f5_0%,#2de2e6_45%,#139aa3_100%)] shadow-[0_6px_24px_-6px_rgb(0_0_0/0.6),0_0_30px_-8px_var(--gold)] sm:size-28">
        <RiveLuka
          settled={settled}
          className="absolute left-[-12.5%] bottom-0 h-[125%] w-[125%]"
        />
      </div>
      <span className="absolute -bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border-2 border-stage bg-pink px-2.5 py-0.5 font-display text-[10px] tracking-[0.15em] text-ink">
        <motion.span
          className="size-1.5 rounded-full bg-ink"
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
        Live
      </span>
    </motion.div>
  );
}

export function LiveCam() {
  const [heroVisible, setHeroVisible] = useState(true);

  useEffect(() => {
    const target = document.querySelector(".rive-slot");
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { threshold: 0.15 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return <AnimatePresence>{!heroVisible && <CamBubble />}</AnimatePresence>;
}
