import * as PIXI from "../vendor/pixi/pixi.min.mjs";
import { scenarios } from "../config.js";
import {
  MOBILE_CONTROL_BREAKPOINT,
  TILE,
  WORLD,
} from "./constants.js";
import { canvas } from "./dom.js";
import { scenarioLayouts } from "./scenario-layouts.js";
import { assets, state } from "./state.js";
import { clamp } from "./utils.js";
import { getHouseLayout } from "./world.js";

let app = null;
let frameRoot = null;
let worldLayer = null;
let overlayLayer = null;
const textureCache = new WeakMap();
const frameTextureCache = new Map();
const actorSpriteMetrics = new WeakMap();

export async function initPixiRenderer() {
  if (app) return app;

  app = new PIXI.Application();
  await app.init({
    canvas,
    width: Math.max(1, state.w || canvas.clientWidth || 1),
    height: Math.max(1, state.h || canvas.clientHeight || 1),
    resolution: Math.min(window.devicePixelRatio || 1, 2),
    autoDensity: true,
    autoStart: false,
    backgroundAlpha: 1,
    backgroundColor: 0x161311,
    antialias: false,
    preference: ["webgl", "webgpu"],
    powerPreference: "high-performance",
  });
  app.stage.label = "Jarramplas";
  frameRoot = new PIXI.Container({ label: "frame" });
  worldLayer = new PIXI.Container({ label: "world" });
  overlayLayer = new PIXI.Container({ label: "overlay" });
  frameRoot.addChild(worldLayer, overlayLayer);
  app.stage.addChild(frameRoot);

  return app;
}

export function getPixiDebugInfo() {
  return {
    app,
    renderer: app?.renderer,
    rendererName: app?.renderer?.name,
    stage: app?.stage,
  };
}

export function resizePixiRenderer(width, height) {
  if (!app?.renderer) return;
  app.renderer.resize(width, height);
}

function resetLayers() {
  if (!app) return false;
  for (const layer of [worldLayer, overlayLayer]) {
    const children = layer.removeChildren();
    children.forEach((child) => child.destroy?.());
  }
  return true;
}

function colorStyle(value, fallback = 0xffffff) {
  if (typeof value === "number") return { color: value, alpha: 1 };
  if (!value) return { color: fallback, alpha: 1 };
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(value);
  if (hex) {
    const raw = hex[1].length === 3 ? hex[1].split("").map((c) => c + c).join("") : hex[1];
    return { color: Number.parseInt(raw, 16), alpha: 1 };
  }
  const rgba = /^rgba?\(([^)]+)\)$/i.exec(value);
  if (rgba) {
    const [r, g, b, a = 1] = rgba[1].split(",").map((part) => Number.parseFloat(part.trim()));
    return { color: ((r & 255) << 16) + ((g & 255) << 8) + (b & 255), alpha: Number.isFinite(a) ? a : 1 };
  }
  return { color: fallback, alpha: 1 };
}

function fill(g, value) {
  g.fill(colorStyle(value));
}

function stroke(g, value, width = 1) {
  g.stroke({ ...colorStyle(value), width });
}

function textureFromImage(img) {
  if (!img) return null;
  let texture = textureCache.get(img);
  if (!texture) {
    texture = PIXI.Texture.from(img);
    texture.source.scaleMode = "nearest";
    textureCache.set(img, texture);
  }
  return texture;
}

function frameTexture(img, sx, sy, sw, sh) {
  const base = textureFromImage(img);
  if (!base) return null;
  const key = `${base.uid}:${Math.round(sx)}:${Math.round(sy)}:${Math.round(sw)}:${Math.round(sh)}`;
  let texture = frameTextureCache.get(key);
  if (!texture) {
    texture = new PIXI.Texture({
      source: base.source,
      frame: new PIXI.Rectangle(sx, sy, sw, sh),
    });
    frameTextureCache.set(key, texture);
  }
  return texture;
}

function addSprite(img, sx, sy, sw, sh, x, y, w, h, options = {}) {
  const texture = frameTexture(img, sx, sy, sw, sh);
  if (!texture) return false;
  const sprite = new PIXI.Sprite({ texture });
  sprite.position.set(x, y);
  sprite.anchor.set(options.anchorX ?? 0, options.anchorY ?? 0);
  sprite.setSize(w, h);
  if (options.flip) sprite.scale.x *= -1;
  if (options.rotation) sprite.rotation = options.rotation;
  if (options.alpha !== undefined) sprite.alpha = options.alpha;
  if (options.tint !== undefined) sprite.tint = options.tint;
  (options.layer || worldLayer).addChild(sprite);
  return true;
}

export function drawSpriteSheet(img, rows, cols, frame, x, y, w, h, flip = false) {
  if (!img) return false;
  const sourceW = img.width / cols;
  const sourceH = img.height / rows;
  const sx = (frame % cols) * sourceW;
  const sy = Math.floor(frame / cols) * sourceH;
  return addSprite(img, sx, sy, sourceW, sourceH, x, y, w, h, {
    anchorX: 0.5,
    anchorY: 1,
    flip,
  });
}

function getActorSpriteMetrics(img, rows, cols) {
  if (!img) return [];
  const cached = actorSpriteMetrics.get(img);
  const key = `${rows}x${cols}`;
  if (cached?.key === key) return cached.frames;

  const metricsCanvas = document.createElement("canvas");
  metricsCanvas.width = img.width;
  metricsCanvas.height = img.height;
  const sourceCtx = metricsCanvas.getContext("2d", { willReadFrequently: true });
  sourceCtx.drawImage(img, 0, 0);

  const cellW = img.width / cols;
  const cellH = img.height / rows;
  const frames = Array.from({ length: rows * cols }, (_, index) => {
    const sx = Math.floor((index % cols) * cellW);
    const sy = Math.floor(Math.floor(index / cols) * cellH);
    const sw = Math.floor(cellW);
    const sh = Math.floor(cellH);
    const data = sourceCtx.getImageData(sx, sy, sw, sh).data;
    let minX = sw;
    let minY = sh;
    let maxX = -1;
    let maxY = -1;

    for (let py = 0; py < sh; py += 1) {
      for (let px = 0; px < sw; px += 1) {
        const alpha = data[((py * sw + px) * 4) + 3];
        if (alpha <= 10) continue;
        minX = Math.min(minX, px);
        minY = Math.min(minY, py);
        maxX = Math.max(maxX, px);
        maxY = Math.max(maxY, py);
      }
    }

    if (maxX < minX || maxY < minY) return { sx, sy, sw, sh };

    const pad = 2;
    const cropX = Math.max(0, minX - pad);
    const cropY = Math.max(0, minY - pad);
    const cropR = Math.min(sw, maxX + pad + 1);
    const cropB = Math.min(sh, maxY + pad + 1);
    return {
      sx: sx + cropX,
      sy: sy + cropY,
      sw: cropR - cropX,
      sh: cropB - cropY,
    };
  });

  actorSpriteMetrics.set(img, { key, frames });
  return frames;
}

function drawActorSpriteFrame(img, rows, cols, frame, x, y, targetHeight, flip = false) {
  if (!img) return false;
  const metrics = getActorSpriteMetrics(img, rows, cols);
  const crop = metrics[frame] || metrics[0];
  if (!crop) return false;
  const drawH = targetHeight;
  const drawW = drawH * (crop.sw / crop.sh);
  return addSprite(img, crop.sx, crop.sy, crop.sw, crop.sh, x, y, drawW, drawH, {
    anchorX: 0.5,
    anchorY: 1,
    flip,
  });
}

export function getCharacterAssets(index) {
  return assets.images.playerCharacters?.[index] || assets.images.playerCharacters?.[0] || {
    walk: assets.images.playerWalk,
    throw: assets.images.playerThrow,
  };
}

function drawPlazaShape(g, plaza) {
  if (plaza.shape === "ellipse") {
    g.ellipse(plaza.x + plaza.w / 2, plaza.y + plaza.h / 2, plaza.w / 2, plaza.h / 2, plaza.rotation || 0);
    return;
  }
  g.rect(plaza.x, plaza.y, plaza.w, plaza.h);
}

export function drawMap() {
  const scenario = scenarios[state.scenarioIndex] || scenarios[0];
  const layout = scenarioLayouts[scenario.id] || scenarioLayouts[scenarios[0]?.id];
  const ground = layout.ground;
  const bg = new PIXI.Graphics();
  bg.rect(0, 0, state.w, state.h);
  fill(bg, ground[1]);
  worldLayer.addChild(bg);

  const g = new PIXI.Graphics();
  g.position.set(-state.camera.x, -state.camera.y);

  for (let x = 0; x < WORLD.w; x += TILE) {
    for (let y = 0; y < WORLD.h; y += TILE) {
      const mixed = (x / TILE + y / TILE) % 3;
      g.rect(x, y, TILE, TILE);
      fill(g, ground[mixed]);
      if ((x / TILE + y / TILE) % 7 === 0) {
        g.rect(x + 8, y + 10, TILE - 18, 3);
        fill(g, "rgba(92, 61, 35, 0.12)");
        g.rect(x + 20, y + 31, TILE - 28, 2);
        fill(g, "rgba(92, 61, 35, 0.12)");
      }
    }
  }
  const pathRects = layout.pathRects || [
    { x: 0, y: 775, w: WORLD.w, h: 180 },
    { x: 1020, y: 0, w: 210, h: WORLD.h },
    { x: 0, y: 1770, w: WORLD.w, h: 170 },
    { x: 2450, y: 0, w: 190, h: WORLD.h },
  ];
  pathRects.forEach((path) => {
    g.rect(path.x, path.y, path.w, path.h);
    fill(g, layout.paths);
  });
  layout.plazas.forEach((plaza) => {
    drawPlazaShape(g, plaza);
    fill(g, plaza.color);
  });
  layout.plazas.forEach((plaza) => {
    drawPlazaShape(g, plaza);
    stroke(g, "rgba(80, 54, 34, 0.24)", 3);
  });
  worldLayer.addChild(g);
}

export function drawHouse(houseObstacle) {
  const houses = assets.images.houses || [];
  const img = houses[houseObstacle.variant % houses.length] || houses[0];
  if (!img) return;
  const layout = getHouseLayout(houseObstacle);
  addSprite(img, 0, 0, img.width, img.height, layout.left - state.camera.x, layout.top - state.camera.y, layout.drawW, layout.drawH);
}

export function drawObject(objectObstacle) {
  const objects = assets.images.objects || [];
  const img = objects[objectObstacle.variant % objects.length] || objects[0];
  if (!img) return;
  const draw = objectObstacle.draw || objectObstacle;
  addSprite(img, 0, 0, img.width, img.height, draw.x - state.camera.x, draw.y - state.camera.y, draw.w, draw.h);
}

export function drawPiles() {
  state.piles.forEach((pile) => {
    if (pile.amount <= 0) return;
    const x = pile.x - state.camera.x;
    const y = pile.y - state.camera.y;
    drawSpriteSheet(assets.images.turnipPiles, 2, 2, pile.variant, x, y + 35, 82, 82);
    addText(String(pile.amount), x, y - 18, {
      fontSize: 13,
      fontWeight: "900",
      fill: 0x080a08,
      alpha: 0.65,
      align: "center",
    });
  });
}

export function drawActor(actor, type) {
  const x = actor.x - state.camera.x;
  const y = actor.y - state.camera.y;
  const walkRow = { down: 0, left: 1, right: 2, up: 3 }[actor.dir] || 0;
  const walkFrame = walkRow * 4 + (actor.walking ? Math.floor(state.elapsed * 8) % 4 : 1);
  const character = getCharacterAssets(actor.characterIndex ?? (type === "player" ? state.playerIndex : 1));
  const actorHeight = type === "player" ? 74 : 70;
  if (actor.throwAnim > 0) {
    const frame = clamp(5 - Math.floor((actor.throwAnim / 0.5) * 6), 0, 5);
    drawActorSpriteFrame(character.throw, 2, 3, frame, x, y + 18, actorHeight, actor.dir === "left");
  } else {
    drawActorSpriteFrame(character.walk, 4, 4, walkFrame, x, y + 18, actorHeight);
  }
  if (actor.hurt > 0) {
    const g = new PIXI.Graphics();
    g.circle(x, y - 18, 38);
    fill(g, "rgba(255, 80, 70, 0.25)");
    worldLayer.addChild(g);
  }
}

export function drawAnimal(animal) {
  const x = animal.x - state.camera.x;
  const y = animal.y - state.camera.y;
  const walkRow = { down: 0, left: 1, right: 2, up: 3 }[animal.dir] || 0;
  const walkFrame = walkRow * 4 + (animal.walking ? Math.floor(state.elapsed * (animal.kind === "cat" ? 11 : 9)) % 4 : 1);
  const img = animal.kind === "cat" ? assets.images.catWalk : assets.images.dogWalk;
  drawActorSpriteFrame(img, 4, 4, walkFrame, x, y + 8, animal.height || 38);
  if (animal.mode === "angry") {
    const g = new PIXI.Graphics();
    g.circle(x, y - 14, animal.kind === "cat" ? 22 : 27);
    fill(g, "rgba(255, 80, 70, 0.22)");
    worldLayer.addChild(g);
  }
}

export function drawJarramplas() {
  const j = state.jarramplas;
  const x = j.x - state.camera.x;
  const y = j.y - state.camera.y;
  const frames = assets.jarramplas[state.jarramplasIndex] || [];
  const img = frames[Math.floor(j.frame) % Math.max(1, frames.length)];
  if (img) {
    addSprite(img, 0, 0, img.width, img.height, x, y - 57, 124, 134, {
      anchorX: 0.5,
      anchorY: 0.5,
      tint: j.flash > 0 ? 0xfff0d0 : undefined,
    });
  } else {
    const fallback = new PIXI.Graphics();
    fallback.rect(x - 34, y - 96, 68, 100);
    fill(fallback, "#123c78");
    worldLayer.addChild(fallback);
  }

  const g = new PIXI.Graphics();
  g.roundRect(x - 58, y - 151, 116, 16, 7);
  fill(g, "rgba(12, 9, 7, 0.76)");
  g.roundRect(x - 55, y - 148, 110, 10, 5);
  fill(g, "rgba(0, 0, 0, 0.36)");
  g.roundRect(x - 55, y - 148, 110 * clamp(state.jarramplasHealth / 100, 0, 1), 10, 5);
  fill(g, "#b81f18");
  g.roundRect(x - 58, y - 151, 116, 16, 7);
  stroke(g, "rgba(255, 226, 162, 0.68)", 2);
  worldLayer.addChild(g);
}

export function drawTurnips() {
  state.turnips.forEach((t) => {
    const x = t.x - state.camera.x;
    const y = t.y - state.camera.y;
    const g = new PIXI.Graphics();
    g.position.set(x, y);
    g.rotation = t.spin;
    g.ellipse(0, 0, 10, 8);
    fill(g, "#fff7df");
    g.rect(-2, -13, 4, 8);
    fill(g, "#5fa65c");
    worldLayer.addChild(g);
  });
}

export function drawFx() {
  state.particles.forEach((p) => {
    const g = new PIXI.Graphics();
    g.alpha = clamp(p.life * 2, 0, 1);
    const size = p.size || 4;
    g.rect(p.x - state.camera.x - size / 2, p.y - state.camera.y - size / 2, size, size);
    fill(g, p.color);
    worldLayer.addChild(g);
  });
  state.impacts.forEach((impact) => {
    const t = 1 - impact.life / impact.duration;
    const x = impact.x - state.camera.x;
    const y = impact.y - state.camera.y;
    const g = new PIXI.Graphics();
    g.alpha = clamp(1 - t, 0, 1);
    g.circle(x, y, 12 + t * 38);
    stroke(g, impact.color, 3);
    for (let i = 0; i < 7; i += 1) {
      const angle = impact.seed + i * ((Math.PI * 2) / 7);
      const radius = 8 + t * 44;
      g.ellipse(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius, 5 * (1 - t), 4 * (1 - t), angle);
      fill(g, "#fff7df");
    }
    worldLayer.addChild(g);
  });
  state.floaters.forEach((f) => {
    addText(f.text, f.x - state.camera.x, f.y - state.camera.y, {
      fontSize: 18,
      fontWeight: "900",
      fill: colorStyle(f.color).color,
      alpha: clamp(f.life, 0, 1),
      stroke: { color: 0x000000, alpha: 0.75, width: 4 },
      align: "center",
    });
  });
}

function addText(text, x, y, options = {}) {
  const label = new PIXI.Text({
    text,
    style: {
      fontFamily: options.fontFamily || "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
      fontSize: options.fontSize || 16,
      fontWeight: options.fontWeight || "700",
      fill: options.fill ?? 0xffffff,
      align: options.align || "left",
      stroke: options.stroke,
    },
  });
  label.alpha = options.alpha ?? 1;
  label.anchor.set(options.align === "center" ? 0.5 : 0, 0.5);
  label.position.set(x, y);
  (options.layer || worldLayer).addChild(label);
  return label;
}

export function drawOverlayButtons() {
  const g = new PIXI.Graphics();
  const showJoystick = state.w <= MOBILE_CONTROL_BREAKPOINT;
  g.rect(0, state.h - 148, state.w, 148);
  fill(g, "rgba(5, 4, 3, 0.2)");

  if (showJoystick) {
    const joy = state.joystick;
    const baseX = joy.active ? joy.x : 78;
    const baseY = joy.active ? joy.y : state.h - 82;
    g.circle(baseX, baseY, 58);
    fill(g, "rgba(14, 10, 8, 0.5)");
    g.circle(baseX, baseY, 58);
    stroke(g, "rgba(255, 226, 162, 0.34)", 3);
    g.circle(baseX, baseY, 36);
    stroke(g, "rgba(255, 226, 162, 0.14)", 2);
    g.circle(baseX + joy.dx * 31, baseY + joy.dy * 31, 24);
    fill(g, joy.active ? "rgba(245, 189, 69, 0.72)" : "rgba(255, 244, 216, 0.58)");
    g.circle(baseX + joy.dx * 31, baseY + joy.dy * 31, 24);
    stroke(g, "rgba(72, 18, 12, 0.6)", 2);
  }

  const buttonX = state.w - 68;
  const buttonY = state.h - 80;
  g.circle(buttonX, buttonY, 49);
  fill(g, "rgba(78, 15, 11, 0.78)");
  g.circle(buttonX, buttonY, 46);
  fill(g, "rgba(184, 31, 24, 0.9)");
  g.circle(buttonX, buttonY, 49);
  stroke(g, "rgba(255, 226, 162, 0.72)", 3);
  g.ellipse(buttonX, buttonY - 12, 17, 12);
  fill(g, "#fff4d8");
  g.rect(buttonX - 3, buttonY - 31, 6, 12);
  fill(g, "#3f8d56");
  overlayLayer.addChild(g);

  addText("NABO", buttonX, buttonY + 17, {
    fontFamily: "Georgia, Times New Roman, serif",
    fontSize: 14,
    fontWeight: "900",
    fill: 0xffe2a2,
    stroke: { color: 0x4a120c, alpha: 0.72, width: 3 },
    align: "center",
    layer: overlayLayer,
  });
}

export function render() {
  if (!app || !resetLayers()) return;
  drawMap();
  drawPiles();
  const houseEntities = state.obstacles
    .filter((obstacle) => obstacle.type === "house")
    .map((obstacle) => ({ kind: "house", ref: obstacle, depth: obstacle.block.y + obstacle.block.h + (obstacle.z || 0) * WORLD.h }));
  const objectEntities = state.obstacles
    .filter((obstacle) => obstacle.type === "object")
    .map((obstacle) => ({ kind: "object", ref: obstacle, depth: (obstacle.block || obstacle).y + (obstacle.block || obstacle).h + (obstacle.z || 0) * WORLD.h }));
  const actorEntities = [state.jarramplas, ...state.people, ...state.bystanders, ...state.animals, state.player]
    .filter(Boolean)
    .map((actor) => ({ kind: state.animals.includes(actor) ? "animal" : "actor", ref: actor, depth: actor.y }));
  [...houseEntities, ...objectEntities, ...actorEntities].sort((a, b) => a.depth - b.depth).forEach((entity) => {
    if (entity.kind === "house") {
      drawHouse(entity.ref);
      return;
    }
    if (entity.kind === "object") {
      drawObject(entity.ref);
      return;
    }
    if (entity.kind === "animal") drawAnimal(entity.ref);
    else if (entity.ref === state.jarramplas) drawJarramplas();
    else drawActor(entity.ref, entity.ref === state.player ? "player" : "person");
  });
  drawTurnips();
  drawFx();
  if (state.mode === "game") drawOverlayButtons();
  app.render();
}
