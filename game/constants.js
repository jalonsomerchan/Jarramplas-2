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
export const HOUSE_SHEET_ROWS = 2;
export const FOUNTAIN_SHEET_COLS = 3;
export const VILLAGER_THROW_TYPE_COUNT = 4;
export const HOUSE_TOP_BLOCK_RATIO = 0.1;
export const HOUSE_BOTTOM_PASSABLE_RATIO = 0.05;
export const HOUSE_BOUNDS = [
  { l: 47 / 384, t: 31 / 384, r: 337 / 384, b: 352 / 384 },
  { l: 41 / 384, t: 41 / 384, r: 342 / 384, b: 342 / 384 },
  { l: 102 / 384, t: 43 / 384, r: 282 / 384, b: 340 / 384 },
  { l: 24 / 384, t: 56 / 384, r: 359 / 384, b: 327 / 384 },
  { l: 32 / 384, t: 53 / 384, r: 351 / 384, b: 331 / 384 },
  { l: 15 / 384, t: 70 / 384, r: 368 / 384, b: 314 / 384 },
];
