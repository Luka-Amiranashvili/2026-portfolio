"use client";

import { ReactLenis } from "lenis/react";
import { MotionConfig } from "motion/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.12 }}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ReactLenis>
  );
}
