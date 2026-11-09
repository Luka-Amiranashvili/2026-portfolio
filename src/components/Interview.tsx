"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";
import { intro, questions } from "@/content/profile";
import { prefersReducedMotion } from "@/lib/gsap";
import { play, setMusicDucked } from "@/lib/sound";
import { Answer } from "./Answer";
import { CvSheet } from "./CvSheet";
import { Finale } from "./Finale";
import { Hero } from "./Hero";
import { QuestionDock } from "./QuestionDock";
import { SoundToggle } from "./SoundToggle";
import { StartScreen } from "./StartScreen";

export function Interview({ hasCv }: { hasCv: boolean }) {
  const [started, setStarted] = useState(false);
  const [introStarted, setIntroStarted] = useState(false);
  const [asked, setAsked] = useState<string[]>([]);
  const [busy, setBusy] = useState(true);
  const [cvOpen, setCvOpen] = useState(false);
  const lenis = useLenis();
  const introRef = useRef<HTMLDivElement>(null);
  const roundsRef = useRef<HTMLDivElement>(null);
  const finaleRef = useRef<HTMLDivElement>(null);

  const remaining = questions.filter((q) => !asked.includes(q.id));
  const finished = remaining.length === 0 && !busy;

  const onIntroDone = useCallback(() => setIntroStarted(true), []);
  const onAnswerDone = useCallback(() => setBusy(false), []);
  const openCv = useCallback(() => {
    play("swooshUp");
    setCvOpen(true);
  }, []);
  const closeCv = useCallback(() => {
    play("swooshDown");
    setCvOpen(false);
  }, []);

  const ask = useCallback(
    (id: string) => {
      if (busy) return;
      play("click");
      setBusy(true);
      setAsked((a) => [...a, id]);
    },
    [busy],
  );

  useEffect(() => {
    setMusicDucked(busy || cvOpen);
  }, [busy, cvOpen]);

  useEffect(() => {
    const el = introRef.current;
    if (!introStarted || !lenis || !el) return;
    const keepAboveDock = () => {
      const dockHeight =
        document.getElementById("question-dock")?.offsetHeight ?? 0;
      const limit = window.innerHeight - dockHeight - 16;
      const overflow = el.getBoundingClientRect().bottom - limit;
      if (overflow <= 0) return;
      lenis.resize();
      lenis.scrollTo(lenis.scroll + overflow, {
        duration: 0.8,
        immediate: prefersReducedMotion(),
      });
    };
    const observer = new ResizeObserver(keepAboveDock);
    observer.observe(el);
    return () => observer.disconnect();
  }, [introStarted, lenis]);

  useEffect(() => {
    if (asked.length === 0) return;
    const raf = requestAnimationFrame(() => {
      const last = roundsRef.current?.lastElementChild as HTMLElement | null;
      if (!last || !lenis) return;
      lenis.resize();
      lenis.scrollTo(last, {
        offset: -90,
        duration: 0.9,
        immediate: prefersReducedMotion(),
      });
    });
    return () => cancelAnimationFrame(raf);
  }, [asked.length, lenis]);

  useEffect(() => {
    if (!finished || !lenis) return;
    const raf = requestAnimationFrame(() => {
      if (!finaleRef.current) return;
      lenis.resize();
      lenis.scrollTo(finaleRef.current, {
        offset: -90,
        duration: 1.2,
        immediate: prefersReducedMotion(),
      });
    });
    return () => cancelAnimationFrame(raf);
  }, [finished, lenis]);

  useEffect(() => {
    if (!started || cvOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key.toLowerCase() === "c") return openCv();
      const n = Number(e.key);
      if (Number.isInteger(n) && n >= 1 && n <= 9 && remaining[n - 1])
        ask(remaining[n - 1].id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [started, remaining, ask, cvOpen, openCv]);

  return (
    <>
      <div aria-hidden className="beam beam-left" />
      <div aria-hidden className="beam beam-right" />

      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-4 py-4 sm:px-8">
        <span className="rounded-full bg-stage/70 px-4 py-2 font-display text-xs tracking-[0.15em] text-gold backdrop-blur">
          Round {asked.length} / {questions.length}
        </span>
        <div className="flex gap-2">
          <SoundToggle />
          {hasCv && (
            <a
              href="/cv.pdf"
              download="Luka_Amiranashvili_CV.pdf"
              className="rounded-full border-2 border-ink/30 px-4 py-2 text-sm font-semibold transition-colors hover:border-ink"
            >
              PDF
            </a>
          )}
          <button
            onClick={openCv}
            className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-stage transition-transform hover:-translate-y-0.5"
          >
            Plain CV <span className="hidden text-stage/50 sm:inline">(C)</span>
          </button>
        </div>
      </header>

      <Hero play={started} onIntroDone={onIntroDone} />

      <main
        className="relative mx-auto max-w-5xl px-4 pb-72 pt-16 sm:px-8"
        role="log"
        aria-live="polite"
      >
        <div ref={introRef}>
          {introStarted && <Answer blocks={intro} onDone={onAnswerDone} />}
        </div>

        <div ref={roundsRef}>
          {asked.map((id, i) => {
            const q = questions.find((x) => x.id === id)!;
            return (
              <section
                key={id}
                className={`mt-16 sm:mt-20 ${i === asked.length - 1 && !finished ? "min-h-[calc(100svh-90px)]" : ""}`}
              >
                <div className="mb-5 flex flex-col items-end gap-3">
                  <motion.span
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: -3 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 14,
                      delay: 0.15,
                    }}
                    className="rounded-full bg-pink px-4 py-1.5 font-display text-xs tracking-[0.2em] text-ink"
                  >
                    Round {i + 1}
                  </motion.span>
                  <motion.h2
                    layoutId={`q-${id}`}
                    layout="position"
                    className="max-w-xl rounded-3xl rounded-tr-md border-4 border-cyan bg-stage-2 px-6 py-4 text-right text-lg font-semibold sm:text-xl"
                  >
                    <span className="mb-1 block font-display text-[10px] tracking-[0.25em] text-cyan">
                      You asked
                    </span>
                    {q.q}
                  </motion.h2>
                </div>
                <Answer blocks={q.answer} onDone={onAnswerDone} />
              </section>
            );
          })}
        </div>

        {finished && (
          <div ref={finaleRef}>
            <Finale hasCv={hasCv} onOpenCv={openCv} />
          </div>
        )}
      </main>

      {introStarted && remaining.length > 0 && (
        <QuestionDock remaining={remaining} busy={busy} onAsk={ask} />
      )}

      <AnimatePresence>
        {cvOpen && <CvSheet hasCv={hasCv} onClose={closeCv} />}
      </AnimatePresence>

      <AnimatePresence>
        {!started && <StartScreen onStart={() => setStarted(true)} />}
      </AnimatePresence>
    </>
  );
}
