import {
  APP_VERSION,
  difficultyConfig,
  gameTypeConfig,
  jarramplasVariants,
  scenarios,
} from "./config.js";
import {
  formatNumber,
  formatPercent,
  getLocalLeaderboard,
  getPlayerName,
  getRecord,
  getStats,
  hasSeenTutorial,
  markTutorialSeen,
  recordGameFinishStats,
  recordGameStartStats,
  saveLocalLeaderboardScore,
  savePlayerName,
  saveRecord,
} from "./storage.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const hud = document.getElementById("hud");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const comboEl = document.getElementById("combo");
const recordEl = document.getElementById("record");
const loadingScreen = document.getElementById("loading");
const loadingBar = document.getElementById("loadingBar");
const playButton = document.getElementById("playButton");
const playerNameInput = document.getElementById("playerNameInput");
const jarramplasCountdownEl = document.getElementById("jarramplasCountdown");
const gameVersionEl = document.getElementById("gameVersion");
const scenarioOptions = document.getElementById("scenarioOptions");
const jarramplasOptions = document.getElementById("jarramplasOptions");
const statsGrid = document.getElementById("statsGrid");
const statsDetails = document.getElementById("statsDetails");
const statsLeaderboardStatus = document.getElementById("statsLeaderboardStatus");
const statsLeaderboard = document.getElementById("statsLeaderboard");
const statsLeaderboardType = document.getElementById("statsLeaderboardType");
const statsLeaderboardDifficulty = document.getElementById("statsLeaderboardDifficulty");

const screens = {
  start: document.getElementById("start"),
  challenge: document.getElementById("challenge"),
  type: document.getElementById("type"),
  select: document.getElementById("select"),
  scenario: document.getElementById("scenario"),
  jarramplasSelect: document.getElementById("jarramplasSelect"),
  tutorial: document.getElementById("tutorial"),
  stats: document.getElementById("stats"),
  about: document.getElementById("about"),
  pause: document.getElementById("pause"),
  result: document.getElementById("result"),
};

const DPR = Math.min(window.devicePixelRatio || 1, 2);
const TILE = 48;
const WORLD = { w: 3200, h: 2400 };
const PLAYER_RADIUS = 20;
const TURNIP_SPEED = 720;
const CROWD_TURNIP_SPEED = 360;
const PLAYER_MAX_TURNIPS = 14;
const MOBILE_CONTROL_BREAKPOINT = 760;
const keys = new Set();
const HOUSE_SHEET_COLS = 3;
const HOUSE_SHEET_ROWS = 2;
const HOUSE_BOUNDS = [
  { l: 47 / 384, t: 31 / 384, r: 337 / 384, b: 352 / 384 },
  { l: 41 / 384, t: 41 / 384, r: 342 / 384, b: 342 / 384 },
  { l: 102 / 384, t: 43 / 384, r: 282 / 384, b: 340 / 384 },
  { l: 24 / 384, t: 56 / 384, r: 359 / 384, b: 327 / 384 },
  { l: 32 / 384, t: 53 / 384, r: 351 / 384, b: 331 / 384 },
  { l: 15 / 384, t: 70 / 384, r: 368 / 384, b: 314 / 384 },
];

const assets = {
  loaded: 0,
  total: 0,
  images: {},
  jarramplas: [],
  backgrounds: [],
};

const state = {
  mode: "loading",
  gameType: "timed",
  difficulty: "day19Morning",
  scenarioIndex: 0,
  jarramplasIndex: 0,
  tutorialNextScreen: "type",
  activeChallenge: null,
  w: 0,
  h: 0,
  camera: { x: 0, y: 0 },
  player: null,
  jarramplas: null,
  people: [],
  piles: [],
  turnips: [],
  impacts: [],
  floaters: [],
  particles: [],
  obstacles: [],
  joystick: { active: false, pointerId: null, x: 0, y: 0, dx: 0, dy: 0 },
  score: 0,
  combo: 1,
  comboHits: 0,
  life: 100,
  timeLeft: 60,
  turnipsLeft: PLAYER_MAX_TURNIPS,
  jarramplasHealth: 100,
  throws: 0,
  hits: 0,
  peopleHits: 0,
  elapsed: 0,
  last: 0,
  startedAt: 0,
  ended: false,
  touchCooldown: 0,
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function dist(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function loadImage(src) {
  assets.total += 1;
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      assets.loaded += 1;
      updateLoading();
      resolve(img);
    };
    img.onerror = () => {
      assets.loaded += 1;
      updateLoading();
      resolve(null);
    };
    img.src = src;
  });
}

function updateLoading() {
  const pct = assets.total ? (assets.loaded / assets.total) * 100 : 100;
  if (loadingBar) loadingBar.style.width = `${pct}%`;
}

function showScreen(name) {
  Object.entries(screens).forEach(([screenName, el]) => {
    el?.classList.toggle("is-visible", screenName === name);
  });
  hud?.classList.toggle("is-visible", name === "game");
  state.mode = name;
}

function resize() {
  const rect = canvas.getBoundingClientRect();
  state.w = Math.max(1, Math.floor(rect.width));
  state.h = Math.max(1, Math.floor(rect.height));
  canvas.width = Math.floor(state.w * DPR);
  canvas.height = Math.floor(state.h * DPR);
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  ctx.imageSmoothingEnabled = false;
}

function screenToWorld(x, y) {
  return { x: x + state.camera.x, y: y + state.camera.y };
}

function seeded(seed) {
  let value = seed || 1234567;
  return () => {
    value = (value + 0x6D2B79F5) | 0;
    let t = Math.imul(value ^ (value >>> 15), 1 | value);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function rectsIntersect(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function circleBlocked(x, y, r) {
  if (x < r || y < r || x > WORLD.w - r || y > WORLD.h - r) return true;
  const box = { x: x - r, y: y - r, w: r * 2, h: r * 2 };
  return state.obstacles.some((obstacle) => rectsIntersect(box, obstacle.block || obstacle));
}

function moveActor(actor, dx, dy, dt, radius = PLAYER_RADIUS) {
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

function damagePlayer(amount, x, y, label = null) {
  if (!state.player) return;
  const damage = Math.max(0, amount);
  state.life -= damage;
  state.peopleHits += 1;
  state.comboHits = 0;
  state.player.hurt = 0.25;
  addFloater(label || `-${damage} vida`, x ?? state.player.x, y ?? state.player.y - 70, "#ff7369");
  burst(x ?? state.player.x, y ?? state.player.y, "#ff7369");
}

function getHouseBounds(variant) {
  return HOUSE_BOUNDS[variant % HOUSE_BOUNDS.length] || HOUSE_BOUNDS[0];
}

function getHouseLayout(houseObstacle) {
  const bounds = getHouseBounds(houseObstacle.variant || 0);
  const visibleW = bounds.r - bounds.l;
  const visibleH = bounds.b - bounds.t;
  const drawW = houseObstacle.w * (houseObstacle.scale || 1);
  const drawH = drawW * (visibleH / visibleW);
  const centerX = houseObstacle.x + houseObstacle.w / 2;
  const bottomY = houseObstacle.y + houseObstacle.h + 18;
  const left = centerX - drawW / 2;
  const top = bottomY - drawH;
  return { bounds, left, top, bottomY, drawW, drawH };
}

function getHouseBlock(houseObstacle) {
  const layout = getHouseLayout(houseObstacle);
  return {
    x: layout.left + layout.drawW * 0.06,
    y: layout.top + layout.drawH * 0.1,
    w: layout.drawW * 0.88,
    h: layout.drawH * 0.8,
  };
}

function house(x, y, w, h, variant, scale = 1.12) {
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

function createVillage(seedValue = 1) {
  const rand = seeded(seedValue);
  const obstacles = [
    house(55, 70, 430, 245, 0, 1.04),
    house(555, 88, 500, 270, 1, 1.05),
    house(1140, 82, 360, 245, 2, 1.0),
    house(1620, 90, 470, 270, 3, 1.02),
    house(2050, 132, 350, 230, 4, 0.95),
    house(85, 1035, 420, 265, 2, 1.0),
    house(555, 1230, 500, 285, 1, 1.05),
    house(1060, 1280, 520, 280, 3, 1.04),
    house(1580, 1205, 500, 285, 0, 1.06),
    house(2030, 1175, 365, 245, 4, 0.98),
    house(230, 1505, 390, 230, 4, 0.94),
    house(1320, 1535, 500, 245, 1, 1.0),
    house(2450, 115, 460, 260, 0, 1.02),
    house(2685, 490, 390, 245, 2, 0.98),
    house(2380, 875, 500, 285, 3, 1.04),
    house(2480, 1505, 470, 270, 1, 1.02),
    house(1880, 1755, 520, 285, 0, 1.04),
    house(1260, 1905, 470, 270, 4, 1.0),
    house(620, 1900, 500, 285, 3, 1.03),
    house(95, 1985, 430, 250, 2, 0.98),
    house(2760, 1930, 350, 245, 4, 0.94),
    { x: 0, y: 0, w: WORLD.w, h: 36, type: "wall" },
    { x: 0, y: WORLD.h - 36, w: WORLD.w, h: 36, type: "wall" },
    { x: 0, y: 0, w: 36, h: WORLD.h, type: "wall" },
    { x: WORLD.w - 36, y: 0, w: 36, h: WORLD.h, type: "wall" },
  ];
  for (let i = 0; i < 76; i += 1) {
    const x = 90 + rand() * (WORLD.w - 180);
    const y = 380 + rand() * (WORLD.h - 610);
    if (Math.abs(x - 1110) < 520 && Math.abs(y - 860) < 360) continue;
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

function spawnPeople(count) {
  const starts = [
    [520, 530], [880, 1030], [1280, 780], [1540, 1080],
    [1980, 620], [430, 1020], [1050, 430], [1810, 1010],
    [720, 1510], [1430, 1460], [2090, 1120], [220, 850],
    [2600, 860], [2850, 1420], [2220, 1760], [980, 1960],
  ];
  state.people = starts.slice(0, count).map(([x, y], index) => ({
    x, y, speed: 70 + index * 3, dir: "down", walking: false,
    cooldown: 1.2 + index * 0.42, throwAnim: 0, wander: 0, vx: 0, vy: 0,
  }));
}

function startGame() {
  const difficulty = difficultyConfig[state.difficulty] || difficultyConfig.day19Morning;
  const gameType = gameTypeConfig[state.gameType] || gameTypeConfig.timed;
  createVillage((state.scenarioIndex + 1) * 97 + (state.jarramplasIndex + 3) * 131);
  state.player = { x: 1120, y: 1020, speed: 180, dir: "down", walking: false, throwAnim: 0, hurt: 0 };
  state.jarramplas = { x: 1150, y: 730, speed: 86 * difficulty.speed, dir: "down", walking: false, targetX: 1450, targetY: 850, frame: 0, flash: 0 };
  spawnPeople(difficulty.people);
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

function endGame(reason) {
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

function throwTurnip(from, target, owner) {
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

function playerThrow() {
  if (state.mode !== "game" || state.player.throwAnim > 0 || state.turnipsLeft <= 0) return;
  const target = state.jarramplas;
  state.player.throwAnim = 0.42;
  state.turnipsLeft -= 1;
  state.throws += 1;
  throwTurnip(state.player, target, "player");
}

function addFloater(text, x, y, color = "#fff6df") {
  state.floaters.push({ text, x, y, color, life: 0.85 });
}

function burst(x, y, color) {
  for (let i = 0; i < 14; i += 1) {
    const a = Math.random() * Math.PI * 2;
    const s = 60 + Math.random() * 150;
    state.particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 0.35 + Math.random() * 0.25, color });
  }
}

function createTurnipImpact(x, y, color = "#f2bb3d") {
  state.impacts.push({ x, y, color, life: 0.42, duration: 0.42, seed: Math.random() * Math.PI * 2 });
  for (let i = 0; i < 22; i += 1) {
    const a = Math.random() * Math.PI * 2;
    const s = 95 + Math.random() * 210;
    const chunkColor = i % 3 === 0 ? "#fff7df" : (i % 3 === 1 ? "#78b95e" : color);
    state.particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 0.35 + Math.random() * 0.28, color: chunkColor, size: 3 + Math.random() * 4 });
  }
}

function collectPiles() {
  state.piles.forEach((pile) => {
    if (pile.amount <= 0 || dist(state.player, pile) > 64 || state.turnipsLeft >= PLAYER_MAX_TURNIPS) return;
    const take = Math.min(PLAYER_MAX_TURNIPS - state.turnipsLeft, pile.amount, 4);
    pile.amount -= take;
    state.turnipsLeft += take;
    addFloater(`+${take} nabos`, pile.x, pile.y - 42, "#d8f28a");
  });
}

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

function updateJarramplas(dt) {
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

function updatePeople(dt) {
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

function updateTurnips(dt) {
  state.turnips.forEach((t) => {
    t.x += t.vx * dt;
    t.y += t.vy * dt;
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

function updateRuntime(dt) {
  state.elapsed += dt;
  if (state.gameType === "timed") state.timeLeft -= dt;
  updatePlayer(dt);
  updateJarramplas(dt);
  updatePeople(dt);
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

function updateHud() {
  scoreEl.textContent = `${formatNumber(state.score)} pts`;
  timeEl.textContent = state.gameType === "timed" ? `${Math.max(0, Math.ceil(state.timeLeft))} s` : `${Math.ceil(state.life)} vida`;
  comboEl.textContent = `${state.turnipsLeft} nabos`;
  recordEl.textContent = `Récord ${formatNumber(getRecord(state.gameType, state.difficulty))}`;
}

function drawSpriteSheet(img, rows, cols, frame, x, y, w, h, flip = false) {
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

function drawMap() {
  const ox = -state.camera.x;
  const oy = -state.camera.y;
  ctx.fillStyle = "#9f7b52";
  ctx.fillRect(0, 0, state.w, state.h);
  ctx.save();
  ctx.translate(ox, oy);
  for (let x = 0; x < WORLD.w; x += TILE) {
    for (let y = 0; y < WORLD.h; y += TILE) {
      const mixed = (x / TILE + y / TILE) % 3;
      ctx.fillStyle = mixed === 0 ? "#a8845a" : (mixed === 1 ? "#967249" : "#ad8a60");
      ctx.fillRect(x, y, TILE, TILE);
      if ((x / TILE + y / TILE) % 7 === 0) {
        ctx.fillStyle = "rgba(92, 61, 35, 0.12)";
        ctx.fillRect(x + 8, y + 10, TILE - 18, 3);
        ctx.fillRect(x + 20, y + 31, TILE - 28, 2);
      }
    }
  }
  ctx.fillStyle = "#b8925f";
  ctx.fillRect(0, 775, WORLD.w, 180);
  ctx.fillRect(1020, 0, 210, WORLD.h);
  ctx.fillRect(0, 1770, WORLD.w, 170);
  ctx.fillRect(2450, 0, 190, WORLD.h);
  ctx.fillStyle = "#9f764a";
  ctx.fillRect(820, 570, 760, 560);
  ctx.fillRect(2140, 650, 700, 500);
  ctx.fillRect(560, 1710, 780, 480);
  ctx.strokeStyle = "rgba(80, 54, 34, 0.24)";
  ctx.lineWidth = 3;
  ctx.strokeRect(820, 570, 760, 560);
  ctx.strokeRect(2140, 650, 700, 500);
  ctx.strokeRect(560, 1710, 780, 480);
  state.obstacles.forEach((o) => {
    if (o.type === "wall") return;
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

function drawHouse(houseObstacle) {
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

function drawPiles() {
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

function drawActor(actor, type) {
  const x = actor.x - state.camera.x;
  const y = actor.y - state.camera.y;
  const walkRow = { down: 0, left: 1, right: 2, up: 3 }[actor.dir] || 0;
  const walkFrame = walkRow * 4 + (actor.walking ? Math.floor(state.elapsed * 8) % 4 : 1);
  if (actor.throwAnim > 0) {
    const frame = clamp(5 - Math.floor((actor.throwAnim / 0.5) * 6), 0, 5);
    drawSpriteSheet(type === "player" ? assets.images.playerThrow : assets.images.villagerThrow, 2, 3, frame, x, y + 18, 96, 96, actor.dir === "left");
  } else if (type === "player") {
    drawSpriteSheet(assets.images.playerWalk, 4, 4, walkFrame, x, y + 18, 82, 82);
  } else {
    drawSpriteSheet(assets.images.villagerThrow, 2, 3, 5, x, y + 18, 84, 84, actor.dir === "left");
  }
  if (actor.hurt > 0) {
    ctx.fillStyle = "rgba(255, 80, 70, 0.25)";
    ctx.beginPath();
    ctx.arc(x, y - 18, 38, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawJarramplas() {
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

function drawTurnips() {
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

function drawFx() {
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

function drawOverlayButtons() {
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

function render() {
  ctx.clearRect(0, 0, state.w, state.h);
  drawMap();
  drawPiles();
  const houseEntities = state.obstacles
    .filter((obstacle) => obstacle.type === "house")
    .map((obstacle) => ({ kind: "house", ref: obstacle, depth: obstacle.block.y + obstacle.block.h }));
  const actorEntities = [state.jarramplas, ...state.people, state.player]
    .filter(Boolean)
    .map((actor) => ({ kind: "actor", ref: actor, depth: actor.y }));
  [...houseEntities, ...actorEntities].sort((a, b) => a.depth - b.depth).forEach((entity) => {
    if (entity.kind === "house") {
      drawHouse(entity.ref);
      return;
    }
    if (entity.ref === state.jarramplas) drawJarramplas();
    else drawActor(entity.ref, entity.ref === state.player ? "player" : "person");
  });
  drawTurnips();
  drawFx();
  if (state.mode === "game") drawOverlayButtons();
}

function loop(now) {
  const dt = Math.min(0.033, Math.max(0, (now - state.last) / 1000 || 0));
  state.last = now;
  if (state.mode === "game" && !state.ended) updateRuntime(dt);
  render();
  requestAnimationFrame(loop);
}

function populateScenarioOptions() {
  scenarioOptions.innerHTML = scenarios.map((scenario, index) => (
    `<button type="button" data-scenario="${index}">${scenario.name}<span>Pueblo abierto</span></button>`
  )).join("");
  jarramplasOptions.innerHTML = jarramplasVariants.map((variant, index) => (
    `<button type="button" data-jarramplas="${index}">${variant.name.replace(" HD", "")}<span>Animado</span></button>`
  )).join("");
}

function populateStatsFilters() {
  if (!statsLeaderboardType || !statsLeaderboardDifficulty) return;
  statsLeaderboardType.innerHTML = Object.entries(gameTypeConfig).map(([key, item]) => `<option value="${key}">${item.label}</option>`).join("");
  statsLeaderboardDifficulty.innerHTML = Object.entries(difficultyConfig).map(([key, item]) => `<option value="${key}">${item.label}</option>`).join("");
}

function renderStats() {
  const stats = getStats();
  statsGrid.innerHTML = `
    <div><strong>${formatNumber(stats.gamesStarted)}</strong><span>Partidas jugadas</span></div>
    <div><strong>${formatNumber(stats.bestScore)}</strong><span>Mejor puntuación</span></div>
    <div><strong>${formatPercent(stats.turnipsHit, stats.turnipsThrown)}</strong><span>Precisión</span></div>
    <div><strong>${formatNumber(stats.peopleHits)}</strong><span>Golpes recibidos</span></div>
  `;
  statsDetails.innerHTML = "";
  const type = statsLeaderboardType?.value || "timed";
  const difficulty = statsLeaderboardDifficulty?.value || "day19Morning";
  const entries = getLocalLeaderboard(type, difficulty);
  statsLeaderboardStatus.textContent = entries.length ? "Ranking local" : "Aún no hay partidas guardadas para este modo.";
  statsLeaderboard.innerHTML = entries.map((entry) => `<li><span>${entry.playerName}</span><strong>${formatNumber(entry.score)} pts</strong></li>`).join("");
}

function parseChallenge() {
  const params = new URLSearchParams(window.location.search);
  const type = params.get("challenge");
  const level = params.get("level");
  if (!type || !difficultyConfig[level]) return null;
  return {
    type,
    difficulty: level,
    target: Number(params.get("target") || 0),
    name: String(params.get("usuario") || "Un amigo").slice(0, 24),
  };
}

function renderChallenge(challenge) {
  state.activeChallenge = challenge;
  document.getElementById("challengeTitle").textContent = "Reto abierto";
  document.getElementById("challengeSubtitle").textContent = `${challenge.name} te ha retado`;
  document.getElementById("challengeGoal").textContent = `Objetivo: ${formatNumber(challenge.target)}${challenge.type === "precision" ? "% precisión" : " pts"}`;
  document.getElementById("challengeDescription").textContent = "Acepta el reto y juega con la misma dificultad en el pueblo de Piornal.";
  document.getElementById("challengeDetails").innerHTML = `<div><span>Nivel</span><strong>${difficultyConfig[challenge.difficulty].label}</strong></div>`;
  showScreen("challenge");
}

function updateCountdown() {
  const now = new Date();
  const year = now.getMonth() === 0 && now.getDate() <= 20 ? now.getFullYear() : now.getFullYear() + 1;
  const target = new Date(year, 0, 20, 0, 0, 0);
  const ms = Math.max(0, target - now);
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms / 3600000) % 24);
  const minutes = Math.floor((ms / 60000) % 60);
  const seconds = Math.floor((ms / 1000) % 60);
  jarramplasCountdownEl.textContent = `${days} días · ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

async function loadAssets() {
  const generated = {
    playerWalk: "assets/generated/player_walk/sheet.png",
    playerThrow: "assets/generated/player_throw/sheet.png",
    villagerThrow: "assets/generated/villager_throw/sheet.png",
    turnipPiles: "assets/generated/turnip_piles/sheet.png",
    houses: "assets/generated/houses/sheet.png",
  };
  const imageEntries = await Promise.all(Object.entries(generated).map(async ([key, path]) => [key, await loadImage(path)]));
  assets.images = Object.fromEntries(imageEntries);
  assets.jarramplas = await Promise.all(jarramplasVariants.map((variant) => Promise.all(variant.frames.map(loadImage))));
  assets.backgrounds = await Promise.all(scenarios.map((scenario) => loadImage(scenario.path)));
}

function bindUi() {
  gameVersionEl.textContent = `v.${APP_VERSION}`;
  playerNameInput.value = getPlayerName();
  playerNameInput.addEventListener("change", () => savePlayerName(playerNameInput.value));
  playButton.addEventListener("click", () => {
    savePlayerName(playerNameInput.value);
    state.tutorialNextScreen = "type";
    showScreen(hasSeenTutorial() ? "type" : "tutorial");
  });
  document.getElementById("tutorialButton").addEventListener("click", () => {
    markTutorialSeen();
    showScreen(state.tutorialNextScreen);
  });
  document.getElementById("howToButton").addEventListener("click", () => {
    state.tutorialNextScreen = "start";
    showScreen("tutorial");
  });
  document.getElementById("aboutButton").addEventListener("click", () => showScreen("about"));
  document.getElementById("aboutBackButton").addEventListener("click", () => showScreen("start"));
  document.getElementById("statsButton").addEventListener("click", () => {
    renderStats();
    showScreen("stats");
  });
  document.getElementById("statsBackButton").addEventListener("click", () => showScreen("start"));
  document.getElementById("shareButton").addEventListener("click", async () => {
    const shareData = { title: "Jarramplas", text: "Juega a Jarramplas en Piornal", url: location.href };
    if (navigator.share) await navigator.share(shareData).catch(() => {});
  });
  document.querySelectorAll("[data-game-type]").forEach((button) => {
    button.addEventListener("click", () => {
      state.gameType = button.dataset.gameType;
      showScreen("select");
    });
  });
  document.querySelectorAll("[data-level]").forEach((button) => {
    button.addEventListener("click", () => {
      state.difficulty = button.dataset.level;
      state.scenarioIndex = 0;
      state.jarramplasIndex = 0;
      startGame();
    });
  });
  scenarioOptions.addEventListener("click", (event) => {
    const button = event.target.closest("[data-scenario]");
    if (!button) return;
    state.scenarioIndex = Number(button.dataset.scenario);
    showScreen("jarramplasSelect");
  });
  jarramplasOptions.addEventListener("click", (event) => {
    const button = event.target.closest("[data-jarramplas]");
    if (!button) return;
    state.jarramplasIndex = Number(button.dataset.jarramplas);
    startGame();
  });
  document.getElementById("typeBackButton").addEventListener("click", () => showScreen("start"));
  document.getElementById("backButton").addEventListener("click", () => showScreen("type"));
  document.getElementById("levelBackButton").addEventListener("click", () => showScreen("select"));
  document.getElementById("jarramplasBackButton").addEventListener("click", () => showScreen("select"));
  document.getElementById("pauseButton").addEventListener("click", () => showScreen("pause"));
  document.getElementById("resumeButton").addEventListener("click", () => {
    state.last = performance.now();
    showScreen("game");
  });
  document.getElementById("restartButton").addEventListener("click", startGame);
  document.getElementById("homeButton").addEventListener("click", () => showScreen("start"));
  document.getElementById("resultHomeButton")?.addEventListener("click", () => showScreen("start"));
  document.getElementById("playAgainButton")?.addEventListener("click", startGame);
  document.getElementById("acceptChallengeButton").addEventListener("click", () => {
    if (state.activeChallenge) state.difficulty = state.activeChallenge.difficulty;
    state.gameType = "timed";
    state.scenarioIndex = 0;
    state.jarramplasIndex = 0;
    startGame();
  });
  document.getElementById("skipChallengeButton").addEventListener("click", () => showScreen("start"));
  statsLeaderboardType?.addEventListener("change", renderStats);
  statsLeaderboardDifficulty?.addEventListener("change", renderStats);
}

function bindInput() {
  window.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    keys.add(key);
    if (key === " " || key === "enter") {
      event.preventDefault();
      playerThrow();
    }
    if (key === "escape" && state.mode === "game") showScreen("pause");
  });
  window.addEventListener("keyup", (event) => keys.delete(event.key.toLowerCase()));
  canvas.addEventListener("pointerdown", (event) => {
    if (state.mode !== "game") return;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if (x > state.w - 126 && y > state.h - 140) {
      playerThrow();
      return;
    }
    if (state.w <= MOBILE_CONTROL_BREAKPOINT && x < 160 && y > state.h - 170) {
      state.joystick = { active: true, pointerId: event.pointerId, x, y, dx: 0, dy: 0 };
      canvas.setPointerCapture?.(event.pointerId);
    }
  });
  canvas.addEventListener("pointermove", (event) => {
    if (state.mode !== "game" || event.buttons !== 1) return;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if (state.joystick.active && state.joystick.pointerId === event.pointerId) {
      const dx = x - state.joystick.x;
      const dy = y - state.joystick.y;
      const len = Math.hypot(dx, dy);
      const max = 54;
      state.joystick.dx = len ? clamp(dx / max, -1, 1) : 0;
      state.joystick.dy = len ? clamp(dy / max, -1, 1) : 0;
      if (len > max) {
        state.joystick.dx = dx / len;
        state.joystick.dy = dy / len;
      }
      return;
    }
  });
  canvas.addEventListener("pointerup", (event) => {
    if (state.joystick.active && state.joystick.pointerId === event.pointerId) {
      state.joystick = { active: false, pointerId: null, x: 0, y: 0, dx: 0, dy: 0 };
    }
  });
  canvas.addEventListener("pointercancel", (event) => {
    if (state.joystick.active && state.joystick.pointerId === event.pointerId) {
      state.joystick = { active: false, pointerId: null, x: 0, y: 0, dx: 0, dy: 0 };
    }
  });
}

async function init() {
  resize();
  bindUi();
  bindInput();
  populateScenarioOptions();
  populateStatsFilters();
  updateCountdown();
  setInterval(updateCountdown, 1000);
  await loadAssets();
  loadingScreen?.classList.remove("is-visible");
  const challenge = parseChallenge();
  if (challenge) renderChallenge(challenge);
  else showScreen("start");
  state.last = performance.now();
  requestAnimationFrame(loop);
}

window.addEventListener("resize", resize);
init();
