"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

/** Petals on screen at once (viewport width < MOBILE_MAX_WIDTH → mobile). */
const PETAL_COUNT_DESKTOP = 20;
const PETAL_COUNT_MOBILE = 10;
const MOBILE_MAX_WIDTH = 768;

/** Seconds for one petal to travel from the top edge to the bottom edge. */
const FALL_SECONDS_MIN = 8;
const FALL_SECONDS_MAX = 15;

/** Horizontal travel per unit of vertical travel (> 0 → drifts from the upper left to the lower right). */
const DRIFT_RATIO = 0.6;

/** Petal width in CSS px (mobile is scaled down). */
const PETAL_SIZE_MIN = 24;
const PETAL_SIZE_MAX = 48;
const MOBILE_SIZE_SCALE = 0.8;

/** Side-to-side sway: amplitude (px) and angular speed (rad/s). */
const SWAY_PX_MIN = 20;
const SWAY_PX_MAX = 60;
const SWAY_SPEED_MIN = 0.6;
const SWAY_SPEED_MAX = 1.4;

/** Max spin (rad/s) and 3D-like flip speed (rad/s, drives scaleX). */
const SPIN_MAX = 0.9;
const FLIP_SPEED_MIN = 1.2;
const FLIP_SPEED_MAX = 2.8;

const ALPHA_MIN = 0.6;
const ALPHA_MAX = 0.95;

const MAX_DPR = 2;

/** Transparent PNGs; until they exist, canvas-drawn petals are used instead. */
const PETAL_IMAGE_SRCS = [
  "/images/petals/petal1.png",
  "/images/petals/petal2.png",
  "/images/petals/petal3.png",
];

/** Fallback petal tints — pale-to-deep blue (owner's reference) with a soft shadow on the white intro plate. */
const FALLBACK_TINTS = [
  { inner: "#dce9fd", outer: "#6f9ef0", edge: "rgba(70,120,210,0.5)" },
  { inner: "#eef4ff", outer: "#8fb4f3", edge: "rgba(90,135,215,0.45)" },
  { inner: "#c9dcfb", outer: "#5a8de6", edge: "rgba(60,105,200,0.5)" },
];

type Sprite = { source: CanvasImageSource; aspect: number };

type Petal = {
  /** Horizontal start, 0–1 across [-drift, width] so diagonal paths cover the whole screen. */
  xRatio: number;
  /** Vertical progress, 0 (just above the top) → 1 (just below the bottom). */
  progress: number;
  size: number;
  fallSeconds: number;
  swayAmp: number;
  swaySpeed: number;
  swayPhase: number;
  rotation: number;
  spin: number;
  flipSpeed: number;
  flipPhase: number;
  alpha: number;
  variant: number;
};

const rand = (min: number, max: number) => min + Math.random() * (max - min);

function createPetal(progress: number, isMobile: boolean): Petal {
  return {
    xRatio: Math.random(),
    progress,
    size: rand(PETAL_SIZE_MIN, PETAL_SIZE_MAX) * (isMobile ? MOBILE_SIZE_SCALE : 1),
    fallSeconds: rand(FALL_SECONDS_MIN, FALL_SECONDS_MAX),
    swayAmp: rand(SWAY_PX_MIN, SWAY_PX_MAX),
    swaySpeed: rand(SWAY_SPEED_MIN, SWAY_SPEED_MAX),
    swayPhase: rand(0, Math.PI * 2),
    rotation: rand(0, Math.PI * 2),
    spin: rand(-SPIN_MAX, SPIN_MAX),
    flipSpeed: rand(FLIP_SPEED_MIN, FLIP_SPEED_MAX),
    flipPhase: rand(0, Math.PI * 2),
    alpha: rand(ALPHA_MIN, ALPHA_MAX),
    variant: Math.floor(Math.random() * 3),
  };
}

/** Pre-render one petal (rounded tip, narrow base) so each frame is a cheap drawImage. */
function createFallbackSprite(tint: (typeof FALLBACK_TINTS)[number]): Sprite {
  const w = 64;
  const h = 80;
  const pad = 6;
  const canvas = document.createElement("canvas");
  canvas.width = w + pad * 2;
  canvas.height = h + pad * 2;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.translate(pad, pad);
    ctx.beginPath();
    ctx.moveTo(w / 2, h * 0.97);
    ctx.bezierCurveTo(w * 0.04, h * 0.74, w * 0.02, h * 0.18, w / 2, h * 0.04);
    ctx.bezierCurveTo(w * 0.98, h * 0.18, w * 0.96, h * 0.74, w / 2, h * 0.97);
    ctx.closePath();

    const gradient = ctx.createRadialGradient(w * 0.45, h * 0.38, 2, w / 2, h / 2, h * 0.58);
    gradient.addColorStop(0, tint.inner);
    gradient.addColorStop(1, tint.outer);
    ctx.shadowColor = "rgba(50,85,150,0.22)";
    ctx.shadowBlur = 4;
    ctx.shadowOffsetY = 1;
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.shadowColor = "transparent";
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = tint.edge;
    ctx.stroke();
  }
  return { source: canvas, aspect: canvas.height / canvas.width };
}

/** Phalaenopsis petals drifting down over the intro plate (canvas, no per-petal DOM). */
export function PetalFall() {
  const reduceMotion = useReducedMotion() === true;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (reduceMotion) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let disposed = false;
    let sprites: Sprite[] = FALLBACK_TINTS.map(createFallbackSprite);

    // Load PNGs in the background; swap in only if they decode (404 → keep fallback).
    const images = PETAL_IMAGE_SRCS.map((src) => {
      const img = new window.Image();
      img.decoding = "async";
      img.src = src;
      return img;
    });
    void Promise.allSettled(images.map((img) => img.decode())).then((results) => {
      if (disposed) return;
      const loaded = images.filter(
        (img, i) => results[i].status === "fulfilled" && img.naturalWidth > 0,
      );
      if (loaded.length > 0) {
        sprites = loaded.map((img) => ({
          source: img,
          aspect: img.naturalHeight / img.naturalWidth,
        }));
      }
    });

    let width = 0;
    let height = 0;
    let dpr = 1;
    let isMobile = false;
    let petals: Petal[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      isMobile = width < MOBILE_MAX_WIDTH;

      // Diagonal paths spend part of their life off screen; scale up so the visible count stays near the constant
      const base = isMobile ? PETAL_COUNT_MOBILE : PETAL_COUNT_DESKTOP;
      const target = Math.round((base * (width + height * DRIFT_RATIO)) / Math.max(width, 1));
      if (petals.length > target) petals = petals.slice(0, target);
      // Random progress so petals are already mid-fall on the first frame
      while (petals.length < target) petals.push(createPetal(Math.random(), isMobile));
    };

    let rafId = 0;
    let lastTime = 0;
    let elapsed = 0;

    const frame = (now: number) => {
      // Clamp dt so a stalled frame doesn't teleport petals
      const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 0;
      lastTime = now;
      elapsed += dt;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < petals.length; i++) {
        let petal = petals[i];
        petal.progress += dt / petal.fallSeconds;
        petal.rotation += petal.spin * dt;
        if (petal.progress > 1) {
          petal = createPetal(0, isMobile);
          petals[i] = petal;
        }

        const sprite = sprites[petal.variant % sprites.length];
        const drawH = petal.size * sprite.aspect;
        const margin = Math.max(petal.size, drawH);
        const travelY = height + margin * 2;
        const driftX = travelY * DRIFT_RATIO;
        const x =
          -driftX +
          petal.xRatio * (width + driftX) +
          petal.progress * driftX +
          Math.sin(elapsed * petal.swaySpeed + petal.swayPhase) * petal.swayAmp;
        const y = -margin + petal.progress * travelY;
        const flip = Math.cos(elapsed * petal.flipSpeed + petal.flipPhase);

        ctx.globalAlpha = petal.alpha;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.translate(x, y);
        ctx.rotate(petal.rotation);
        ctx.scale(flip, 1);
        ctx.drawImage(sprite.source, -petal.size / 2, -drawH / 2, petal.size, drawH);
      }

      rafId = window.requestAnimationFrame(frame);
    };

    const start = () => {
      if (rafId) return;
      lastTime = 0;
      rafId = window.requestAnimationFrame(frame);
    };
    const stop = () => {
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    };
    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    if (!document.hidden) start();

    return () => {
      disposed = true;
      stop();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduceMotion]);

  if (reduceMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 size-full"
      aria-hidden
    />
  );
}
