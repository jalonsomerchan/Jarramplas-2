import { scenarios } from "../config.js";
import {
  HOUSE_BOTTOM_PASSABLE_RATIO,
  HOUSE_BASE_HEIGHTS,
  HOUSE_BOUNDS,
  HOUSE_TOP_BLOCK_RATIO,
  WORLD,
} from "./constants.js";
import { houseAssets } from "./house-assets.js";
import { objectAssets } from "./object-assets.js";
import { scenarioLayouts } from "./scenario-layouts.js";
import { state } from "./state.js";

export function getHouseBounds(variant) {
  return HOUSE_BOUNDS[variant % HOUSE_BOUNDS.length] || HOUSE_BOUNDS[0];
}

export function getHouseLayout(houseObstacle) {
  const variant = houseObstacle.variant || 0;
  const bounds = getHouseBounds(variant);
  const houseAsset = houseAssets[variant % houseAssets.length] || houseAssets[0];
  const visibleW = houseAsset?.w || bounds.r - bounds.l;
  const visibleH = houseAsset?.h || bounds.b - bounds.t;
  const baseHeight = HOUSE_BASE_HEIGHTS[variant % HOUSE_BASE_HEIGHTS.length] || HOUSE_BASE_HEIGHTS[0];
  const scale = Math.min(1.05, Math.max(0.92, houseObstacle.scale || 1));
  const ratio = visibleW / visibleH;
  const rawDrawH = baseHeight * scale;
  const rawDrawW = rawDrawH * ratio;
  const drawW = Math.min(600, rawDrawW);
  const drawH = drawW === rawDrawW ? rawDrawH : drawW / ratio;
  const centerX = houseObstacle.x + houseObstacle.w / 2;
  const bottomY = houseObstacle.y + houseObstacle.h + 18;
  const left = centerX - drawW / 2;
  const top = bottomY - drawH;
  return { bounds, left, top, bottomY, drawW, drawH };
}

export function getHouseBlock(houseObstacle) {
  const layout = getHouseLayout(houseObstacle);
  return {
    x: layout.left + layout.drawW * 0.02,
    y: layout.top + layout.drawH * HOUSE_TOP_BLOCK_RATIO,
    w: layout.drawW * 0.96,
    h: layout.drawH * (1 - HOUSE_TOP_BLOCK_RATIO - HOUSE_BOTTOM_PASSABLE_RATIO),
  };
}

export function getHouseCollision(houseObstacle) {
  const layout = getHouseLayout(houseObstacle);
  return getBuildingCollision(layout.left, layout.top, layout.drawW, layout.drawH);
}

export function getBuildingCollision(left, top, w, h) {
  return getRectCollision(left, top, w, h, {
    left: 0.02,
    top: HOUSE_TOP_BLOCK_RATIO,
    right: 0.02,
    bottom: HOUSE_BOTTOM_PASSABLE_RATIO,
  });
}

export function getRectCollision(left, top, w, h, inset) {
  const x1 = left + w * inset.left;
  const y1 = top + h * inset.top;
  const x2 = left + w * (1 - inset.right);
  const y2 = top + h * (1 - inset.bottom);
  return {
    type: "polygon",
    points: [
      { x: x1, y: y1 },
      { x: x2, y: y1 },
      { x: x2, y: y2 },
      { x: x1, y: y2 },
    ],
  };
}

export function house(x, y, w, h, variant, scale = 1.12, z = 0) {
  const obstacle = {
    x,
    y,
    w,
    h,
    type: "house",
    variant,
    scale,
    z,
  };
  obstacle.block = getHouseBlock(obstacle);
  obstacle.collision = getHouseCollision(obstacle);
  return {
    ...obstacle,
  };
}

export function object(x, y, w, h, variant = 0, scale = 1, z = 0) {
  const asset = objectAssets[variant % Math.max(1, objectAssets.length)] || objectAssets[0];
  const ratio = asset ? asset.w / asset.h : w / Math.max(1, h);
  const drawH = h * Math.min(1.2, Math.max(0.6, scale || 1));
  const drawW = drawH * ratio;
  const left = x + w / 2 - drawW / 2;
  const top = y + h - drawH;
  return {
    x,
    y,
    w,
    h,
    type: "object",
    variant,
    scale,
    z,
    draw: { x: left, y: top, w: drawW, h: drawH },
    block: {
      x: left + drawW * 0.08,
      y: top + drawH * 0.1,
      w: drawW * 0.84,
      h: drawH * 0.86,
    },
    collision: getRectCollision(left, top, drawW, drawH, {
      left: 0.08,
      top: 0.1,
      right: 0.08,
      bottom: 0.04,
    }),
  };
}

export function createVillage(seedValue = 1) {
  const scenario = scenarios[state.scenarioIndex] || scenarios[0];
  const layout = scenarioLayouts[scenario.id] || scenarioLayouts[scenarios[0]?.id];
  const obstacles = [
    ...layout.houses.map((item) => house(...item)),
    ...(layout.objects || []).map((item) => object(...item)),
    { x: 0, y: 0, w: WORLD.w, h: 36, type: "wall" },
    { x: 0, y: WORLD.h - 36, w: WORLD.w, h: 36, type: "wall" },
    { x: 0, y: 0, w: 36, h: WORLD.h, type: "wall" },
    { x: WORLD.w - 36, y: 0, w: 36, h: WORLD.h, type: "wall" },
  ];
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
