export const DPR = Math.min(window.devicePixelRatio || 1, 2);
export const TILE = 48;
export const WORLD = { w: 3200, h: 2400 };
export const PLAYER_RADIUS = 20;
export const TURNIP_SPEED = 720;
export const CROWD_TURNIP_SPEED = 360;
export const PLAYER_MAX_TURNIPS = 14;
export const MOBILE_CONTROL_BREAKPOINT = 760;
export const keys = new Set();
export const HOUSE_SHEET_COLS = 3;
export const HOUSE_SHEET_ROWS = 3;
export const FOUNTAIN_SHEET_COLS = 3;
export const VILLAGER_THROW_TYPE_COUNT = 4;
export const HOUSE_TOP_BLOCK_RATIO = 0.1;
export const HOUSE_BOTTOM_PASSABLE_RATIO = 0.05;
export const HOUSE_BASE_HEIGHTS = [210, 215, 185, 230, 205, 200, 195, 205, 200];
export const HOUSE_BOUNDS = [
  { l: 84 / 384, t: 77 / 384, r: 300 / 384, b: 307 / 384 },
  { l: 52 / 384, t: 77 / 384, r: 332 / 384, b: 306 / 384 },
  { l: 57 / 384, t: 101 / 384, r: 327 / 384, b: 282 / 384 },
  { l: 114 / 384, t: 67 / 384, r: 270 / 384, b: 316 / 384 },
  { l: 70 / 384, t: 81 / 384, r: 314 / 384, b: 302 / 384 },
  { l: 91 / 384, t: 86 / 384, r: 293 / 384, b: 297 / 384 },
  { l: 79 / 384, t: 86 / 384, r: 305 / 384, b: 298 / 384 },
  { l: 70 / 384, t: 86 / 384, r: 313 / 384, b: 298 / 384 },
  { l: 71 / 384, t: 82 / 384, r: 312 / 384, b: 301 / 384 },
];
