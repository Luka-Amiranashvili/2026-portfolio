"use client";

import { useEffect } from "react";
import { Alignment, Fit, Layout, useRive } from "@rive-app/react-canvas";
import { prefersReducedMotion } from "@/lib/gsap";

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
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
  });

  useEffect(() => {
    if (rive && settled) rive.resizeDrawingSurfaceToCanvas();
  }, [rive, settled]);

  return (
    <RiveComponent
      className={className}
      aria-label="Animated cartoon of Luka"
      role="img"
    />
  );
}
