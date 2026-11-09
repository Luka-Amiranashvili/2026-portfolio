"use client";

import { useEffect } from "react";
import {
  Alignment,
  Fit,
  Layout,
  useRive,
  useViewModelInstanceBoolean,
} from "@rive-app/react-canvas";
import { prefersReducedMotion } from "@/lib/gsap";
import { useMood } from "@/lib/mood";

type Props = {
  className?: string;

  settled: boolean;
};

export function RiveLuka({ className, settled }: Props) {
  const { rive, RiveComponent } = useRive({
    src: "/luka.riv",
    artboard: "Luka",
    stateMachine: "Show",
    autoplay: !prefersReducedMotion(),
    autoBind: true,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
  });

  const mood = useMood();
  const instance = rive?.viewModelInstance ?? null;
  const { setValue: setTalking } = useViewModelInstanceBoolean(
    "talking",
    instance,
  );
  const { setValue: setThinking } = useViewModelInstanceBoolean(
    "thinking",
    instance,
  );

  useEffect(() => {
    if (rive && settled) rive.resizeDrawingSurfaceToCanvas();
  }, [rive, settled]);

  useEffect(() => {
    setTalking(mood === "talking");
    setThinking(mood === "thinking");
  }, [mood, setTalking, setThinking]);

  return (
    <RiveComponent
      className={className}
      aria-label="Animated cartoon of Luka"
      role="img"
    />
  );
}
