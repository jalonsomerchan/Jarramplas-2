import { PLAYER_RADIUS, WORLD } from "./constants.js";
import { state } from "./state.js";
import { clamp, rectsIntersect } from "./utils.js";

export function circleBlocked(x, y, r) {
  if (x < r || y < r || x > WORLD.w - r || y > WORLD.h - r) return true;
  const box = { x: x - r, y: y - r, w: r * 2, h: r * 2 };
  return state.obstacles.some((obstacle) => rectsIntersect(box, obstacle.block || obstacle));
}

export function circleIntersectsObstacle(x, y, r, obstacle) {
  const box = { x: x - r, y: y - r, w: r * 2, h: r * 2 };
  return rectsIntersect(box, obstacle.block || obstacle);
}

export function findFreeSpawn(x, y, radius = PLAYER_RADIUS) {
  if (!circleBlocked(x, y, radius)) return { x, y };
  const step = 56;
  for (let ring = 1; ring <= 12; ring += 1) {
    for (let dx = -ring; dx <= ring; dx += 1) {
      for (let dy = -ring; dy <= ring; dy += 1) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== ring) continue;
        const candidateX = clamp(x + dx * step, radius + 4, WORLD.w - radius - 4);
        const candidateY = clamp(y + dy * step, radius + 4, WORLD.h - radius - 4);
        if (!circleBlocked(candidateX, candidateY, radius)) return { x: candidateX, y: candidateY };
      }
    }
  }
  return { x: WORLD.w / 2, y: WORLD.h / 2 };
}

export function getSpawnCollisionReport() {
  const actors = [
    ["player", state.player],
    ["jarramplas", state.jarramplas],
    ...state.people.map((person, index) => [`neighbor-${index}`, person]),
  ].filter(([, actor]) => actor);

  return actors.map(([name, actor]) => ({
    name,
    x: Math.round(actor.x),
    y: Math.round(actor.y),
    blocked: state.obstacles.some((obstacle) => circleIntersectsObstacle(actor.x, actor.y, PLAYER_RADIUS, obstacle)),
  }));
}

export function moveActor(actor, dx, dy, dt, radius = PLAYER_RADIUS) {
  const len = Math.hypot(dx, dy);
  if (!len) return;
  const nx = dx / len;
  const ny = dy / len;
  const stepX = nx * actor.speed * dt;
  const stepY = ny * actor.speed * dt;
  const nextX = actor.x + stepX;
  const nextY = actor.y + stepY;
  if (!circleBlocked(nextX, actor.y, radius)) actor.x = nextX;
  if (!circleBlocked(actor.x, nextY, radius)) actor.y = nextY;
  actor.dir = Math.abs(nx) > Math.abs(ny) ? (nx > 0 ? "right" : "left") : (ny > 0 ? "down" : "up");
  actor.walking = true;
}
