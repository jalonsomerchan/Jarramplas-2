import { scenarios } from "../config.js";
import {
  HOUSE_BOTTOM_PASSABLE_RATIO,
  HOUSE_BASE_HEIGHTS,
  HOUSE_BOUNDS,
  HOUSE_TOP_BLOCK_RATIO,
  WORLD,
} from "./constants.js";
import { scenarioLayouts } from "./scenario-layouts.js";
import { state } from "./state.js";
import { seeded } from "./utils.js";

export function getHouseBounds(variant) {
  return HOUSE_BOUNDS[variant % HOUSE_BOUNDS.length] || HOUSE_BOUNDS[0];
}

export function getHouseLayout(houseObstacle) {
  const variant = houseObstacle.variant || 0;
  const bounds = getHouseBounds(variant);
  const visibleW = bounds.r - bounds.l;
  const visibleH = bounds.b - bounds.t;
  const baseHeight = HOUSE_BASE_HEIGHTS[variant % HOUSE_BASE_HEIGHTS.length] || HOUSE_BASE_HEIGHTS[0];
  const scale = Math.min(1.05, Math.max(0.92, houseObstacle.scale || 1));
  const drawH = baseHeight * scale;
  const drawW = drawH * (visibleW / visibleH);
  const centerX = houseObstacle.x + houseObstacle.w / 2;
  const bottomY = houseObstacle.y + houseObstacle.h + 18;
  const left = centerX - drawW / 2;
  const top = bottomY - drawH;
  return { bounds, left, top, bottomY, drawW, drawH };
}

export function getHouseBlock(houseObstacle) {
  const layout = getHouseLayout(houseObstacle);
  return {
    x: layout.left + layout.drawW * 0.06,
    y: layout.top + layout.drawH * HOUSE_TOP_BLOCK_RATIO,
    w: layout.drawW * 0.88,
    h: layout.drawH * (1 - HOUSE_TOP_BLOCK_RATIO - HOUSE_BOTTOM_PASSABLE_RATIO),
  };
}

export function house(x, y, w, h, variant, scale = 1.12) {
  const obstacle = {
    x,
    y,
    w,
    h,
    type: "house",
    variant,
    scale,
  };
  obstacle.block = getHouseBlock(obstacle);
  return {
    ...obstacle,
  };
}

export function fountain(x, y, w, h, variant) {
  return {
    x,
    y,
    w,
    h,
    type: "fountain",
    variant,
    block: {
      x: x - w * 0.31,
      y: y - h * 0.2,
      w: w * 0.62,
      h: h * 0.16,
    },
  };
}

export function createVillage(seedValue = 1) {
  const rand = seeded(seedValue);
  const scenario = scenarios[state.scenarioIndex] || scenarios[0];
  const layout = scenarioLayouts[scenario.id] || scenarioLayouts["plaza-eras"];
  const obstacles = [
    ...layout.houses.map((item) => house(...item)),
    fountain(layout.fountain.x, layout.fountain.y, layout.fountain.w, layout.fountain.h, layout.fountain.variant),
    { x: 0, y: 0, w: WORLD.w, h: 36, type: "wall" },
    { x: 0, y: WORLD.h - 36, w: WORLD.w, h: 36, type: "wall" },
    { x: 0, y: 0, w: 36, h: WORLD.h, type: "wall" },
    { x: WORLD.w - 36, y: 0, w: 36, h: WORLD.h, type: "wall" },
  ];
  for (let i = 0; i < 76; i += 1) {
    const x = 90 + rand() * (WORLD.w - 180);
    const y = 380 + rand() * (WORLD.h - 610);
    if (Math.abs(x - 1110) < 520 && Math.abs(y - 860) < 360) continue;
    if (Math.abs(x - layout.fountain.x) < 360 && Math.abs(y - layout.fountain.y) < 300) continue;
    obstacles.push({
      x,
      y,
      w: 38 + rand() * 42,
      h: 46 + rand() * 52,
      type: "tree",
      tone: Math.floor(rand() * 3),
    });
  }
  state.obstacles = obstacles;
  state.piles = [
    { x: 310, y: 560, amount: 8, variant: 0 },
    { x: 775, y: 730, amount: 7, variant: 1 },
    { x: 1240, y: 520, amount: 8, variant: 2 },
    { x: 1650, y: 830, amount: 7, variant: 3 },
    { x: 610, y: 1330, amount: 8, variant: 1 },
    { x: 1880, y: 1370, amount: 7, variant: 0 },
    { x: 2520, y: 650, amount: 8, variant: 2 },
    { x: 2800, y: 1280, amount: 7, variant: 3 },
    { x: 2140, y: 1900, amount: 8, variant: 1 },
    { x: 920, y: 2060, amount: 7, variant: 0 },
  ];
}
