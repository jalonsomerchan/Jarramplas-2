import { scenarios } from "../config.js";
import {
  FOUNTAIN_SHEET_COLS,
  HOUSE_SHEET_COLS,
  HOUSE_SHEET_ROWS,
  MOBILE_CONTROL_BREAKPOINT,
  TILE,
  WORLD,
} from "./constants.js";
import { ctx } from "./dom.js";
import { scenarioLayouts } from "./scenario-layouts.js";
import { assets, state } from "./state.js";
import { clamp } from "./utils.js";
import { getHouseLayout } from "./world.js";

export function drawSpriteSheet(img, rows, cols, frame, x, y, w, h, flip = false) {
  if (!img) return false;
  const sourceW = img.width / cols;
  const sourceH = img.height / rows;
  const sx = (frame % cols) * sourceW;
  const sy = Math.floor(frame / cols) * sourceH;
  ctx.save();
  if (flip) {
    ctx.scale(-1, 1);
    ctx.drawImage(img, sx, sy, sourceW, sourceH, -x - w / 2, y - h, w, h);
  } else {
    ctx.drawImage(img, sx, sy, sourceW, sourceH, x - w / 2, y - h, w, h);
  }
  ctx.restore();
  return true;
}

export function getCharacterAssets(index) {
  return assets.images.playerCharacters?.[index] || assets.images.playerCharacters?.[0] || {
    walk: assets.images.playerWalk,
    throw: assets.images.playerThrow,
  };
}

export function drawMap() {
  const ox = -state.camera.x;
  const oy = -state.camera.y;
  const scenario = scenarios[state.scenarioIndex] || scenarios[0];
  const layout = scenarioLayouts[scenario.id] || scenarioLayouts["plaza-eras"];
  const ground = layout.ground;
  ctx.fillStyle = ground[1];
  ctx.fillRect(0, 0, state.w, state.h);
  ctx.save();
  ctx.translate(ox, oy);
  for (let x = 0; x < WORLD.w; x += TILE) {
    for (let y = 0; y < WORLD.h; y += TILE) {
      const mixed = (x / TILE + y / TILE) % 3;
      ctx.fillStyle = ground[mixed];
      ctx.fillRect(x, y, TILE, TILE);
      if ((x / TILE + y / TILE) % 7 === 0) {
        ctx.fillStyle = "rgba(92, 61, 35, 0.12)";
        ctx.fillRect(x + 8, y + 10, TILE - 18, 3);
        ctx.fillRect(x + 20, y + 31, TILE - 28, 2);
      }
    }
  }
  const pathRects = layout.pathRects || [
    { x: 0, y: 775, w: WORLD.w, h: 180 },
    { x: 1020, y: 0, w: 210, h: WORLD.h },
    { x: 0, y: 1770, w: WORLD.w, h: 170 },
    { x: 2450, y: 0, w: 190, h: WORLD.h },
  ];
  ctx.fillStyle = layout.paths;
  pathRects.forEach((path) => {
    ctx.fillRect(path.x, path.y, path.w, path.h);
  });
  function drawPlazaShape(plaza, stroke = false) {
    if (plaza.shape === "ellipse") {
      ctx.beginPath();
      ctx.ellipse(plaza.x + plaza.w / 2, plaza.y + plaza.h / 2, plaza.w / 2, plaza.h / 2, plaza.rotation || 0, 0, Math.PI * 2);
      if (stroke) ctx.stroke();
      else ctx.fill();
      return;
    }
    if (stroke) ctx.strokeRect(plaza.x, plaza.y, plaza.w, plaza.h);
    else ctx.fillRect(plaza.x, plaza.y, plaza.w, plaza.h);
  }
  layout.plazas.forEach((plaza) => {
    ctx.fillStyle = plaza.color;
    drawPlazaShape(plaza);
  });
  ctx.strokeStyle = "rgba(80, 54, 34, 0.24)";
  ctx.lineWidth = 3;
  layout.plazas.forEach((plaza) => {
    drawPlazaShape(plaza, true);
  });
  state.obstacles.forEach((o) => {
    if (o.type === "wall" || o.type === "fountain") return;
    if (o.type === "tree") {
      const cx = o.x + o.w / 2;
      const baseY = o.y + o.h;
      const crownY = o.y + o.h * 0.38;
      const tones = [
        ["#245f3b", "#34794c", "#5f9b50"],
        ["#2c6c42", "#3f8750", "#6fa85b"],
        ["#365f35", "#4c7f40", "#7a9b4d"],
      ][o.tone || 0];
      ctx.fillStyle = "rgba(63, 43, 25, 0.28)";
      ctx.beginPath();
      ctx.ellipse(cx, baseY - 4, o.w * 0.48, o.h * 0.16, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#5a351d";
      ctx.fillRect(cx - o.w * 0.11, o.y + o.h * 0.5, o.w * 0.22, o.h * 0.46);
      ctx.fillStyle = "#754722";
      ctx.fillRect(cx - o.w * 0.04, o.y + o.h * 0.52, o.w * 0.08, o.h * 0.42);
      ctx.fillStyle = tones[0];
      ctx.beginPath();
      ctx.ellipse(cx, crownY, o.w * 0.52, o.h * 0.36, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = tones[1];
      ctx.beginPath();
      ctx.arc(cx - o.w * 0.24, crownY + o.h * 0.04, o.w * 0.28, 0, Math.PI * 2);
      ctx.arc(cx + o.w * 0.24, crownY + o.h * 0.02, o.w * 0.3, 0, Math.PI * 2);
      ctx.arc(cx, crownY - o.h * 0.18, o.w * 0.34, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = tones[2];
      ctx.beginPath();
      ctx.arc(cx - o.w * 0.12, crownY - o.h * 0.18, o.w * 0.13, 0, Math.PI * 2);
      ctx.arc(cx + o.w * 0.2, crownY - o.h * 0.05, o.w * 0.11, 0, Math.PI * 2);
      ctx.fill();
      return;
    }
  });
  ctx.restore();
}

export function drawFountain(fountainObstacle) {
  const img = assets.images.fountains;
  if (!img) return;
  const sourceW = img.width / FOUNTAIN_SHEET_COLS;
  const sx = (fountainObstacle.variant % FOUNTAIN_SHEET_COLS) * sourceW;
  const x = fountainObstacle.x - state.camera.x;
  const y = fountainObstacle.y - state.camera.y;
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(
    img,
    sx,
    0,
    sourceW,
    img.height,
    x - fountainObstacle.w / 2,
    y - fountainObstacle.h,
    fountainObstacle.w,
    fountainObstacle.h,
  );
  ctx.imageSmoothingEnabled = false;
}

export function drawHouse(houseObstacle) {
  const img = assets.images.houses;
  if (!img) return;
  const variant = houseObstacle.variant || 0;
  const layout = getHouseLayout(houseObstacle);
  const sourceW = img.width / HOUSE_SHEET_COLS;
  const sourceH = img.height / HOUSE_SHEET_ROWS;
  const bounds = layout.bounds;
  const sx = (variant % HOUSE_SHEET_COLS) * sourceW + bounds.l * sourceW;
  const sy = Math.floor(variant / HOUSE_SHEET_COLS) * sourceH + bounds.t * sourceH;
  const sw = (bounds.r - bounds.l) * sourceW;
  const sh = (bounds.b - bounds.t) * sourceH;
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(
    img,
    sx,
    sy,
    sw,
    sh,
    layout.left - state.camera.x,
    layout.top - state.camera.y,
    layout.drawW,
    layout.drawH,
  );
  ctx.imageSmoothingEnabled = false;
}

export function drawPiles() {
  state.piles.forEach((pile) => {
    if (pile.amount <= 0) return;
    const x = pile.x - state.camera.x;
    const y = pile.y - state.camera.y;
    drawSpriteSheet(assets.images.turnipPiles, 2, 2, pile.variant, x, y + 35, 82, 82);
    ctx.fillStyle = "rgba(8, 10, 8, 0.65)";
    ctx.font = "900 13px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(String(pile.amount), x, y - 18);
  });
}

export function drawActor(actor, type) {
  const x = actor.x - state.camera.x;
  const y = actor.y - state.camera.y;
  const walkRow = { down: 0, left: 1, right: 2, up: 3 }[actor.dir] || 0;
  const walkFrame = walkRow * 4 + (actor.walking ? Math.floor(state.elapsed * 8) % 4 : 1);
  const character = getCharacterAssets(actor.characterIndex ?? (type === "player" ? state.playerIndex : 1));
  const actorSize = type === "player" ? 96 : 88;
  const walkSize = type === "player" ? 82 : 80;
  if (actor.throwAnim > 0) {
    const frame = clamp(5 - Math.floor((actor.throwAnim / 0.5) * 6), 0, 5);
    drawSpriteSheet(character.throw, 2, 3, frame, x, y + 18, actorSize, actorSize, actor.dir === "left");
  } else {
    drawSpriteSheet(character.walk, 4, 4, walkFrame, x, y + 18, walkSize, walkSize);
  }
  if (actor.hurt > 0) {
    ctx.fillStyle = "rgba(255, 80, 70, 0.25)";
    ctx.beginPath();
    ctx.arc(x, y - 18, 38, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function drawJarramplas() {
  const j = state.jarramplas;
  const x = j.x - state.camera.x;
  const y = j.y - state.camera.y;
  const frames = assets.jarramplas[state.jarramplasIndex] || [];
  const img = frames[Math.floor(j.frame) % Math.max(1, frames.length)];
  ctx.save();
  if (j.flash > 0) ctx.filter = "brightness(1.8) saturate(1.4)";
  if (img) ctx.drawImage(img, x - 62, y - 124, 124, 134);
  else {
    ctx.fillStyle = "#123c78";
    ctx.fillRect(x - 34, y - 96, 68, 100);
  }
  ctx.restore();
  ctx.fillStyle = "#2b2118";
  ctx.fillRect(x - 54, y - 144, 108, 9);
  ctx.fillStyle = "#d93c2f";
  ctx.fillRect(x - 54, y - 144, 108 * clamp(state.jarramplasHealth / 100, 0, 1), 9);
}

export function drawTurnips() {
  state.turnips.forEach((t) => {
    const x = t.x - state.camera.x;
    const y = t.y - state.camera.y;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(t.spin);
    ctx.fillStyle = "#fff7df";
    ctx.beginPath();
    ctx.ellipse(0, 0, 10, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#5fa65c";
    ctx.fillRect(-2, -13, 4, 8);
    ctx.restore();
  });
}

export function drawFx() {
  state.particles.forEach((p) => {
    ctx.globalAlpha = clamp(p.life * 2, 0, 1);
    ctx.fillStyle = p.color;
    const size = p.size || 4;
    ctx.fillRect(p.x - state.camera.x - size / 2, p.y - state.camera.y - size / 2, size, size);
    ctx.globalAlpha = 1;
  });
  state.impacts.forEach((impact) => {
    const t = 1 - impact.life / impact.duration;
    const x = impact.x - state.camera.x;
    const y = impact.y - state.camera.y;
    ctx.save();
    ctx.globalAlpha = clamp(1 - t, 0, 1);
    ctx.strokeStyle = impact.color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, 12 + t * 38, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#fff7df";
    for (let i = 0; i < 7; i += 1) {
      const angle = impact.seed + i * ((Math.PI * 2) / 7);
      const radius = 8 + t * 44;
      ctx.beginPath();
      ctx.ellipse(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius, 5 * (1 - t), 4 * (1 - t), angle, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  });
  state.floaters.forEach((f) => {
    ctx.globalAlpha = clamp(f.life, 0, 1);
    ctx.fillStyle = f.color;
    ctx.font = "900 18px system-ui";
    ctx.textAlign = "center";
    ctx.strokeStyle = "rgba(0,0,0,.75)";
    ctx.lineWidth = 4;
    ctx.strokeText(f.text, f.x - state.camera.x, f.y - state.camera.y);
    ctx.fillText(f.text, f.x - state.camera.x, f.y - state.camera.y);
    ctx.globalAlpha = 1;
  });
}

export function drawOverlayButtons() {
  const showJoystick = state.w <= MOBILE_CONTROL_BREAKPOINT;
  if (showJoystick) {
    const joy = state.joystick;
    const baseX = joy.active ? joy.x : 78;
    const baseY = joy.active ? joy.y : state.h - 82;
    ctx.fillStyle = "rgba(8, 11, 11, 0.44)";
    ctx.strokeStyle = "rgba(255,255,255,.2)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(baseX, baseY, 54, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "rgba(255,246,223,.55)";
    ctx.beginPath();
    ctx.arc(baseX + joy.dx * 30, baseY + joy.dy * 30, 22, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "rgba(8, 11, 11, 0.62)";
  ctx.strokeStyle = "rgba(255,255,255,.24)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(state.w - 66, state.h - 78, 42, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#fff6df";
  ctx.font = "900 16px system-ui";
  ctx.textAlign = "center";
  ctx.fillText("NABO", state.w - 66, state.h - 72);
}

export function render() {
  ctx.clearRect(0, 0, state.w, state.h);
  drawMap();
  drawPiles();
  const houseEntities = state.obstacles
    .filter((obstacle) => obstacle.type === "house")
    .map((obstacle) => ({ kind: "house", ref: obstacle, depth: obstacle.block.y + obstacle.block.h }));
  const fountainEntities = state.obstacles
    .filter((obstacle) => obstacle.type === "fountain")
    .map((obstacle) => ({ kind: "fountain", ref: obstacle, depth: obstacle.y }));
  const actorEntities = [state.jarramplas, ...state.people, ...state.bystanders, state.player]
    .filter(Boolean)
    .map((actor) => ({ kind: "actor", ref: actor, depth: actor.y }));
  [...houseEntities, ...fountainEntities, ...actorEntities].sort((a, b) => a.depth - b.depth).forEach((entity) => {
    if (entity.kind === "house") {
      drawHouse(entity.ref);
      return;
    }
    if (entity.kind === "fountain") {
      drawFountain(entity.ref);
      return;
    }
    if (entity.ref === state.jarramplas) drawJarramplas();
    else drawActor(entity.ref, entity.ref === state.player ? "player" : "person");
  });
  drawTurnips();
  drawFx();
  if (state.mode === "game") drawOverlayButtons();
}
