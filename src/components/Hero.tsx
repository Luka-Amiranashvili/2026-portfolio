"use client";

import { useRef, useState } from "react";
import { profile } from "@/content/profile";
import { gsap, prefersReducedMotion, SplitText, useGSAP } from "@/lib/gsap";
import { RiveLuka } from "./RiveLuka";

export function Hero({
  play,
  onIntroDone,
}: {
  play: boolean;
  onIntroDone: () => void;
}) {
  const root = useRef<HTMLElement>(null);
  const [settled, setSettled] = useState(false);

  useGSAP(
    () => {
      if (!play) return;
      const done = () => {
        setSettled(true);
        onIntroDone();
      };
      if (prefersReducedMotion()) {
        done();
        return;
      }
      const split = new SplitText(".show-title", { type: "chars" });
      gsap
        .timeline({ delay: 0.15, onComplete: done })
        .set(".pre-anim", { visibility: "visible" })
        .from(".marquee", {
          scale: 0.6,
          rotate: -4,
          opacity: 0,
          duration: 0.9,
          ease: "back.out(1.8)",
          clearProps: "transform,opacity",
        })
        .from(
          split.chars,
          {
            yPercent: -160,
            opacity: 0,
            duration: 0.8,
            ease: "bounce.out",
            stagger: 0.05,
          },
          "-=0.4",
        )
        .from(
          ".rive-slot",
          {
            scale: 0.3,
            opacity: 0,
            duration: 0.6,
            ease: "back.out(2)",
            clearProps: "transform,opacity",
          },
          "-=0.5",
        )
        .from(
          ".contestant",
          { y: 40, opacity: 0, duration: 0.6, ease: "power3.out" },
          "-=0.3",
        );
    },
    { scope: root, dependencies: [play] },
  );

  return (
    <section
      ref={root}
      className="relative mx-auto flex max-w-5xl flex-col items-center px-4 pt-24 sm:px-8 sm:pt-28"
    >
      <div className="marquee pre-anim w-full">
        <div className="marquee-screen flex flex-col items-center gap-6 px-5 py-8 sm:flex-row sm:justify-between sm:gap-10 sm:px-12 sm:py-12">
          <div className="text-center sm:text-left">
            <p className="font-display text-xs tracking-[0.3em] text-cyan sm:text-sm">
              Tonight&apos;s episode
            </p>
            <h1 className="show-title title-3d mt-3 font-display text-[clamp(2.6rem,9vw,6.5rem)] leading-[0.92]">
              CV
              <br />
              Show
            </h1>
          </div>

          <div className="rive-slot relative size-44 shrink-0 overflow-hidden rounded-full border-4 border-gold bg-[radial-gradient(circle_at_50%_38%,#8ff4f5_0%,#2de2e6_45%,#139aa3_100%)] shadow-[0_0_40px_-8px_var(--gold)] sm:size-56">
            <RiveLuka
              settled={settled}
              className="absolute left-[-12.5%] bottom-0 h-[125%] w-[125%]"
            />
          </div>
        </div>
      </div>

      <div className="contestant pre-anim relative -mt-5 rotate-[-1.5deg] rounded-2xl border-4 border-stage bg-ink px-6 py-4 text-stage shadow-[6px_6px_0_var(--pink)] sm:px-8">
        <p className="font-display text-[11px] tracking-[0.25em] text-pink">
          Today&apos;s contestant
        </p>
        <p className="mt-1 text-2xl font-bold sm:text-3xl">{profile.name}</p>
        <p className="mt-1 text-sm font-medium text-stage/75 sm:text-base">
          {profile.role} · {profile.headlineStack.join(", ")} ·{" "}
          {profile.location}
        </p>
      </div>
    </section>
  );
}
