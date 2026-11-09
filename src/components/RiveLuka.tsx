"use client";

import { useEffect, useRef } from "react";
import {
  Alignment,
  Fit,
  Layout,
  useRive,
  useViewModelInstanceBoolean,
  useViewModelInstanceNumber,
  useViewModelInstanceTrigger,
} from "@rive-app/react-canvas";
import { prefersReducedMotion } from "@/lib/gsap";
import { useCelebrations, useMood } from "@/lib/mood";

type Props = {
  className?: string;

  settled: boolean;
};

const clamp = (v: number) => Math.max(-50, Math.min(50, v));

export function RiveLuka({ className, settled }: Props) {
  const { rive, canvas, RiveComponent } = useRive({
    src: "/luka.riv",
    artboard: "Luka",
    stateMachine: "Show",
    autoplay: !prefersReducedMotion(),
    autoBind: true,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
  });

  const mood = useMood();
  const celebrations = useCelebrations();
  const instance = rive?.viewModelInstance ?? null;
  const { setValue: setTalking } = useViewModelInstanceBoolean(
    "talking",
    instance,
  );
  const { setValue: setThinking } = useViewModelInstanceBoolean(
    "thinking",
    instance,
  );
  const { setValue: setLookX } = useViewModelInstanceNumber("lookX", instance);
  const { setValue: setLookY } = useViewModelInstanceNumber("lookY", instance);
  const { trigger: fireCelebrate } = useViewModelInstanceTrigger(
    "celebrate",
    instance,
  );

  useEffect(() => {
    if (rive && settled) rive.resizeDrawingSurfaceToCanvas();
  }, [rive, settled]);

  useEffect(() => {
    setTalking(mood === "talking");
    setThinking(mood === "thinking");
  }, [mood, setTalking, setThinking]);

  const seenCelebrations = useRef(celebrations);
  useEffect(() => {
    if (celebrations <= seenCelebrations.current) return;
    seenCelebrations.current = celebrations;
    fireCelebrate();
  }, [celebrations, fireCelebrate]);

  useEffect(() => {
    if (!canvas || !instance) return;
    if (prefersReducedMotion() || !matchMedia("(pointer: fine)").matches)
      return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = canvas.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        setLookX(clamp(((e.clientX - cx) / (innerWidth / 2)) * 50));
        setLookY(clamp(((e.clientY - cy) / (innerHeight / 2)) * 50));
      });
    };
    const onLeave = () => {
      setLookX(0);
      setLookY(0);
    };
    window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [canvas, instance, setLookX, setLookY]);

  return (
    <RiveComponent
      className={className}
      aria-label="Animated cartoon of Luka"
      role="img"
    />
  );
}
