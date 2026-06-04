import { difficultyConfig } from "../config.js";
import { keys, WORLD } from "./constants.js";
import { addFloater } from "./effects.js";
import {
  collectPiles,
  damagePlayer,
  endGame,
  updateBystanders,
  updateJarramplas,
  updatePeople,
  updateTurnips,
} from "./actors.js";
import { moveActor, resolveActorCollisions } from "./physics.js";
import { state } from "./state.js";
import { updateHud } from "./ui.js";
import { clamp, dist } from "./utils.js";

function updatePlayer(dt) {
  const p = state.player;
  p.walking = false;
  p.hurt = Math.max(0, p.hurt - dt);
  p.throwAnim = Math.max(0, p.throwAnim - dt);

  let dx = 0;
  let dy = 0;
  if (keys.has("arrowleft") || keys.has("a")) dx -= 1;
  if (keys.has("arrowright") || keys.has("d")) dx += 1;
  if (keys.has("arrowup") || keys.has("w")) dy -= 1;
  if (keys.has("arrowdown") || keys.has("s")) dy += 1;
  if (state.joystick.active) {
    dx += state.joystick.dx;
    dy += state.joystick.dy;
  }

  moveActor(p, dx, dy, dt);
  collectPiles();
}

export function updateRuntime(dt) {
  state.elapsed += dt;
  if (state.gameType === "timed") state.timeLeft -= dt;

  updatePlayer(dt);
  updateJarramplas(dt);
  updatePeople(dt);
  updateBystanders(dt);
  resolveActorCollisions();
  updateTurnips(dt);

  state.floaters.forEach((f) => {
    f.y -= dt * 46;
    f.life -= dt;
  });
  state.floaters = state.floaters.filter((f) => f.life > 0);

  state.particles.forEach((p) => {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 180 * dt;
    p.life -= dt;
  });
  state.particles = state.particles.filter((p) => p.life > 0);

  state.impacts.forEach((impact) => {
    impact.life -= dt;
  });
  state.impacts = state.impacts.filter((impact) => impact.life > 0);

  state.touchCooldown = Math.max(0, state.touchCooldown - dt);
  if (state.touchCooldown <= 0 && dist(state.player, state.jarramplas) < 58) {
    state.touchCooldown = 1.05;
    damagePlayer(12, state.player.x, state.player.y - 70, "-12 vida");
    addFloater("¡Jarramplas!", state.jarramplas.x, state.jarramplas.y - 110, "#ff7369");
  }

  state.camera.x = clamp(state.player.x - state.w * 0.5, 0, WORLD.w - state.w);
  state.camera.y = clamp(state.player.y - state.h * 0.55, 0, WORLD.h - state.h);

  updateHud();
  if (state.life <= 0) endGame("Te han echado de la plaza");
  if (state.gameType === "timed" && state.timeLeft <= 0) endGame("Se acabó el tiempo");
  if (state.gameType === "limitedTurnips" && state.turnipsLeft <= 0 && !state.turnips.some((t) => t.owner === "player")) endGame("No quedan nabos");
  if (state.gameType === "survival" && state.jarramplasHealth <= 0) endGame("Jarramplas no aguanta más");
  if (state.gameType === "eviction" && state.peopleHits >= (difficultyConfig[state.difficulty]?.maxPeopleHits || 3)) endGame("Tres avisos y a casa");
}
