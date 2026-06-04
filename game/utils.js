export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function dist(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function screenToWorld(x, y, state) {
  return { x: x + state.camera.x, y: y + state.camera.y };
}

export function seeded(seed) {
  let value = seed || 1234567;
  return () => {
    value = (value + 0x6D2B79F5) | 0;
    let t = Math.imul(value ^ (value >>> 15), 1 | value);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function rectsIntersect(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}
