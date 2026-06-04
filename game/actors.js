import {
  difficultyConfig,
  gameTypeConfig,
  jarramplasVariants,
  playerVariants,
  scenarios,
} from "../config.js";
import {
  formatNumber,
  getPlayerName,
  recordGameFinishStats,
  recordGameStartStats,
  saveLocalLeaderboardScore,
  saveRecord,
} from "../storage.js";
import {
  CROWD_TURNIP_SPEED,
  PLAYER_MAX_TURNIPS,
  PLAYER_RADIUS,
  TURNIP_SPEED,
  VILLAGER_THROW_TYPE_COUNT,
  WORLD,
} from "./constants.js";
import { addFloater, burst, createTurnipImpact } from "./effects.js";
import {
  circleIntersectsObstacle,
  findFreeSpawn,
  getTurnipBuildingCollision,
  moveActor,
  resolveActorCollisions,
} from "./physics.js";
import { state } from "./state.js";
import { showScreen, updateHud } from "./ui.js";
import { dist } from "./utils.js";
import { createVillage } from "./world.js";
import { scenarioLayouts } from "./scenario-layouts.js";

export function damagePlayer(amount, x, y, label = null) {
  if (!state.player) return;
  const damage = Math.max(0, amount);
  state.life -= damage;
  state.peopleHits += 1;
  state.comboHits = 0;
  state.player.hurt = 0.25;
  addFloater(label || `-${damage} vida`, x ?? state.player.x, y ?? state.player.y - 70, "#ff7369");
  burst(x ?? state.player.x, y ?? state.player.y, "#ff7369");
}


const BYSTANDER_STARTS = [
  [300, 430], [700, 470], [990, 1240], [1360, 1280], [1700, 470], [2160, 470],
  [2600, 520], [2920, 760], [2920, 1150], [2660, 1660], [2350, 2020], [1880, 2100],
  [1380, 2040], [720, 2140], [360, 1760], [260, 1280], [620, 980], [1160, 560],
  [1600, 1560], [2060, 1360], [2480, 1120], [1040, 1580], [520, 2040], [2880, 1900],
];

function getNeighborCharacterIndexes() {
  return playerVariants
    .map((_, characterIndex) => characterIndex)
    .filter((characterIndex) => characterIndex !== state.playerIndex);
}

function createPersonActor(x, y, index, characterIndexes, options = {}) {
  const spawn = findFreeSpawn(x, y, PLAYER_RADIUS);
  return {
    x: spawn.x,
    y: spawn.y,
    homeX: spawn.x,
    homeY: spawn.y,
    speed: options.speed ?? (70 + index * 3),
    dir: options.dir || "down",
    walking: false,
    cooldown: options.cooldown ?? (1.2 + index * 0.42),
    throwAnim: 0,
    wander: options.wander ?? 0,
    lookTime: options.lookTime ?? 0,
    mode: options.mode || "crowd",
    vx: 0,
    vy: 0,
    variant: index % VILLAGER_THROW_TYPE_COUNT,
    characterIndex: characterIndexes[index % characterIndexes.length] ?? 1,
  };
}

export function spawnBystanders(count = 24) {
  const characterIndexes = getNeighborCharacterIndexes();
  state.bystanders = BYSTANDER_STARTS.slice(0, count).map(([x, y], index) => createPersonActor(x, y, index, characterIndexes, {
    speed: 34 + (index % 5) * 4,
    cooldown: Number.POSITIVE_INFINITY,
    wander: 0.3 + (index % 7) * 0.2,
    lookTime: 0.8 + (index % 5) * 0.4,
    mode: index % 3 === 0 ? "watch" : "stroll",
  }));
}

export function spawnPeople(count) {
  const starts = [
    [520, 530], [880, 1030], [1280, 780], [1540, 1080],
    [1980, 620], [430, 1020], [1050, 430], [1810, 1010],
    [720, 1510], [1430, 1460], [2090, 1120], [220, 850],
    [2600, 860], [2850, 1420], [2220, 1760], [980, 1960],
  ];
  const characterIndexes = getNeighborCharacterIndexes();
  state.people = starts.slice(0, count).map(([x, y], index) => createPersonActor(x, y, index, characterIndexes));
}

export function startGame() {
  const difficulty = difficultyConfig[state.difficulty] || difficultyConfig.day19Morning;
  const gameType = gameTypeConfig[state.gameType] || gameTypeConfig.timed;
  createVillage((state.scenarioIndex + 1) * 97 + (state.jarramplasIndex + 3) * 131);
  const scenario = scenarios[state.scenarioIndex] || scenarios[0];
  const layout = scenarioLayouts[scenario.id] || scenarioLayouts["plaza-eras"];
  const [playerX, playerY] = layout.spawn.player;
  const [jarramplasX, jarramplasY] = layout.spawn.jarramplas;
  const [targetX, targetY] = layout.spawn.target;
  const playerSpawn = findFreeSpawn(playerX, playerY, PLAYER_RADIUS);
  const jarramplasSpawn = findFreeSpawn(jarramplasX, jarramplasY, PLAYER_RADIUS);
  state.player = { x: playerSpawn.x, y: playerSpawn.y, speed: 180, dir: "down", walking: false, throwAnim: 0, hurt: 0, characterIndex: state.playerIndex };
  state.jarramplas = { x: jarramplasSpawn.x, y: jarramplasSpawn.y, speed: 86 * difficulty.speed, dir: "down", walking: false, targetX, targetY, frame: 0, flash: 0 };
  spawnPeople(difficulty.people);
  spawnBystanders();
  state.turnips = [];
  state.impacts = [];
  state.floaters = [];
  state.particles = [];
  state.score = 0;
  state.combo = 1;
  state.comboHits = 0;
  state.life = 100;
  state.timeLeft = gameType.duration || 90;
  state.turnipsLeft = gameType.turnips || PLAYER_MAX_TURNIPS;
  state.jarramplasHealth = gameType.health || 100;
  state.throws = 0;
  state.hits = 0;
  state.peopleHits = 0;
  state.elapsed = 0;
  state.last = performance.now();
  state.startedAt = Date.now();
  state.ended = false;
  state.touchCooldown = 0;
  state.joystick = { active: false, pointerId: null, x: 0, y: 0, dx: 0, dy: 0 };
  recordGameStartStats(state.gameType, state.difficulty);
  updateHud();
  showScreen("game");
}

export function endGame(reason) {
  if (state.ended) return;
  state.ended = true;
  const accuracy = state.throws ? Math.round((state.hits / state.throws) * 100) : 0;
  const best = saveRecord(state.gameType, state.difficulty, state.score);
  saveLocalLeaderboardScore({
    playerName: getPlayerName(),
    score: state.score,
    gameType: state.gameType,
    difficulty: state.difficulty,
    accuracy,
    jarramplasHits: state.hits,
    peopleHits: state.peopleHits,
    createdAt: Date.now(),
  });
  recordGameFinishStats({
    score: state.score,
    gameType: state.gameType,
    difficulty: state.difficulty,
    scenario: scenarios[state.scenarioIndex]?.name || "Piornal",
    elapsed: state.elapsed,
    turnipsThrown: state.throws,
    turnipsHit: state.hits,
    peopleHits: state.peopleHits,
  });
  document.getElementById("finalHeadline").textContent = reason || "Partida finalizada";
  document.getElementById("finalMode").textContent = `${gameTypeConfig[state.gameType]?.label || "Partida"} · ${difficultyConfig[state.difficulty]?.label || "Nivel"}`;
  document.getElementById("finalScore").textContent = `${formatNumber(state.score)} pts`;
  document.getElementById("finalRecord").textContent = `Récord: ${formatNumber(best)}`;
  document.getElementById("finalSummary").textContent = `${state.hits} impactos a Jarramplas · ${accuracy}% precisión · ${Math.max(0, Math.round(state.life))} vida`;
  document.getElementById("finalScenarioName").textContent = scenarios[state.scenarioIndex]?.name || "Piornal";
  document.getElementById("finalJarramplasName").textContent = jarramplasVariants[state.jarramplasIndex]?.name || "Jarramplas";
  document.getElementById("finalHighlights").innerHTML = `
    <div><strong>${formatNumber(state.throws)}</strong><span>Nabos lanzados</span></div>
    <div><strong>${formatNumber(state.peopleHits)}</strong><span>Golpes recibidos</span></div>
    <div><strong>x${state.combo}</strong><span>Mejor racha</span></div>
  `;
  document.getElementById("finalBreakdown").innerHTML = "";
  showScreen("result");
}

export function throwTurnip(from, target, owner) {
  const angle = Math.atan2(target.y - from.y, target.x - from.x);
  const speed = owner === "player" ? TURNIP_SPEED : CROWD_TURNIP_SPEED;
  state.turnips.push({
    x: from.x,
    y: from.y - 24,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    owner,
    life: owner === "player" ? 0.75 : 2.2,
    spin: 0,
  });
}

export function playerThrow() {
  if (state.mode !== "game" || state.player.throwAnim > 0 || state.turnipsLeft <= 0) return;
  const target = state.jarramplas;
  state.player.throwAnim = 0.42;
  state.turnipsLeft -= 1;
  state.throws += 1;
  throwTurnip(state.player, target, "player");
}

export function collectPiles() {
  state.piles.forEach((pile) => {
    if (pile.amount <= 0 || dist(state.player, pile) > 64 || state.turnipsLeft >= PLAYER_MAX_TURNIPS) return;
    const take = Math.min(PLAYER_MAX_TURNIPS - state.turnipsLeft, pile.amount, 4);
    pile.amount -= take;
    state.turnipsLeft += take;
    addFloater(`+${take} nabos`, pile.x, pile.y - 42, "#d8f28a");
  });
}

export function updatePlayer(dt) {
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

export function updateJarramplas(dt) {
  const j = state.jarramplas;
  j.walking = false;
  j.flash = Math.max(0, j.flash - dt);
  if (dist(j, { x: j.targetX, y: j.targetY }) < 35 || Math.random() < 0.01) {
    j.targetX = 250 + Math.random() * (WORLD.w - 500);
    j.targetY = 430 + Math.random() * (WORLD.h - 780);
  }
  moveActor(j, j.targetX - j.x, j.targetY - j.y, dt, 26);
  j.frame += dt * 8;
}

export function updatePeople(dt) {
  const difficulty = difficultyConfig[state.difficulty] || difficultyConfig.day19Morning;
  state.people.forEach((person) => {
    person.walking = false;
    person.throwAnim = Math.max(0, person.throwAnim - dt);
    person.cooldown -= dt;
    person.wander -= dt;
    if (person.wander <= 0) {
      person.wander = 1 + Math.random() * 2.5;
      const angle = Math.random() * Math.PI * 2;
      person.vx = Math.cos(angle);
      person.vy = Math.sin(angle);
    }
    if (dist(person, state.jarramplas) > 170) moveActor(person, state.jarramplas.x - person.x, state.jarramplas.y - person.y, dt, 19);
    else moveActor(person, person.vx, person.vy, dt, 19);
    if (person.cooldown <= 0 && dist(person, state.player) < 620) {
      person.cooldown = difficulty.crowdThrow * 1.85 + Math.random() * 2.1;
      person.throwAnim = 0.5;
      throwTurnip(person, state.jarramplas, "crowd");
    }
  });
}

export function updateBystanders(dt) {
  state.bystanders.forEach((person, index) => {
    person.walking = false;
    person.throwAnim = 0;
    person.wander -= dt;
    person.lookTime -= dt;

    if (person.mode === "watch") {
      if (state.jarramplas) {
        const dx = state.jarramplas.x - person.x;
        const dy = state.jarramplas.y - person.y;
        person.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up");
      }
      if (person.lookTime <= 0) {
        person.mode = "stroll";
        person.wander = 1.2 + Math.random() * 2.4;
      }
      return;
    }

    if (person.wander <= 0) {
      person.wander = 1.4 + Math.random() * 3.2;
      person.lookTime = 1.0 + Math.random() * 2.4;
      person.mode = Math.random() < 0.45 ? "watch" : "stroll";
      const angle = Math.random() * Math.PI * 2;
      person.vx = Math.cos(angle);
      person.vy = Math.sin(angle);
    }

    const distanceHome = dist(person, { x: person.homeX, y: person.homeY });
    if (distanceHome > 170) {
      moveActor(person, person.homeX - person.x, person.homeY - person.y, dt, 19);
    } else {
      const plazaDrift = index % 4 === 0 && state.jarramplas ? 0.18 : 0;
      const dx = person.vx + (state.jarramplas ? Math.sign(state.jarramplas.x - person.x) * plazaDrift : 0);
      const dy = person.vy + (state.jarramplas ? Math.sign(state.jarramplas.y - person.y) * plazaDrift : 0);
      moveActor(person, dx, dy, dt, 19);
    }
  });
}

export function updateTurnips(dt) {
  state.turnips.forEach((t) => {
    const nextX = t.x + t.vx * dt;
    const nextY = t.y + t.vy * dt;
    const hitX = getTurnipBuildingCollision(nextX, t.y);
    const hitY = getTurnipBuildingCollision(t.x, nextY);

    if (hitX) t.vx *= -0.78;
    else t.x = nextX;

    if (hitY) t.vy *= -0.78;
    else t.y = nextY;

    if (!hitX && !hitY && getTurnipBuildingCollision(nextX, nextY)) {
      t.vx *= -0.78;
      t.vy *= -0.78;
      t.life -= 0.08;
    } else if (hitX || hitY) {
      t.life -= 0.08;
    }

    t.spin += dt * 12;
    t.life -= dt;
    if (t.owner === "player" && dist(t, state.jarramplas) < 48) {
      t.life = 0;
      state.hits += 1;
      state.comboHits += 1;
      state.combo = Math.max(state.combo, Math.min(9, 1 + Math.floor(state.comboHits / 3)));
      const points = 10 * Math.min(9, 1 + Math.floor(state.comboHits / 3));
      state.score += points;
      state.jarramplasHealth -= 5;
      state.jarramplas.flash = 0.18;
      addFloater(`+${points}`, state.jarramplas.x, state.jarramplas.y - 90, "#f2bb3d");
      createTurnipImpact(t.x, t.y, "#f2bb3d");
    } else if (t.owner === "player") {
      const hitPerson = state.people.find((person) => dist(t, person) < 34);
      if (hitPerson) {
        t.life = 0;
        damagePlayer(10, hitPerson.x, hitPerson.y - 42, "-10 vida");
        addFloater("¡Cuidado!", hitPerson.x, hitPerson.y - 82, "#fff6df");
      }
    } else if ((t.owner === "crowd" || t.owner === "crowdBounce") && dist(t, state.player) < 32) {
      t.life = 0;
      damagePlayer(t.owner === "crowdBounce" ? 7 : 8, state.player.x, state.player.y - 70);
    } else if (t.owner === "crowd" && dist(t, state.jarramplas) < 44) {
      const angle = Math.atan2(state.player.y - state.jarramplas.y, state.player.x - state.jarramplas.x) + (Math.random() - 0.5) * 0.9;
      t.owner = "crowdBounce";
      t.x = state.jarramplas.x;
      t.y = state.jarramplas.y - 30;
      t.vx = Math.cos(angle) * (CROWD_TURNIP_SPEED * 0.72);
      t.vy = Math.sin(angle) * (CROWD_TURNIP_SPEED * 0.72);
      t.life = 1.15;
      createTurnipImpact(t.x, t.y, "#efe1c1");
    }
  });
  state.turnips = state.turnips.filter((t) => t.life > 0 && t.x > 0 && t.y > 0 && t.x < WORLD.w && t.y < WORLD.h);
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
  if (state.gameType === "eviction" && state.peopleHits >= 3) endGame("Tres avisos y a casa");
}
