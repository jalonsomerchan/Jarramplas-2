export const APP_VERSION = "2.2.0";

export const difficultyConfig = {
  day18Evening: { label: "18 por la tarde", shareLabel: "18 de Enero por la tarde", meta: "Sin gente", people: 0, crowdThrow: 1.8, speed: 0.8 },
  day19Morning: { label: "19 por la mañana", shareLabel: "19 de Enero por la mañana", meta: "Fácil", people: 4, crowdThrow: 1.45, speed: 0.86 },
  day19Evening: { label: "19 por la tarde", shareLabel: "19 de Enero por la tarde", meta: "Medio", people: 6, crowdThrow: 1.12, speed: 1 },
  day20Morning: { label: "20 por la mañana", shareLabel: "20 de Enero por la mañana", meta: "Difícil", people: 9, crowdThrow: 0.84, speed: 1.16 },
  day20Evening: { label: "20 por la tarde", shareLabel: "20 de Enero por la tarde", meta: "Extremo", people: 12, crowdThrow: 0.62, speed: 1.32 },
};

export const gameTypeConfig = {
  timed: { label: "Por tiempo", shortLabel: "60 segundos", duration: 60 },
  survival: { label: "Hasta que Jarramplas aguante", shortLabel: "Por Vida", health: 100 },
  limitedTurnips: { label: "Hasta que me quede sin nabos", shortLabel: "Tienes 20 nabos", turnips: 20 },
  eviction: { label: "Hasta que me echen", shortLabel: "3 avisos", maxPeopleHits: 3, requiresPeople: true },
};

export const jarramplasMovementConfig = {
  minYRatio: 0.12,
  maxYRatio: 0.25,
};

export const impactEffectConfig = {
  particleCount: 18,
  sparkColors: ["#fff6df", "#f2bb3d", "#efe1c1", "#5eb356"],
  playerBurstColor: "#f2bb3d",
  crowdBurstColor: "#efe1c1",
  duration: 0.46,
};

export const shareTextConfig = {
  gameTitle: "Juego de Jarramplas",
  gameShareText: "Juega al Juego de Jarramplas",
  resultTemplate: "He conseguido {points} puntos en el nivel {level} del tipo {type} del Juego de Jarramplas",
};

export const scenarios = [
  {
    id: "plaza-eras",
    name: "Plaza de las Eras",
    path: "assets/fondos/fondo2.png",
    meta: "Fuente alta",
  },
  {
    id: "puerta-iglesia",
    name: "Puerta de la Iglesia",
    path: "assets/fondos/iglesia2.png",
    meta: "Piedra y sombra",
  },
  {
    id: "plaza-ayuntamiento",
    name: "Plaza del Ayuntamiento",
    path: "assets/fondos/ayuntamiento.png",
    meta: "Plaza abierta",
  },
];

export const defaultCharacterAttributes = {
  speed: 180,
  throwForce: 1,
  maxTurnips: 14,
  life: 100,
  throwCooldown: 0.42,
  damageTaken: 1,
  crowdSpeedScale: 0.42,
};

export const playerVariants = [
  {
    id: "piornalo",
    name: "Piornalo",
    meta: "Jugador original",
    attributes: { speed: 180, throwForce: 1, maxTurnips: 14, life: 100, throwCooldown: 0.42, damageTaken: 1, crowdSpeedScale: 0.42 },
    walk: "assets/generated/player_walk/sheet.png",
    throw: "assets/generated/player_throw/sheet.png",
    preview: "assets/generated/player_walk/preview.png",
  },
  {
    id: "piornala",
    name: "Piornala",
    meta: "Vecina equilibrada",
    attributes: { speed: 192, throwForce: 0.95, maxTurnips: 13, life: 95, throwCooldown: 0.38, damageTaken: 1, crowdSpeedScale: 0.42 },
    walk: "assets/generated/characters/piornala_walk/sheet-transparent.png",
    throw: "assets/generated/characters/piornala_throw/sheet-transparent.png",
    preview: "assets/generated/characters/piornala_walk/down-1.png",
  },
  {
    id: "nino",
    name: "Niño",
    meta: "Muy ágil, menos resistente",
    attributes: { speed: 225, throwForce: 0.84, maxTurnips: 10, life: 80, throwCooldown: 0.34, damageTaken: 1.18, crowdSpeedScale: 0.45 },
    walk: "assets/generated/characters/nino_walk/sheet-transparent.png",
    throw: "assets/generated/characters/nino_throw/sheet-transparent.png",
    preview: "assets/generated/characters/nino_walk/down-1.png",
  },
  {
    id: "senor-mayor",
    name: "Señor Mayor",
    meta: "Veterano, lento y fuerte",
    attributes: { speed: 145, throwForce: 1.16, maxTurnips: 18, life: 125, throwCooldown: 0.52, damageTaken: 0.82, crowdSpeedScale: 0.38 },
    walk: "assets/generated/characters/senor_mayor_walk/sheet-transparent.png",
    throw: "assets/generated/characters/senor_mayor_throw/sheet-transparent.png",
    preview: "assets/generated/characters/senor_mayor_walk/down-1.png",
  },
  {
    id: "borracho",
    name: "Borracho",
    meta: "Lanzamiento potente",
    attributes: { speed: 165, throwForce: 1.3, maxTurnips: 16, life: 110, throwCooldown: 0.58, damageTaken: 0.92, crowdSpeedScale: 0.4 },
    walk: "assets/generated/characters/borracho_walk/sheet-transparent.png",
    throw: "assets/generated/characters/borracho_throw/sheet-transparent.png",
    preview: "assets/generated/characters/borracho_walk/down-1.png",
  },
  {
    id: "cura",
    name: "Cura",
    meta: "Sereno y resistente",
    attributes: { speed: 160, throwForce: 1.05, maxTurnips: 15, life: 115, throwCooldown: 0.48, damageTaken: 0.9, crowdSpeedScale: 0.4 },
    walk: "assets/generated/characters/cura_walk/sheet-transparent.png",
    throw: "assets/generated/characters/cura_throw/sheet-transparent.png",
    preview: "assets/generated/characters/cura_walk/down-1.png",
  },
  {
    id: "agricultor",
    name: "Agricultor",
    meta: "Fuerte y constante",
    attributes: { speed: 170, throwForce: 1.18, maxTurnips: 17, life: 115, throwCooldown: 0.5, damageTaken: 0.9, crowdSpeedScale: 0.4 },
    walk: "assets/generated/characters/agricultor_walk/sheet-transparent.png",
    throw: "assets/generated/characters/agricultor_throw/sheet-transparent.png",
    preview: "assets/generated/characters/agricultor_walk/down-1.png",
  },
  {
    id: "ama-de-casa",
    name: "Ama de casa",
    meta: "Equilibrada y precisa",
    attributes: { speed: 188, throwForce: 1, maxTurnips: 14, life: 100, throwCooldown: 0.4, damageTaken: 1, crowdSpeedScale: 0.42 },
    walk: "assets/generated/characters/ama_de_casa_walk/sheet-transparent.png",
    throw: "assets/generated/characters/ama_de_casa_throw/sheet-transparent.png",
    preview: "assets/generated/characters/ama_de_casa_walk/down-1.png",
  },
  {
    id: "deportista",
    name: "Mujer deportista",
    meta: "Rápida y ligera",
    attributes: { speed: 220, throwForce: 0.9, maxTurnips: 12, life: 90, throwCooldown: 0.34, damageTaken: 1.08, crowdSpeedScale: 0.45 },
    walk: "assets/generated/characters/deportista_walk/sheet-transparent.png",
    throw: "assets/generated/characters/deportista_throw/sheet-transparent.png",
    preview: "assets/generated/characters/deportista_walk/down-1.png",
  },
  {
    id: "traje-tacones",
    name: "Traje y tacones",
    meta: "Elegante y técnica",
    attributes: { speed: 182, throwForce: 1.02, maxTurnips: 13, life: 95, throwCooldown: 0.39, damageTaken: 1, crowdSpeedScale: 0.42 },
    walk: "assets/generated/characters/traje_tacones_walk/sheet-transparent.png",
    throw: "assets/generated/characters/traje_tacones_throw/sheet-transparent.png",
    preview: "assets/generated/characters/traje_tacones_walk/down-1.png",
  },
];

export function getCharacterAttributes(index) {
  return {
    ...defaultCharacterAttributes,
    ...(playerVariants[index]?.attributes || {}),
  };
}

export const STORAGE_KEYS = {
  records: "jarramplas.records.v1",
  stats: "jarramplas.stats.v1",
  tutorial: "jarramplas.tutorialSeen.v2",
  leaderboard: "jarramplas.leaderboard.v1",
  playerName: "jarramplas.playerName.v1",
};

const makeJarramplasFramePaths = (root, frameCount) => Array.from(
  { length: frameCount },
  (_, index) => `${root}/frame_${String(index + 1).padStart(3, "0")}.png`
);

const jarramplasDirections = ["down", "left", "right", "up"];
const makeJarramplasDirectionalFramePaths = (root, frameCount = 4, directions = jarramplasDirections) => Object.fromEntries(
  directions.map((direction) => [
    direction,
    Array.from(
      { length: frameCount },
      (_, index) => `${root}/${direction}-${index + 1}.png`
    ),
  ])
);

const countJarramplasFrames = (variant) => {
  if (Array.isArray(variant.frames)) return variant.frames.length;
  return Object.values(variant.frames || {}).reduce((total, frames) => total + frames.length, 0);
};

// Para añadir otro Jarramplas, crea una carpeta con frame_001.. o con down/left/right/up y añade otra entrada aquí.
export const jarramplasVariants = [
  { name: "Jarramplas frontal tamboril HD", root: "assets/jarramplas/snes_tamboril_front_8f_hd", frameCount: 8 },
  { name: "Jarramplas modelo izquierdo HD", root: "assets/jarramplas/modelo_izquierda_front_8f_hd", frameCount: 8 },
  { name: "Jarramplas modelo central HD", root: "assets/jarramplas/modelo_centro_front_8f_hd", frameCount: 8 },
  { name: "Jarramplas modelo derecho HD", root: "assets/jarramplas/modelo_derecha_front_8f_hd", frameCount: 8 },
  { name: "Jarramplas rojo y verde HD", root: "assets/jarramplas/modelo_rojo_verde_front_8f_hd", frameCount: 8 },
  { name: "Jarramplas león HD", root: "assets/jarramplas/modelo_leon_front_8f_hd", frameCount: 8 },
  { name: "Jarramplas búho azul HD", root: "assets/jarramplas/modelo_buho_azul_front_8f_hd", frameCount: 8 },
  { name: "Jarramplas negro y dorado HD", root: "assets/jarramplas/modelo_negro_dorado_front_8f_hd", frameCount: 8 },
].map((variant) => ({
  ...variant,
  frames: variant.directions
    ? makeJarramplasDirectionalFramePaths(variant.root, variant.frameCount, variant.directions)
    : makeJarramplasFramePaths(variant.root, variant.frameCount),
}));

export const personIds = [1, 2, 3, 4, 5, 6];
export const personFrameRoots = ["assets/personajes/frames"];
export const loadingAssetEstimate = jarramplasVariants.reduce((total, variant) => total + countJarramplasFrames(variant), 0) + personFrameRoots.length + (personIds.length * 6) + scenarios.length;
