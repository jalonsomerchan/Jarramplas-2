export const canvas = document.getElementById("game");
export const ctx = canvas.getContext("2d");
export const hud = document.getElementById("hud");
export const scoreEl = document.getElementById("score");
export const timeEl = document.getElementById("time");
export const comboEl = document.getElementById("combo");
export const recordEl = document.getElementById("record");
export const loadingScreen = document.getElementById("loading");
export const loadingBar = document.getElementById("loadingBar");
export const playButton = document.getElementById("playButton");
export const playerNameInput = document.getElementById("playerNameInput");
export const jarramplasCountdownEl = document.getElementById("jarramplasCountdown");
export const gameVersionEl = document.getElementById("gameVersion");
export const characterOptions = document.getElementById("characterOptions");
export const scenarioOptions = document.getElementById("scenarioOptions");
export const jarramplasOptions = document.getElementById("jarramplasOptions");
export const statsGrid = document.getElementById("statsGrid");
export const statsDetails = document.getElementById("statsDetails");
export const statsLeaderboardStatus = document.getElementById("statsLeaderboardStatus");
export const statsLeaderboard = document.getElementById("statsLeaderboard");
export const statsLeaderboardType = document.getElementById("statsLeaderboardType");
export const statsLeaderboardDifficulty = document.getElementById("statsLeaderboardDifficulty");

export const screens = {
  start: document.getElementById("start"),
  challenge: document.getElementById("challenge"),
  type: document.getElementById("type"),
  characterSelect: document.getElementById("characterSelect"),
  select: document.getElementById("select"),
  scenario: document.getElementById("scenario"),
  jarramplasSelect: document.getElementById("jarramplasSelect"),
  tutorial: document.getElementById("tutorial"),
  stats: document.getElementById("stats"),
  about: document.getElementById("about"),
  pause: document.getElementById("pause"),
  result: document.getElementById("result"),
};
