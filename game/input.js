import { MOBILE_CONTROL_BREAKPOINT, keys } from "./constants.js";
import { canvas } from "./dom.js";
import { state } from "./state.js";
import { showScreen } from "./ui.js";
import { clamp } from "./utils.js";

export function bindInput({ playerThrow }) {
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
