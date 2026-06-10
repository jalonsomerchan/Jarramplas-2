import { PLAYER_RADIUS, WORLD } from "./constants.js";
import { state } from "./state.js";
import { clamp, rectsIntersect } from "./utils.js";

function pointInPolygon(point, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
    const a = polygon[i];
    const b = polygon[j];
    const crosses = ((a.y > point.y) !== (b.y > point.y))
      && point.x < ((b.x - a.x) * (point.y - a.y)) / (b.y - a.y) + a.x;
    if (crosses) inside = !inside;
  }
  return inside;
}

function distanceToSegmentSquared(point, a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lengthSquared = dx * dx + dy * dy;
  if (!lengthSquared) return (point.x - a.x) ** 2 + (point.y - a.y) ** 2;
  const t = clamp(((point.x - a.x) * dx + (point.y - a.y) * dy) / lengthSquared, 0, 1);
  const nearestX = a.x + t * dx;
  const nearestY = a.y + t * dy;
  return (point.x - nearestX) ** 2 + (point.y - nearestY) ** 2;
}

function polygonBounds(points) {
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  return {
    x: minX,
    y: minY,
    w: Math.max(...xs) - minX,
    h: Math.max(...ys) - minY,
  };
}

function circleIntersectsPolygon(x, y, r, points) {
  const box = { x: x - r, y: y - r, w: r * 2, h: r * 2 };
  if (!rectsIntersect(box, polygonBounds(points))) return false;
  const point = { x, y };
  if (pointInPolygon(point, points)) return true;
  const radiusSquared = r * r;
  return points.some((current, index) => {
    const next = points[(index + 1) % points.length];
    return distanceToSegmentSquared(point, current, next) <= radiusSquared;
  });
}

function circleIntersectsCollision(x, y, r, collision) {
  if (collision?.type === "polygon") return circleIntersectsPolygon(x, y, r, collision.points || []);
  return false;
}

export function circleBlocked(x, y, r) {
  if (x < r || y < r || x > WORLD.w - r || y > WORLD.h - r) return true;
  return state.obstacles.some((obstacle) => circleIntersectsObstacle(x, y, r, obstacle));
}

export function circleIntersectsObstacle(x, y, r, obstacle) {
  if (obstacle.collision && circleIntersectsCollision(x, y, r, obstacle.collision)) return true;
  if (obstacle.collision) return false;
  const box = { x: x - r, y: y - r, w: r * 2, h: r * 2 };
  return rectsIntersect(box, obstacle.block || obstacle);
}

export function getActorCollisionRadius(actor) {
  if (actor === state.jarramplas) return 26;
  if (state.animals.includes(actor)) return actor.radius || 13;
  if (state.people.includes(actor) || state.bystanders.includes(actor)) return 19;
  return PLAYER_RADIUS;
}

export function getSolidActors(excludedActor = null) {
  return [state.player, state.jarramplas, ...state.people, ...state.bystanders, ...state.animals]
    .filter((actor) => actor && actor !== excludedActor);
}

export function circleBlockedByActors(x, y, radius, excludedActor = null) {
  return getSolidActors(excludedActor).some((actor) => {
    const otherRadius = getActorCollisionRadius(actor);
    return Math.hypot(x - actor.x, y - actor.y) < radius + otherRadius;
  });
}

export function actorBlocked(actor, x, y, radius) {
  return circleBlocked(x, y, radius) || circleBlockedByActors(x, y, radius, actor);
}

export function resolveActorCollisions(iterations = 4) {
  for (let pass = 0; pass < iterations; pass += 1) {
    const actors = getSolidActors();
    for (let i = 0; i < actors.length; i += 1) {
      for (let j = i + 1; j < actors.length; j += 1) {
        const a = actors[i];
        const b = actors[j];
        const aRadius = getActorCollisionRadius(a);
        const bRadius = getActorCollisionRadius(b);
        const minDistance = aRadius + bRadius;
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let distance = Math.hypot(dx, dy);

        if (distance >= minDistance) continue;

        if (distance < 0.001) {
          const angle = (i + 1) * 1.7 + (j + 1) * 0.9;
          dx = Math.cos(angle);
          dy = Math.sin(angle);
          distance = 1;
        }

        const nx = dx / distance;
        const ny = dy / distance;
        const overlap = minDistance - distance + 0.75;
        const aShare = a === state.jarramplas ? 0.35 : 0.5;
        const bShare = b === state.jarramplas ? 0.35 : 0.5;
        const aNextX = clamp(a.x - nx * overlap * aShare, aRadius + 4, WORLD.w - aRadius - 4);
        const aNextY = clamp(a.y - ny * overlap * aShare, aRadius + 4, WORLD.h - aRadius - 4);
        const bNextX = clamp(b.x + nx * overlap * bShare, bRadius + 4, WORLD.w - bRadius - 4);
        const bNextY = clamp(b.y + ny * overlap * bShare, bRadius + 4, WORLD.h - bRadius - 4);

        if (!circleBlocked(aNextX, aNextY, aRadius)) {
          a.x = aNextX;
          a.y = aNextY;
        }
        if (!circleBlocked(bNextX, bNextY, bRadius)) {
          b.x = bNextX;
          b.y = bNextY;
        }
      }
    }
  }
}

export function getTurnipBuildingCollision(x, y, radius = 10) {
  return state.obstacles.find((obstacle) => (
    obstacle.type === "house" && circleIntersectsObstacle(x, y, radius, obstacle)
  ));
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
    ...state.animals.map((animal, index) => [`${animal.kind}-${index}`, animal]),
  ].filter(([, actor]) => actor);

  return actors.map(([name, actor]) => ({
    name,
    x: Math.round(actor.x),
    y: Math.round(actor.y),
    blocked: state.obstacles.some((obstacle) => circleIntersectsObstacle(actor.x, actor.y, getActorCollisionRadius(actor), obstacle)),
  }));
}

export function moveActor(actor, dx, dy, dt, radius = PLAYER_RADIUS) {
  const len = Math.hypot(dx, dy);
  if (!len) {
    actor.walking = false;
    return { moved: false, dx: 0, dy: 0 };
  }
  const nx = dx / len;
  const ny = dy / len;
  const stepX = nx * actor.speed * dt;
  const stepY = ny * actor.speed * dt;
  const nextX = actor.x + stepX;
  const nextY = actor.y + stepY;
  const beforeX = actor.x;
  const beforeY = actor.y;
  if (!actorBlocked(actor, nextX, actor.y, radius)) actor.x = nextX;
  if (!actorBlocked(actor, actor.x, nextY, radius)) actor.y = nextY;
  const movedX = actor.x - beforeX;
  const movedY = actor.y - beforeY;
  const movedDistance = Math.hypot(movedX, movedY);
  actor.walking = movedDistance > 0.25;
  if (actor.walking) {
    actor.dir = Math.abs(movedX) > Math.abs(movedY)
      ? (movedX > 0 ? "right" : "left")
      : (movedY > 0 ? "down" : "up");
  }
  return { moved: actor.walking, dx: movedX, dy: movedY };
}
