"use client";

import { motion } from "motion/react";
import type { AnsweredQuestion } from "@/content/profile";

const colors = [
  "bg-pink text-ink shadow-[0_5px_0_#9e1450]",
  "bg-cyan text-stage shadow-[0_5px_0_#138f92]",
  "bg-gold text-stage shadow-[0_5px_0_#a8740a]",
  "bg-ink text-stage shadow-[0_5px_0_#b9ae95]",
];

type Props = {
  remaining: AnsweredQuestion[];
  busy: boolean;
  onAsk: (id: string) => void;
};

/** Bottom bar of quiz-style question cards. Number keys 1 to 9 pick a card. */
export function QuestionDock({ remaining, busy, onAsk }: Props) {
  return (
    <motion.nav
      aria-label="Questions"
      initial={{ y: "120%" }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 180, damping: 24 }}
      className="fixed inset-x-0 bottom-0 z-40 bg-linear-to-t from-stage via-stage/95 to-transparent pb-4 pt-14 sm:pb-6"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-8">
        <div className="mb-3 flex items-center justify-between font-display text-[11px] tracking-[0.2em]">
          <span className={busy ? "text-ink/50" : "text-gold"}>{busy ? "Luka is answering..." : "Pick the next question"}</span>
          <span className="hidden text-ink/50 sm:inline">or press 1 to {Math.min(remaining.length, 9)}</span>
        </div>
        <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 pt-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          {remaining.map((q, i) => (
            <motion.button
              key={q.id}
              layoutId={`q-${q.id}`}
              layout="position"
              disabled={busy}
              onClick={() => onAsk(q.id)}
              whileHover={busy ? undefined : { y: -4 }}
              whileTap={busy ? undefined : { y: 3 }}
              className={`flex shrink-0 items-center gap-2.5 rounded-2xl px-4 py-3 text-left text-[15px] font-semibold transition-opacity disabled:cursor-wait disabled:opacity-40 ${colors[i % colors.length]}`}
            >
              {i < 9 && (
                <span className="grid size-6 place-items-center rounded-md bg-black/15 font-display text-[11px]">{i + 1}</span>
              )}
              {q.q}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}
