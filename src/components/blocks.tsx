"use client";

import { useState } from "react";
import { motion, type Variants } from "motion/react";
import { profile, projects, stackGroups, type Project } from "@/content/profile";

const cardColors = [
  { bar: "bg-pink", shadow: "shadow-[8px_8px_0_var(--pink)]" },
  { bar: "bg-cyan", shadow: "shadow-[8px_8px_0_var(--cyan)]" },
  { bar: "bg-gold", shadow: "shadow-[8px_8px_0_var(--gold)]" },
];

const flipIn: Variants = {
  hidden: { opacity: 0, rotateY: -80, y: 30 },
  show: { opacity: 1, rotateY: 0, y: 0, transition: { type: "spring", stiffness: 160, damping: 18 } },
};

const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.3 },
  show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 400, damping: 15 } },
};

const slideIn: Variants = {
  hidden: { opacity: 0, x: -40 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 220, damping: 22, staggerChildren: 0.04, delayChildren: 0.1 } },
};

const stagger = (gap: number): Variants => ({ hidden: {}, show: { transition: { staggerChildren: gap } } });

function StarSticker({ label }: { label: string }) {
  return (
    <motion.div
      aria-label={label}
      initial={{ scale: 0, rotate: -90 }}
      animate={{ scale: 1, rotate: 12 }}
      transition={{ type: "spring", stiffness: 260, damping: 12, delay: 0.5 }}
      className="absolute -right-4 -top-5 z-10 grid size-24 place-items-center sm:-right-6 sm:-top-7 sm:size-28"
    >
      <motion.svg
        viewBox="0 0 100 100"
        className="absolute inset-0 size-full drop-shadow-[0_4px_0_rgb(0_0_0/0.35)]"
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        aria-hidden
      >
        <polygon
          fill="var(--gold)"
          stroke="var(--stage)"
          strokeWidth="4"
          strokeLinejoin="round"
          points="50,3 61,22 82,14 80,36 98,46 82,60 90,80 68,80 60,98 50,82 40,98 32,80 10,80 18,60 2,46 20,36 18,14 39,22"
        />
      </motion.svg>
      <span className="relative text-center font-display text-[10px] leading-tight text-stage sm:text-[11px]">
        {label.split(" ").map((w) => (
          <span key={w} className="block">
            {w}
          </span>
        ))}
      </span>
    </motion.div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const color = cardColors[index % cardColors.length];
  const Tag = project.href ? motion.a : motion.article;

  return (
    <motion.div variants={flipIn} className={`perspective-distant ${index === 0 ? "md:col-span-2" : ""}`}>
      <Tag
        {...(project.href ? { href: project.href, target: "_blank", rel: "noreferrer" } : {})}
        whileHover={{ y: -6, rotate: index % 2 ? 0.8 : -0.8 }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
        className={`relative block h-full rounded-3xl border-4 border-stage bg-ink text-stage ${color.shadow}`}
      >
        {project.badge && <StarSticker label={project.badge} />}
        <div className={`flex items-center gap-3 rounded-t-[20px] px-6 py-3 ${color.bar}`}>
          <span className="font-display text-xs tracking-[0.2em] text-stage">Prize {String(index + 1).padStart(2, "0")}</span>
          <span className="text-sm font-semibold text-stage/80">{project.kind}</span>
        </div>
        <div className="px-6 pb-6 pt-5 sm:px-7">
          <h3 className="font-display text-4xl leading-none sm:text-5xl">{project.name}</h3>
          <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-stage/85">{project.summary}</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {project.stack.map((s) => (
              <li key={s} className="rounded-full border-2 border-stage px-3 py-1 text-xs font-semibold">
                {s}
              </li>
            ))}
          </ul>
        </div>
      </Tag>
    </motion.div>
  );
}

export function ProjectsBlock() {
  return (
    <motion.div variants={stagger(0.18)} initial="hidden" animate="show" className="mt-10 grid gap-8 md:grid-cols-2">
      {projects.map((p, i) => (
        <ProjectCard key={p.id} project={p} index={i} />
      ))}
    </motion.div>
  );
}

export function StackBlock() {
  return (
    <motion.dl
      variants={stagger(0.12)}
      initial="hidden"
      animate="show"
      className="mt-10 overflow-hidden rounded-3xl border-4 border-gold bg-stage/80 shadow-[0_0_60px_-15px_var(--gold)]"
    >
      <div className="bg-gold px-6 py-2 font-display text-xs tracking-[0.25em] text-stage">Scoreboard</div>
      {stackGroups.map((g) => (
        <motion.div
          key={g.label}
          variants={slideIn}
          className="grid gap-3 border-t-2 border-dashed border-gold/25 px-6 py-4 first-of-type:border-t-0 sm:grid-cols-[8.5rem_1fr] sm:items-center"
        >
          <dt className="font-display text-sm tracking-[0.12em] text-gold">{g.label}</dt>
          <dd className="flex flex-wrap gap-2">
            {g.items.map((item) => (
              <motion.span
                key={item}
                variants={popIn}
                whileHover={{ y: -3, scale: 1.06 }}
                className="cursor-default rounded-xl bg-ink px-3 py-1.5 text-sm font-semibold text-stage"
              >
                {item}
              </motion.span>
            ))}
          </dd>
        </motion.div>
      ))}
    </motion.dl>
  );
}

export function ContactBlock() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  }

  const links = [
    { label: "GitHub", href: profile.github },
    ...(profile.linkedin ? [{ label: "LinkedIn", href: profile.linkedin }] : []),
  ];

  return (
    <motion.div variants={stagger(0.12)} initial="hidden" animate="show" className="mt-10 flex flex-col items-start gap-5">
      <motion.div variants={popIn} className="flex flex-wrap items-center gap-3">
        <motion.a
          href={`mailto:${profile.email}`}
          whileHover={{ y: -4 }}
          whileTap={{ y: 4 }}
          className="rounded-2xl bg-pink px-6 py-4 font-display text-lg tracking-[0.05em] text-ink shadow-[0_7px_0_#9e1450] sm:text-2xl"
        >
          Call the contestant
        </motion.a>
        <button
          onClick={copy}
          aria-live="polite"
          className="rounded-2xl border-4 border-ink/30 px-4 py-3 text-sm font-semibold transition-colors hover:border-ink"
        >
          {copied ? "Copied!" : `Copy ${profile.email}`}
        </button>
      </motion.div>
      <motion.ul variants={popIn} className="flex gap-3">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="inline-block rounded-full bg-ink/10 px-4 py-2 text-sm font-semibold transition-colors hover:bg-ink hover:text-stage"
            >
              {l.label} &#8599;
            </a>
          </li>
        ))}
      </motion.ul>
    </motion.div>
  );
}
