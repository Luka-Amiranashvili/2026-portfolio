"use client";

import { useEffect } from "react";
import { motion } from "motion/react";
import { useLenis } from "lenis/react";
import { profile, projects, stackGroups } from "@/content/profile";

const heading = "font-display text-xs tracking-[0.22em] text-pink";

/** The "I'm in a hurry" exit: a plain, scannable CV that slides over the show. */
export function CvSheet({ hasCv, onClose }: { hasCv: boolean; onClose: () => void }) {
  const lenis = useLenis();

  // Freeze the page behind the sheet and close on Escape.
  useEffect(() => {
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [lenis, onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-stage/70 backdrop-blur-sm sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.article
        role="dialog"
        aria-modal="true"
        aria-label="Plain CV"
        data-lenis-prevent
        onClick={(e) => e.stopPropagation()}
        initial={{ y: "100%", rotate: 2 }}
        animate={{ y: 0, rotate: 0 }}
        exit={{ y: "100%", rotate: 2 }}
        transition={{ type: "spring", stiffness: 150, damping: 22 }}
        className="max-h-[92svh] w-full max-w-3xl overflow-y-auto rounded-t-3xl border-4 border-stage bg-ink px-6 py-8 text-stage shadow-[10px_10px_0_var(--gold)] sm:rounded-3xl sm:px-12 sm:py-12"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl leading-none sm:text-5xl">{profile.name}</h1>
            <p className="mt-2 text-lg font-medium">
              {profile.role} · {profile.location}
            </p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-full border-2 border-stage px-4 py-2 text-sm font-semibold transition-colors hover:bg-stage hover:text-ink"
          >
            Close <span className="hidden sm:inline">(Esc)</span>
          </button>
        </div>

        <p className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
          <a className="underline underline-offset-4 hover:text-pink" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          <a className="underline underline-offset-4 hover:text-pink" href={profile.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          {profile.linkedin && (
            <a className="underline underline-offset-4 hover:text-pink" href={profile.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          )}
          {hasCv && (
            <a className="underline underline-offset-4 hover:text-pink" href="/cv.pdf" download="Luka_Amiranashvili_CV.pdf">
              Download PDF
            </a>
          )}
        </p>

        <section className="mt-9">
          <h2 className={heading}>About</h2>
          <p className="mt-2 text-[17px] leading-relaxed">{profile.summary}</p>
        </section>

        <section className="mt-9">
          <h2 className={heading}>Projects</h2>
          <div className="mt-3 space-y-6">
            {projects.map((p) => (
              <div key={p.id}>
                <h3 className="flex flex-wrap items-baseline gap-x-3 text-xl font-bold">
                  {p.name}
                  <span className="text-sm font-medium text-stage/60">{p.kind}</span>
                  {p.badge && <span className="rounded-full bg-gold px-2 py-0.5 text-xs font-bold">{p.badge}</span>}
                </h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px] leading-relaxed">
                  {p.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
                <p className="mt-2 text-sm text-stage/60">{p.stack.join(" · ")}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-9">
          <h2 className={heading}>Skills</h2>
          <dl className="mt-3 space-y-2 text-[15px]">
            {stackGroups.map((g) => (
              <div key={g.label} className="grid gap-x-4 sm:grid-cols-[7rem_1fr]">
                <dt className="font-semibold">{g.label}</dt>
                <dd>{g.items.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-9 grid gap-8 sm:grid-cols-2">
          <div>
            <h2 className={heading}>Education</h2>
            <ul className="mt-2 space-y-1 text-[15px]">
              {profile.education.map((e) => (
                <li key={e.school}>
                  <span className="font-semibold">{e.school}</span> <span className="text-stage/60">{e.years}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className={heading}>Languages</h2>
            <p className="mt-2 text-[15px]">{profile.languages.join(", ")}</p>
          </div>
        </section>
      </motion.article>
    </motion.div>
  );
}
