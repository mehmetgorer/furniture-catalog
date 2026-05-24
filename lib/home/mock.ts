/**
 * Stable Unsplash URLs for homepage mock content (Phase 3 / 3.1).
 * `images.unsplash.com` must stay allowlisted in `next.config.ts`.
 * No Supabase — replace with storage URLs when wiring public data.
 *
 * Each URL uses explicit `w` + `fit=crop` for predictable CDN behavior.
 */

const q = "auto=format&fit=crop&q=82";

/** Hero: wide living / interior shots */
export const mockHeroImages = [
  `https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?${q}&w=2400&h=1200`,
  `https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?${q}&w=2400&h=1200`,
  `https://images.unsplash.com/photo-1583847268964-b42fb153dda0?${q}&w=2400&h=1200`,
] as const;

/** Categories: sofa → bedroom → dining → TV area */
export const mockCategoryImages = [
  `https://images.unsplash.com/photo-1540574163026-643ea20ade25?${q}&w=1200&h=900`,
  `https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?${q}&w=1200&h=900`,
  `https://images.unsplash.com/photo-1617806118233-18e1de247200?${q}&w=1200&h=900`,
  `https://images.unsplash.com/photo-1598928506311-c55ed91a96fe?${q}&w=1200&h=900`,
] as const;

/** Products: distinct interiors so cards do not all reuse one failing asset */
export const mockProductImages = [
  `https://images.unsplash.com/photo-1586023492125-27b2c045efd7?${q}&w=1200&h=900`,
  `https://images.unsplash.com/photo-1578662996442-48f60103fc96?${q}&w=1200&h=900`,
  `https://images.unsplash.com/photo-1600585154340-be6161a56a0c?${q}&w=1200&h=900`,
  `https://images.unsplash.com/photo-1631049307264-da0ec9d70304?${q}&w=1200&h=900`,
] as const;
