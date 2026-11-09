"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import type { Block } from "@/content/profile";
import { gsap, prefersReducedMotion, SplitText, useGSAP } from "@/lib/gsap";
import { RichText } from "./RichText";
import { ContactBlock, ProjectsBlock, StackBlock } from "./blocks";

type Phase = "typing" | "speaking" | "done";

type Props = {
  blocks: Block[];
  onDone?: () => void;
};

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-2 py-2" aria-label="Luka is typing">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-3 rounded-full bg-stage"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.12, ease: "easeInOut" }}
        />
      ))}
    </span>
  );
}

/** Luka's answer card: short "typing" pause, then the words pop in one by one. */
export function Answer({ blocks, onDone }: Props) {
  const [phase, setPhase] = useState<Phase>(() => (prefersReducedMotion() ? "done" : "typing"));
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (phase !== "typing") return;
    const t = setTimeout(() => setPhase("speaking"), 750);
    return () => clearTimeout(t);
  }, [phase]);

  useGSAP(
    () => {
      if (phase !== "speaking" || !textRef.current) return;
      const split = new SplitText(textRef.current.querySelectorAll("p"), { type: "words" });
      gsap.from(split.words, {
        opacity: 0,
        scale: 0.4,
        y: 16,
        duration: 0.45,
        ease: "back.out(2.5)",
        stagger: 0.035,
        onComplete: () => {
          split.revert();
          setPhase("done");
        },
      });
    },
    { dependencies: [phase] },
  );

  useEffect(() => {
    if (phase === "done") onDone?.();
    // Fire once when this answer finishes, not when the parent re-creates onDone.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const texts = blocks.filter((b) => b.kind === "text");
  const extras = blocks.filter((b) => b.kind !== "text");

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 30, rotate: 1 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="relative mr-auto max-w-3xl rounded-3xl rounded-tl-md border-4 border-stage bg-ink px-6 py-5 text-stage shadow-[8px_8px_0_var(--gold)] sm:px-8 sm:py-7"
      >
        <p className="mb-2 font-display text-[11px] tracking-[0.25em] text-pink">Luka</p>
        {phase === "typing" ? (
          <TypingDots />
        ) : (
          <div ref={textRef} className="rich space-y-4 text-[clamp(1.25rem,2.6vw,1.75rem)] font-medium leading-snug">
            {texts.map((b, i) => (
              <p key={i}>
                <RichText text={b.text} />
              </p>
            ))}
          </div>
        )}
      </motion.div>

      {/* Projects / stack / contact appear below the speech card once Luka finishes talking */}
      {phase === "done" &&
        extras.map((b, i) => {
          if (b.kind === "projects") return <ProjectsBlock key={i} />;
          if (b.kind === "stack") return <StackBlock key={i} />;
          if (b.kind === "contact") return <ContactBlock key={i} />;
          return null;
        })}
    </div>
  );
}
