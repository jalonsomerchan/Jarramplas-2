import { state } from "./state.js";

export function addFloater(text, x, y, color = "#fff6df") {
  state.floaters.push({ text, x, y, color, life: 0.85 });
}

export function burst(x, y, color) {
  for (let i = 0; i < 14; i += 1) {
    const a = Math.random() * Math.PI * 2;
    const s = 60 + Math.random() * 150;
    state.particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 0.35 + Math.random() * 0.25, color });
  }
}

export function createTurnipImpact(x, y, color = "#f2bb3d") {
  state.impacts.push({ x, y, color, life: 0.42, duration: 0.42, seed: Math.random() * Math.PI * 2 });
  for (let i = 0; i < 22; i += 1) {
    const a = Math.random() * Math.PI * 2;
    const s = 95 + Math.random() * 210;
    const chunkColor = i % 3 === 0 ? "#fff7df" : (i % 3 === 1 ? "#78b95e" : color);
    state.particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 0.35 + Math.random() * 0.28, color: chunkColor, size: 3 + Math.random() * 4 });
  }
}
