"use client";

import { useSyncExternalStore } from "react";

export type Mood = "idle" | "thinking" | "talking";

let mood: Mood = "idle";
const listeners = new Set<() => void>();

export function setMood(next: Mood) {
  if (next === mood) return;
  mood = next;
  listeners.forEach((l) => l());
}

let celebrations = 0;

export function celebrate() {
  celebrations++;
  listeners.forEach((l) => l());
}

export function useCelebrations() {
  return useSyncExternalStore(
    subscribe,
    () => celebrations,
    () => 0,
  );
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useMood() {
  return useSyncExternalStore(
    subscribe,
    () => mood,
    () => "idle" as Mood,
  );
}
