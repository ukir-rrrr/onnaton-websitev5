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

type PetalTheme = "orchid" | "momiji";

/** Theme per month (Japan time), Jan → Dec. `null` = no petals that month. */
const MONTHLY_THEME: (PetalTheme | null)[] = [
  "orchid", "orchid", "orchid", // 1–3月: 青い胡蝶蘭
  "orchid", "orchid", "orchid", // 4–6月: 未定（いったん胡蝶蘭）
  "orchid", "orchid", "orchid", // 7–9月: 未定（いったん胡蝶蘭）
  "momiji", "momiji", "momiji", // 10–12月: 紅葉
];

/** Per-theme size multiplier — momiji has deep notches + padding, so it needs more width to look as large. */
const THEME_SIZE_SCALE: Record<PetalTheme, number> = {
  orchid: 1,
  momiji: 1.4,
};

/** Add paths here when transparent PNGs exist under `public/images/petals/` (avoids 404 until then). */
const PETAL_IMAGE_SRCS: Record<PetalTheme, string[]> = {
  orchid: [],
  momiji: [],
};

/** Orchid tints — pale-to-deep blue (owner's reference) with a soft shadow on the white intro plate. */
const ORCHID_TINTS = [
  { inner: "#dce9fd", outer: "#6f9ef0", edge: "rgba(70,120,210,0.5)" },
  { inner: "#eef4ff", outer: "#8fb4f3", edge: "rgba(90,135,215,0.45)" },
  { inner: "#c9dcfb", outer: "#5a8de6", edge: "rgba(60,105,200,0.5)" },
];

/** Momiji tints — red, vermilion and amber leaves. */
const MOMIJI_TINTS = [
  { inner: "#ee8a4a", outer: "#c42b1e", edge: "rgba(120,25,15,0.5)" },
  { inner: "#f6b552", outer: "#de5a26", edge: "rgba(140,55,20,0.45)" },
  { inner: "#f8d67a", outer: "#e0952c", edge: "rgba(150,90,25,0.45)" },
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

/** Month (1–12) in Japan time, regardless of the visitor's timezone. */
function currentMonthJst(): number {
  return Number(
    new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Tokyo", month: "numeric" }).format(
      new Date(),
    ),
  );
}

/** Pre-render one petal (rounded tip, narrow base) so each frame is a cheap drawImage. */
function createOrchidSprite(tint: (typeof ORCHID_TINTS)[number]): Sprite {
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

/** Lobe tips of a Japanese maple leaf: [angle from straight up (deg), length ratio]. */
const MOMIJI_TIPS: [number, number][] = [
  [-125, 0.55],
  [-82, 0.82],
  [-40, 0.96],
  [0, 1],
  [40, 0.96],
  [82, 0.82],
  [125, 0.55],
];

/** Pre-render one seven-lobed maple leaf with veins and a short stem. */
function createMomijiSprite(tint: (typeof MOMIJI_TINTS)[number]): Sprite {
  const size = 80;
  const pad = 6;
  const canvas = document.createElement("canvas");
  canvas.width = size + pad * 2;
  canvas.height = size + pad * 2;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const cx = pad + size / 2;
    const cy = pad + size * 0.56;
    const radius = size * 0.46;
    const point = (deg: number, ratio: number): [number, number] => {
      const rad = (deg * Math.PI) / 180;
      return [cx + Math.sin(rad) * radius * ratio, cy - Math.cos(rad) * radius * ratio];
    };

    ctx.beginPath();
    ctx.moveTo(...point(180, 0.12));
    ctx.lineTo(...point(-150, 0.25));
    MOMIJI_TIPS.forEach(([deg, len], i) => {
      // Broad lobe body that tapers to a sharp tip, then back down to the notch between lobes
      ctx.bezierCurveTo(
        ...point(deg - 20, len * 0.6),
        ...point(deg - 6, len * 0.82),
        ...point(deg, len),
      );
      const next = MOMIJI_TIPS[i + 1];
      const notch = next ? point((deg + next[0]) / 2, 0.45) : point(150, 0.25);
      ctx.bezierCurveTo(...point(deg + 6, len * 0.82), ...point(deg + 20, len * 0.6), ...notch);
    });
    ctx.closePath();

    const gradient = ctx.createRadialGradient(cx, cy - radius * 0.1, 2, cx, cy, radius);
    gradient.addColorStop(0, tint.inner);
    gradient.addColorStop(1, tint.outer);
    ctx.shadowColor = "rgba(110,40,20,0.22)";
    ctx.shadowBlur = 4;
    ctx.shadowOffsetY = 1;
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.shadowColor = "transparent";
    ctx.lineWidth = 1;
    ctx.strokeStyle = tint.edge;
    ctx.stroke();

    // Veins from the center to each tip, plus the stem
    ctx.beginPath();
    for (const [deg, len] of MOMIJI_TIPS) {
      ctx.moveTo(cx, cy);
      ctx.lineTo(...point(deg, len * 0.85));
    }
    ctx.moveTo(cx, cy);
    ctx.quadraticCurveTo(cx + 2, cy + radius * 0.4, cx + 5, cy + radius * 0.75);
    ctx.lineWidth = 1.2;
    ctx.lineCap = "round";
    ctx.stroke();
  }
  return { source: canvas, aspect: canvas.height / canvas.width };
}

const THEME_SPRITES: Record<PetalTheme, () => Sprite[]> = {
  orchid: () => ORCHID_TINTS.map(createOrchidSprite),
  momiji: () => MOMIJI_TINTS.map(createMomijiSprite),
};

/** Seasonal petals (blue orchid / momiji) drifting down over the intro plate (canvas, no per-petal DOM). */
export function PetalFall() {
  const reduceMotion = useReducedMotion() === true;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (reduceMotion) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const theme = MONTHLY_THEME[currentMonthJst() - 1];
    if (!theme) return;

    let disposed = false;
    let sprites: Sprite[] = THEME_SPRITES[theme]();
    const sizeScale = THEME_SIZE_SCALE[theme];

    const imageSrcs = PETAL_IMAGE_SRCS[theme];
    if (imageSrcs.length > 0) {
      const images = imageSrcs.map((src) => {
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
    }

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
        const drawW = petal.size * sizeScale;
        const drawH = drawW * sprite.aspect;
        const margin = Math.max(drawW, drawH);
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
        ctx.drawImage(sprite.source, -drawW / 2, -drawH / 2, drawW, drawH);
      }

      ctx.globalAlpha = 1;
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
