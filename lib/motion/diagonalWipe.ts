/**
 * clip-path polygons for a right→left wipe with a slanted leading edge.
 * Top of the left edge sits further left than the bottom (≈15–20% skew).
 */
export const CLIP_OFF_RIGHT =
  "polygon(100% 0%, 130% 0%, 130% 100%, 100% 100%)";

/** Full cover; left edge remains diagonal for continuity into the exit. */
export const CLIP_COVER =
  "polygon(-18% 0%, 100% 0%, 100% 100%, 0% 100%)";

export const CLIP_OFF_LEFT =
  "polygon(-40% 0%, -10% 0%, -10% 100%, -55% 100%)";

/** Incoming slide settles to a clean rectangle after the diagonal wipe. */
export const CLIP_FULL =
  "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";

export const WIPE_EASE = [0.65, 0, 0.35, 1] as const;
export const WIPE_DURATION = 0.7;

/** Static logo (家紋) hold before it cross-fades to the hero image. */
export const INTRO_LOGO_HOLD_MS = 1500;

/** Logo plate opacity 1 → 0; even cross-fade to the hero (linear in PageIntro). */
export const INTRO_LOGO_FADE_DURATION = 1.15;
