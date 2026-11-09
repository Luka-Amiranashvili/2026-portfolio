"use client";

import { useSyncExternalStore } from "react";

export type SoundName =
  | "toggleOn"
  | "click"
  | "bubble"
  | "tick"
  | "flip"
  | "sparkle"
  | "pop"
  | "copy"
  | "swooshUp"
  | "swooshDown"
  | "confetti"
  | "fanfare";

const STORAGE_KEY = "cvshow-sound";
const MASTER_VOLUME = 0.18;
const MUSIC_VOLUME = 0.32;
const MUSIC_DUCKED = 0.08;

let enabled = false;
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let musicBus: GainNode | null = null;
let noise: AudioBuffer | null = null;
let lastTick = 0;
const listeners = new Set<() => void>();

function readStored() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "on";
  } catch {
    return false;
  }
}

function audio() {
  if (!ctx) {
    ctx = new AudioContext();
    master = ctx.createGain();
    master.gain.value = MASTER_VOLUME;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return { ctx, out: master! };
}

function note(
  dest: AudioNode,
  type: OscillatorType,
  from: number,
  to: number,
  t: number,
  duration: number,
  volume: number,
  attack = 0.01,
) {
  const c = ctx!;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, t);
  if (to !== from) osc.frequency.exponentialRampToValueAtTime(to, t + duration);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(volume, t + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  osc.connect(gain).connect(dest);
  osc.start(t);
  osc.stop(t + duration + 0.05);
}

function tone(
  type: OscillatorType,
  from: number,
  to: number,
  start: number,
  duration: number,
  volume = 1,
) {
  const { ctx, out } = audio();
  note(out, type, from, to, ctx.currentTime + start, duration, volume);
}

function noiseBuffer() {
  const c = ctx!;
  if (!noise) {
    noise = c.createBuffer(1, c.sampleRate * 0.5, c.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  return noise;
}

function sweep(
  from: number,
  to: number,
  duration: number,
  volume: number,
  start = 0,
) {
  const { ctx: c, out } = audio();
  const t = c.currentTime + start;
  const src = c.createBufferSource();
  const filter = c.createBiquadFilter();
  const gain = c.createGain();
  src.buffer = noiseBuffer();
  filter.type = "bandpass";
  filter.Q.value = 1.2;
  filter.frequency.setValueAtTime(from, t);
  filter.frequency.exponentialRampToValueAtTime(to, t + duration);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(volume, t + duration * 0.3);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  src.connect(filter).connect(gain).connect(out);
  src.start(t);
  src.stop(t + duration + 0.05);
}

function brass(freq: number, start: number, duration: number, volume: number) {
  const { ctx: c, out } = audio();
  const t = c.currentTime + start;
  const filter = c.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 2200;
  filter.connect(out);
  for (const detune of [-6, 6]) {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "sawtooth";
    osc.frequency.value = freq;
    osc.detune.value = detune;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(volume, t + 0.03);
    gain.gain.setValueAtTime(volume, t + duration * 0.7);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    osc.connect(gain).connect(filter);
    osc.start(t);
    osc.stop(t + duration + 0.05);
  }
}

let lastPop = 0;
let popRun = 0;

const sounds: Record<SoundName, () => void> = {
  toggleOn: () => {
    tone("triangle", 660, 660, 0, 0.12, 0.8);
    tone("triangle", 990, 990, 0.1, 0.22, 0.8);
  },
  click: () => {
    tone("square", 520, 360, 0, 0.09, 0.45);
  },
  bubble: () => {
    tone("sine", 300, 900, 0, 0.12, 0.7);
  },
  tick: () => {
    const now = performance.now();
    if (now - lastTick < 75) return;
    lastTick = now;
    const pitch = 1400 + Math.random() * 500;
    tone("triangle", pitch, pitch * 0.8, 0, 0.035, 0.25);
  },
  flip: () => {
    sweep(700, 2600, 0.2, 0.55);
    tone("sine", 190, 90, 0.04, 0.12, 0.35);
  },
  sparkle: () => {
    tone("triangle", 1760, 1760, 0, 0.14, 0.4);
    tone("triangle", 2637, 2637, 0.07, 0.22, 0.35);
  },
  pop: () => {
    const now = performance.now();
    if (now - lastPop < 40) return;
    popRun = now - lastPop > 600 ? 0 : popRun + 1;
    lastPop = now;
    const f = 480 + Math.min(popRun, 24) * 32;
    tone("sine", f, f * 1.6, 0, 0.07, 0.4);
  },
  copy: () => {
    tone("sine", 1320, 1320, 0, 0.16, 0.5);
  },
  swooshUp: () => {
    sweep(300, 2400, 0.35, 0.5);
  },
  swooshDown: () => {
    sweep(2400, 300, 0.3, 0.4);
  },
  confetti: () => {
    sweep(1500, 6000, 0.25, 0.35);
    for (let i = 0; i < 14; i++) {
      const f = 2000 + Math.random() * 2500;
      tone("triangle", f, f, 0.05 + i * 0.035 + Math.random() * 0.02, 0.02, 0.15);
    }
  },
  fanfare: () => {
    brass(392.0, 0, 0.13, 0.22);
    brass(523.25, 0.14, 0.13, 0.22);
    brass(659.25, 0.28, 0.13, 0.22);
    brass(783.99, 0.42, 0.9, 0.26);
    brass(523.25, 0.42, 0.9, 0.14);
    brass(659.25, 0.42, 0.9, 0.14);
  },
};

export function play(name: SoundName) {
  if (!enabled || typeof window === "undefined") return;
  try {
    sounds[name]();
  } catch {}
}

const BPM = 84;
const HALF_BEAT = 60 / BPM / 2;
const STEPS_PER_BAR = 8;
const BARS: { bass: number; chord: number[] }[] = [
  { bass: 130.81, chord: [261.63, 329.63, 392.0, 493.88] },
  { bass: 110.0, chord: [220.0, 261.63, 329.63, 392.0] },
  { bass: 146.83, chord: [293.66, 349.23, 440.0, 523.25] },
  { bass: 98.0, chord: [196.0, 246.94, 293.66, 349.23] },
];

let musicTimer: number | null = null;
let nextStepTime = 0;
let step = 0;
let ducked = false;

function shaker(t: number, volume: number) {
  const c = ctx!;
  const src = c.createBufferSource();
  const filter = c.createBiquadFilter();
  const gain = c.createGain();
  src.buffer = noiseBuffer();
  filter.type = "highpass";
  filter.frequency.value = 6500;
  gain.gain.setValueAtTime(volume, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
  src.connect(filter).connect(gain).connect(musicBus!);
  src.start(t);
  src.stop(t + 0.06);
}

function chord(freqs: number[], t: number, volume: number) {
  for (const f of freqs) {
    note(musicBus!, "sine", f, f, t, 1.6, volume, 0.02);
    note(musicBus!, "triangle", f * 2.004, f * 2.004, t, 0.6, volume * 0.15);
  }
}

function scheduleStep(s: number, t: number) {
  const bar = BARS[Math.floor(s / STEPS_PER_BAR) % BARS.length];
  const pos = s % STEPS_PER_BAR;
  if (pos === 0) chord(bar.chord, t, 0.16);
  if (pos === 5) chord(bar.chord, t, 0.09);
  if (pos === 0 || pos === 4) {
    note(musicBus!, "sine", bar.bass, bar.bass, t, 0.7, 0.5, 0.02);
  }
  if (pos % 2 === 1) shaker(t, pos === 3 || pos === 7 ? 0.16 : 0.09);
}

function busTarget() {
  return ducked ? MUSIC_DUCKED : MUSIC_VOLUME;
}

function startMusic() {
  if (musicTimer !== null || !enabled || document.hidden) return;
  const { ctx: c, out } = audio();
  if (!musicBus) {
    musicBus = c.createGain();
    musicBus.gain.value = 0.0001;
    musicBus.connect(out);
  }
  musicBus.gain.cancelScheduledValues(c.currentTime);
  musicBus.gain.setTargetAtTime(busTarget(), c.currentTime, 0.6);
  nextStepTime = c.currentTime + 0.1;
  step = 0;
  musicTimer = window.setInterval(() => {
    while (nextStepTime < c.currentTime + 0.2) {
      scheduleStep(step, nextStepTime);
      nextStepTime += HALF_BEAT;
      step++;
    }
  }, 50);
}

function stopMusic() {
  if (musicTimer !== null) {
    window.clearInterval(musicTimer);
    musicTimer = null;
  }
  if (ctx && musicBus) {
    musicBus.gain.cancelScheduledValues(ctx.currentTime);
    musicBus.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.15);
  }
}

export function setMusicDucked(d: boolean) {
  ducked = d;
  if (ctx && musicBus && musicTimer !== null) {
    musicBus.gain.cancelScheduledValues(ctx.currentTime);
    musicBus.gain.setTargetAtTime(busTarget(), ctx.currentTime, d ? 0.08 : 0.5);
  }
}

if (typeof window !== "undefined") {
  enabled = readStored();
  const unlock = () => {
    if (enabled) startMusic();
    window.removeEventListener("pointerdown", unlock);
    window.removeEventListener("keydown", unlock);
  };
  window.addEventListener("pointerdown", unlock);
  window.addEventListener("keydown", unlock);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopMusic();
    else if (enabled && ctx) startMusic();
  });
}

export function setSoundEnabled(on: boolean) {
  enabled = on;
  try {
    localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
  } catch {}
  listeners.forEach((l) => l());
  if (on) {
    play("toggleOn");
    startMusic();
  } else {
    stopMusic();
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useSoundEnabled() {
  return useSyncExternalStore(
    subscribe,
    () => enabled,
    () => false,
  );
}
