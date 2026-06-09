import { houseAssets } from "../game/house-assets.js";
import { objectAssets } from "../game/object-assets.js";

const WORLD = { w: 3200, h: 2400 };
const canvas = document.querySelector("#editorCanvas");
const ctx = canvas.getContext("2d");
const palette = document.querySelector("#palette");
const terrainPalette = document.querySelector("#terrainPalette");
const jsonOutput = document.querySelector("#jsonOutput");
const statusLabel = document.querySelector("#statusLabel");
const zoomLabel = document.querySelector("#zoomLabel");
const mapNameInput = document.querySelector("#mapNameInput");
const importInput = document.querySelector("#importInput");
const emptySelection = document.querySelector("#emptySelection");
const selectionControls = document.querySelector("#selectionControls");
const typeSelect = document.querySelector("#typeSelect");
const xInput = document.querySelector("#xInput");
const yInput = document.querySelector("#yInput");
const wInput = document.querySelector("#wInput");
const hInput = document.querySelector("#hInput");
const variantInput = document.querySelector("#variantInput");
const scaleInput = document.querySelector("#scaleInput");
const bringForwardButton = document.querySelector("#bringForwardButton");
const sendBackwardButton = document.querySelector("#sendBackwardButton");
const variantLabel = document.querySelector("#variantLabel");
const scaleLabel = document.querySelector("#scaleLabel");
const colorInput = document.querySelector("#colorInput");
const colorLabel = document.querySelector("#colorLabel");
const shapeSelect = document.querySelector("#shapeSelect");
const shapeLabel = document.querySelector("#shapeLabel");

const houseVariants = houseAssets.map((house, index) => {
  const h = 300;
  return [index, house.label, Math.round((house.w / house.h) * h), h];
});

const objectVariants = objectAssets.map((object, index) => {
  const h = 150;
  return [index, object.label, Math.round((object.w / object.h) * h), h];
});

function houseIndex(variant = 0) {
  const count = Math.max(1, houseAssets.length);
  return ((Number(variant) || 0) % count + count) % count;
}

function objectIndex(variant = 0) {
  const count = Math.max(1, objectAssets.length);
  return ((Number(variant) || 0) % count + count) % count;
}

const paletteItems = [
  ...houseVariants.map(([frame, label, w, h]) => ({ type: "house", label, frame, w, h })),
  ...objectVariants.map(([frame, label, w, h]) => ({ type: "object", label, frame, w, h })),
];

const terrainItems = [
  { type: "pathRect", label: "Camino", x: 0, y: 0, w: 420, h: 170, color: "#615d58" },
  { type: "plaza", label: "Plaza", x: 0, y: 0, w: 520, h: 340, color: "#b88958", shape: "rect" },
  { type: "plaza", label: "Elipse", x: 0, y: 0, w: 420, h: 300, color: "#d5c991", shape: "ellipse" },
];

const assets = {
  houses: Promise.all(houseAssets.map((house) => loadImage(house.src))),
  objects: Promise.all(objectAssets.map((object) => loadImage(object.src))),
};

let camera = { x: 0, y: 0, zoom: 0.42 };
let selectedId = null;
let selectedLayer = "items";
let drag = null;
let nextId = 1;
let map = defaultMap();
let raf = 0;

function defaultMap() {
  return normalizeMap({
    id: "editor-map",
    name: "Mapa nuevo",
    world: { ...WORLD },
    ground: ["#a98258", "#96704c", "#b08a62"],
    paths: "#615d58",
    pathRects: [
      { x: 0, y: 560, w: 3200, h: 190 },
      { x: 430, y: 0, w: 170, h: 1050 },
      { x: 1515, y: 1180, w: 225, h: 1220 },
    ],
    plazas: [
      { x: 790, y: 700, w: 830, h: 640, color: "#b88958" },
      { x: 885, y: 755, w: 500, h: 430, color: "#d5c991", shape: "ellipse" },
    ],
    objects: [
      [985, 855, 305, 190, 0, 1],
      [705, 585, 150, 135, 1, 0.9],
      [1530, 600, 150, 135, 2, 0.9],
    ],
    houses: [
      [75, 80, 385, 210, 0, 0.8],
      [635, 85, 360, 215, 1, 0.78],
      [2695, 100, 305, 210, 5, 0.76],
    ],
    spawn: { player: [1210, 1765], jarramplas: [1760, 930], target: [1450, 980] },
  });
}

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function normalizeMap(source) {
  const items = [];
  const terrain = [];
  source.houses?.forEach(([x, y, w, h, variant = 0, scale = 1, z = 0]) => {
    items.push({ id: makeId(), type: "house", x, y, w, h, variant, scale, z, aspect: w / Math.max(1, h) });
  });
  source.objects?.forEach(([x, y, w, h, variant = 0, scale = 1, z = 0]) => {
    items.push({ id: makeId(), type: "object", x, y, w, h, variant, scale, z, aspect: w / Math.max(1, h) });
  });
  source.streetProps?.forEach(([x, y, kind = "object", w = 150, h = 130], index) => {
    const variant = index % Math.max(1, objectAssets.length);
    items.push({ id: makeId(), type: "object", x: x - w / 2, y: y - h, w, h, variant, scale: 1, z: 0, legacyKind: kind, aspect: w / Math.max(1, h) });
  });
  if (source.fountain) {
    items.push({
      id: makeId(),
      type: "object",
      x: source.fountain.x - source.fountain.w / 2,
      y: source.fountain.y - source.fountain.h,
      w: source.fountain.w,
      h: source.fountain.h,
      variant: source.fountain.variant || 0,
      scale: 1,
      z: 0,
      aspect: source.fountain.w / Math.max(1, source.fountain.h),
    });
  }
  source.pathRects?.forEach((path) => {
    terrain.push({ id: makeId(), type: "pathRect", color: source.paths || "#615d58", aspect: path.w / Math.max(1, path.h), ...path });
  });
  source.plazas?.forEach((plaza) => {
    terrain.push({ id: makeId(), type: "plaza", shape: plaza.shape || "rect", aspect: plaza.w / Math.max(1, plaza.h), ...plaza });
  });
  return {
    id: source.id || "editor-map",
    name: source.name || source.id || "Mapa",
    world: source.world || { ...WORLD },
    ground: source.ground || ["#a98258", "#96704c", "#b08a62"],
    paths: source.paths || "#615d58",
    terrain,
    spawn: source.spawn || { player: [1200, 1700], jarramplas: [1760, 930], target: [1450, 980] },
    items,
  };
}

function makeId() {
  nextId += 1;
  return `item-${nextId}`;
}

function exportMap() {
  const houses = [];
  const objects = [];
  const pathRects = [];
  const plazas = [];
  const pathColor = map.terrain.find((item) => item.type === "pathRect")?.color || map.paths;
  map.terrain.forEach((item) => {
    if (item.type === "pathRect") {
      pathRects.push({ x: round(item.x), y: round(item.y), w: round(item.w), h: round(item.h) });
    }
    if (item.type === "plaza") {
      const plaza = { x: round(item.x), y: round(item.y), w: round(item.w), h: round(item.h), color: item.color || "#b88958" };
      if (item.shape === "ellipse") plaza.shape = "ellipse";
      plazas.push(plaza);
    }
  });
  map.items.forEach((item) => {
    if (item.type === "house") houses.push(exportPlacedItem(item));
    if (item.type === "object") objects.push(exportPlacedItem(item));
  });
  return {
    id: slugify(map.name),
    name: map.name,
    world: map.world,
    ground: map.ground,
    paths: pathColor,
    pathRects,
    plazas,
    spawn: map.spawn,
    houses,
    objects,
  };
}

function exportPlacedItem(item) {
  const data = [
    round(item.x), round(item.y), round(item.w), round(item.h), item.variant || 0, round(item.scale ?? 1, 2),
  ];
  if (item.z) data.push(item.z);
  return data;
}

function round(value, digits = 0) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function slugify(value) {
  return (value || "mapa")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "mapa";
}

function itemRect(item) {
  if (item.type === "pathRect" || item.type === "plaza") return { x: item.x, y: item.y, w: item.w, h: item.h };
  if (item.type === "house" || item.type === "object") return { x: item.x, y: item.y, w: item.w, h: item.h };
  return { x: item.x - item.w / 2, y: item.y - item.h, w: item.w, h: item.h };
}

function setItemRect(item, rect) {
  const w = Math.max(24, rect.w);
  const h = Math.max(24, rect.h);
  if (item.type === "house" || item.type === "object" || item.type === "pathRect" || item.type === "plaza") {
    item.x = rect.x;
    item.y = rect.y;
  } else {
    item.x = rect.x + w / 2;
    item.y = rect.y + h;
  }
  item.w = w;
  item.h = h;
}

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.max(1, Math.floor(rect.width * dpr));
  canvas.height = Math.max(1, Math.floor(rect.height * dpr));
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  requestRender();
}

function requestRender() {
  if (raf) return;
  raf = requestAnimationFrame(() => {
    raf = 0;
    render();
  });
}

function render() {
  const rect = canvas.getBoundingClientRect();
  ctx.clearRect(0, 0, rect.width, rect.height);
  ctx.save();
  ctx.translate(camera.x, camera.y);
  ctx.scale(camera.zoom, camera.zoom);

  drawMapBase();
  drawTerrainSelection();
  drawItems();
  drawSpawns();
  drawSelection();

  ctx.restore();
  zoomLabel.textContent = `${Math.round(camera.zoom * 100)}%`;
  const selected = getSelected();
  statusLabel.textContent = selected ? `${selected.type} · ${Math.round(selected.x)}, ${Math.round(selected.y)}` : `${map.items.length} objetos · ${map.terrain.length} suelos`;
}

function drawMapBase() {
  ctx.fillStyle = map.ground[1] || "#96704c";
  ctx.fillRect(0, 0, map.world.w, map.world.h);
  for (let x = 0; x < map.world.w; x += 48) {
    for (let y = 0; y < map.world.h; y += 48) {
      const mixed = ((x / 48) + (y / 48)) % 3;
      ctx.fillStyle = map.ground[mixed] || map.ground[0];
      ctx.fillRect(x, y, 48, 48);
    }
  }
  map.terrain.forEach((terrain) => {
    ctx.fillStyle = terrain.color || (terrain.type === "pathRect" ? map.paths : "#b88958");
    if (terrain.shape === "ellipse") {
      ctx.beginPath();
      ctx.ellipse(terrain.x + terrain.w / 2, terrain.y + terrain.h / 2, terrain.w / 2, terrain.h / 2, terrain.rotation || 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(terrain.x, terrain.y, terrain.w, terrain.h);
    }
  });
  ctx.strokeStyle = "rgba(255,255,255,.22)";
  ctx.lineWidth = 3;
  ctx.strokeRect(0, 0, map.world.w, map.world.h);
}

function drawItems() {
  sortedItems().forEach(drawItem);
}

function drawTerrainSelection() {
  const selected = selectedLayer === "terrain" ? getSelected() : null;
  if (!selected) return;
  const rect = itemRect(selected);
  ctx.strokeStyle = "#7bdcff";
  ctx.lineWidth = 4 / camera.zoom;
  ctx.setLineDash([10 / camera.zoom, 8 / camera.zoom]);
  ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
  ctx.setLineDash([]);
  handles(rect).forEach((handle) => {
    ctx.fillStyle = "#10202a";
    ctx.strokeStyle = "#c1f2ff";
    ctx.lineWidth = 3 / camera.zoom;
    ctx.fillRect(handle.x - handle.size / 2, handle.y - handle.size / 2, handle.size, handle.size);
    ctx.strokeRect(handle.x - handle.size / 2, handle.y - handle.size / 2, handle.size, handle.size);
  });
}

function itemDepth(item) {
  const rect = itemRect(item);
  return rect.y + rect.h;
}

function itemLayer(item) {
  return Number(item.z) || 0;
}

function compareItems(a, b) {
  const layerDiff = itemLayer(a) - itemLayer(b);
  if (layerDiff) return layerDiff;
  const depthDiff = itemDepth(a) - itemDepth(b);
  if (depthDiff) return depthDiff;
  return map.items.indexOf(a) - map.items.indexOf(b);
}

function sortedItems() {
  return [...map.items].sort(compareItems);
}

function drawItem(item) {
  const rect = itemRect(item);
  if (item.type === "house") drawImage(assets.housesImages?.[houseIndex(item.variant)] || assets.housesImages?.[0], rect.x, rect.y, rect.w, rect.h);
  if (item.type === "object") drawImage(assets.objectsImages?.[objectIndex(item.variant)] || assets.objectsImages?.[0], rect.x, rect.y, rect.w, rect.h);
  if (!getImageForItem(item)) {
    ctx.fillStyle = "rgba(240,185,76,.35)";
    ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
  }
}

function drawSheetFrame(img, rows, cols, frame, x, y, w, h) {
  if (!img) return false;
  const sw = img.width / cols;
  const sh = img.height / rows;
  const sx = (frame % cols) * sw;
  const sy = Math.floor(frame / cols) * sh;
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
  return true;
}

function drawImage(img, x, y, w, h) {
  if (!img) return false;
  drawImageToContext(ctx, img, x, y, w, h);
  return true;
}

function drawImageToContext(targetCtx, img, x, y, w, h) {
  const scale = Math.min(w / img.width, h / img.height);
  const drawW = img.width * scale;
  const drawH = img.height * scale;
  targetCtx.drawImage(img, x + (w - drawW) / 2, y + (h - drawH) / 2, drawW, drawH);
}

function getImageForItem(item) {
  if (item.type === "house") return assets.housesImages?.[houseIndex(item.variant)] || assets.housesImages?.[0];
  if (item.type === "object") return assets.objectsImages?.[objectIndex(item.variant)] || assets.objectsImages?.[0];
  return null;
}

function drawSpawns() {
  Object.entries(map.spawn).forEach(([name, point]) => {
    const color = name === "player" ? "#3de68a" : name === "jarramplas" ? "#ff5950" : "#6cb7ff";
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(point[0], point[1], 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#101010";
    ctx.font = "700 24px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(name[0].toUpperCase(), point[0], point[1] + 8);
  });
}

function drawSelection() {
  const selected = getSelected();
  if (!selected || selectedLayer === "terrain") return;
  const rect = itemRect(selected);
  ctx.strokeStyle = "#f0b94c";
  ctx.lineWidth = 4 / camera.zoom;
  ctx.setLineDash([12 / camera.zoom, 8 / camera.zoom]);
  ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
  ctx.setLineDash([]);
  handles(rect).forEach((handle) => {
    ctx.fillStyle = "#171512";
    ctx.strokeStyle = "#ffe0a0";
    ctx.lineWidth = 3 / camera.zoom;
    ctx.fillRect(handle.x - handle.size / 2, handle.y - handle.size / 2, handle.size, handle.size);
    ctx.strokeRect(handle.x - handle.size / 2, handle.y - handle.size / 2, handle.size, handle.size);
  });
}

function handles(rect) {
  const size = 14 / camera.zoom;
  return [
    { name: "nw", x: rect.x, y: rect.y, size },
    { name: "ne", x: rect.x + rect.w, y: rect.y, size },
    { name: "sw", x: rect.x, y: rect.y + rect.h, size },
    { name: "se", x: rect.x + rect.w, y: rect.y + rect.h, size },
  ];
}

function screenToWorld(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (clientX - rect.left - camera.x) / camera.zoom,
    y: (clientY - rect.top - camera.y) / camera.zoom,
  };
}

function hitTest(point) {
  const items = sortedItems();
  for (let i = items.length - 1; i >= 0; i -= 1) {
    const item = items[i];
    const rect = itemRect(item);
    if (point.x >= rect.x && point.x <= rect.x + rect.w && point.y >= rect.y && point.y <= rect.y + rect.h) return item;
  }
  return null;
}

function hitTerrain(point) {
  for (let i = map.terrain.length - 1; i >= 0; i -= 1) {
    const terrain = map.terrain[i];
    const rect = itemRect(terrain);
    if (point.x >= rect.x && point.x <= rect.x + rect.w && point.y >= rect.y && point.y <= rect.y + rect.h) return terrain;
  }
  return null;
}

function hitHandle(point) {
  const selected = getSelected();
  if (!selected) return null;
  return handles(itemRect(selected)).find((handle) => (
    Math.abs(point.x - handle.x) <= handle.size && Math.abs(point.y - handle.y) <= handle.size
  ));
}

function getSelected() {
  const list = selectedLayer === "terrain" ? map.terrain : map.items;
  return list.find((item) => item.id === selectedId) || null;
}

function selectItem(item, layer = "items") {
  selectedLayer = item ? layer : "items";
  selectedId = item?.id || null;
  syncSelectionPanel();
  updateJson();
  requestRender();
}

function addItem(template) {
  const center = screenToWorld(canvas.getBoundingClientRect().left + canvas.clientWidth / 2, canvas.getBoundingClientRect().top + canvas.clientHeight / 2);
  let item;
  if (template.type === "house") {
    item = { id: makeId(), type: "house", x: center.x - template.w / 2, y: center.y - template.h / 2, w: template.w, h: template.h, variant: template.frame, scale: 1, z: 0, aspect: template.w / template.h };
  } else {
    item = { id: makeId(), type: "object", x: center.x - template.w / 2, y: center.y - template.h / 2, w: template.w, h: template.h, variant: template.frame, scale: 1, z: 0, aspect: template.w / template.h };
  }
  map.items.push(item);
  selectItem(item, "items");
}

function addTerrain(template) {
  const center = screenToWorld(canvas.getBoundingClientRect().left + canvas.clientWidth / 2, canvas.getBoundingClientRect().top + canvas.clientHeight / 2);
  const terrain = {
    id: makeId(),
    type: template.type,
    x: center.x - template.w / 2,
    y: center.y - template.h / 2,
    w: template.w,
    h: template.h,
    color: template.color,
    shape: template.shape || "rect",
    aspect: template.w / template.h,
  };
  map.terrain.push(terrain);
  selectItem(terrain, "terrain");
}

function syncSelectionPanel() {
  const item = getSelected();
  emptySelection.hidden = Boolean(item);
  selectionControls.hidden = !item;
  if (!item) return;

  const rect = itemRect(item);
  typeSelect.innerHTML = "";
  let options = [[item.type, item.type]];
  if (item.type === "house") options = houseVariants.map(([frame, label]) => [String(frame), label]);
  if (item.type === "object") options = objectVariants.map(([frame, label]) => [String(frame), label]);
  if (item.type === "pathRect") options = [["pathRect", "Camino"]];
  if (item.type === "plaza") options = [["plaza", "Plaza"]];
  options.forEach(([value, label]) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    typeSelect.append(option);
  });
  typeSelect.value = item.type === "house" ? String(houseIndex(item.variant)) : item.type === "object" ? String(objectIndex(item.variant)) : item.type;
  xInput.value = Math.round(item.type === "house" ? item.x : item.x);
  yInput.value = Math.round(item.type === "house" ? item.y : item.y);
  wInput.value = Math.round(rect.w);
  hInput.value = Math.round(rect.h);
  variantInput.value = item.variant || 0;
  scaleInput.value = item.scale ?? 1;
  colorInput.value = item.color || (item.type === "pathRect" ? map.paths : "#b88958");
  shapeSelect.value = item.shape || "rect";
  variantLabel.hidden = item.type === "house" || item.type === "object" || item.type === "pathRect" || item.type === "plaza";
  scaleLabel.hidden = item.type !== "house" && item.type !== "object";
  bringForwardButton.disabled = item.type !== "house" && item.type !== "object";
  sendBackwardButton.disabled = item.type !== "house" && item.type !== "object";
  colorLabel.hidden = item.type !== "pathRect" && item.type !== "plaza";
  shapeLabel.hidden = item.type !== "plaza";
}

function updateSelectedFromInputs() {
  const item = getSelected();
  if (!item) return;
  if (item.type === "house") {
    item.variant = Number(typeSelect.value) || 0;
  }
  if (item.type === "object") {
    item.variant = Number(typeSelect.value) || 0;
  }
  if (item.type === "pathRect" || item.type === "plaza") {
    item.color = colorInput.value;
    item.shape = item.type === "plaza" ? shapeSelect.value : "rect";
  } else if (item.type !== "house" && item.type !== "object") {
    item.variant = Number(variantInput.value) || 0;
  }
  item.scale = Number(scaleInput.value) || 1;
  const aspect = item.aspect || (item.w / Math.max(1, item.h)) || 1;
  let w = Number(wInput.value) || item.w;
  let h = Number(hInput.value) || item.h;
  if (document.activeElement === wInput) h = w / aspect;
  if (document.activeElement === hInput) w = h * aspect;
  if (item.type === "house" || item.type === "object" || item.type === "pathRect" || item.type === "plaza") {
    setItemRect(item, { x: Number(xInput.value) || 0, y: Number(yInput.value) || 0, w, h });
  } else {
    item.x = Number(xInput.value) || 0;
    item.y = Number(yInput.value) || 0;
    item.w = w;
    item.h = h;
  }
  syncSelectionPanel();
  updateJson();
  requestRender();
}

function updateJson() {
  map.name = mapNameInput.value || map.name;
  jsonOutput.value = JSON.stringify(exportMap(), null, 2);
}

function centerCamera() {
  const rect = canvas.getBoundingClientRect();
  camera.x = (rect.width - map.world.w * camera.zoom) / 2;
  camera.y = (rect.height - map.world.h * camera.zoom) / 2;
  requestRender();
}

function zoomAt(factor, clientX = canvas.getBoundingClientRect().left + canvas.clientWidth / 2, clientY = canvas.getBoundingClientRect().top + canvas.clientHeight / 2) {
  const before = screenToWorld(clientX, clientY);
  camera.zoom = Math.min(2, Math.max(0.18, camera.zoom * factor));
  const rect = canvas.getBoundingClientRect();
  camera.x = clientX - rect.left - before.x * camera.zoom;
  camera.y = clientY - rect.top - before.y * camera.zoom;
  requestRender();
}

function createPalette() {
  paletteItems.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.type = item.type;
    button.textContent = item.label;
    const preview = document.createElement("img");
    button.prepend(preview);
    button.addEventListener("click", () => addItem(item));
    palette.append(button);
    makePreview(item).then((src) => {
      if (src) preview.src = src;
    });
  });
  terrainItems.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = item.label;
    const swatch = document.createElement("span");
    swatch.className = `terrain-swatch ${item.shape === "ellipse" ? "is-ellipse" : ""}`;
    swatch.style.background = item.color;
    button.prepend(swatch);
    button.addEventListener("click", () => addTerrain(item));
    terrainPalette.append(button);
  });
}

async function makePreview(item) {
  await Promise.all(Object.values(assets).filter((value) => value instanceof Promise));
  const img = getImageForPalette(item);
  if (!img) return "";
  if (item.type === "house" || item.type === "object") {
    const c = document.createElement("canvas");
    c.width = 96;
    c.height = 96;
    const pctx = c.getContext("2d");
    drawImageToContext(pctx, img, 8, 8, 80, 80);
    return c.toDataURL("image/png");
  }
  const rows = 1;
  const cols = 3;
  const realRows = rows;
  const frame = item.frame || 0;
  const sw = img.width / cols;
  const sh = img.height / realRows;
  const c = document.createElement("canvas");
  c.width = 96;
  c.height = 96;
  const pctx = c.getContext("2d");
  pctx.drawImage(img, (frame % cols) * sw, Math.floor(frame / cols) * sh, sw, sh, 8, 8, 80, 80);
  return c.toDataURL("image/png");
}

function getImageForPalette(item) {
  if (item.type === "house") return assets.housesImages?.[houseIndex(item.frame)] || assets.housesImages?.[0];
  if (item.type === "object") return assets.objectsImages?.[objectIndex(item.frame)] || assets.objectsImages?.[0];
  return null;
}

canvas.addEventListener("pointerdown", (event) => {
  canvas.setPointerCapture(event.pointerId);
  const point = screenToWorld(event.clientX, event.clientY);
  const handle = hitHandle(point);
  if (handle) {
    const rect = itemRect(getSelected());
    drag = { mode: "resize", handle: handle.name, start: point, rect, aspect: getSelected().aspect || rect.w / Math.max(1, rect.h) };
    return;
  }
  const item = hitTest(point);
  if (item) {
    selectItem(item, "items");
    drag = { mode: "move", start: point, rect: itemRect(item) };
    return;
  }
  const terrain = hitTerrain(point);
  if (terrain) {
    selectItem(terrain, "terrain");
    drag = { mode: "move", start: point, rect: itemRect(terrain) };
    return;
  }
  selectItem(null);
  drag = { mode: "pan", startScreen: { x: event.clientX, y: event.clientY }, camera: { ...camera } };
});

canvas.addEventListener("pointermove", (event) => {
  if (!drag) return;
  if (drag.mode === "pan") {
    camera.x = drag.camera.x + event.clientX - drag.startScreen.x;
    camera.y = drag.camera.y + event.clientY - drag.startScreen.y;
    requestRender();
    return;
  }
  const item = getSelected();
  if (!item) return;
  const point = screenToWorld(event.clientX, event.clientY);
  const dx = point.x - drag.start.x;
  const dy = point.y - drag.start.y;
  if (drag.mode === "move") {
    setItemRect(item, { ...drag.rect, x: drag.rect.x + dx, y: drag.rect.y + dy });
  } else {
    setItemRect(item, proportionalResize(drag.rect, drag.handle, dx, dy, drag.aspect));
  }
  syncSelectionPanel();
  updateJson();
  requestRender();
});

function proportionalResize(startRect, handle, dx, dy, aspect) {
  const anchorX = handle.includes("w") ? startRect.x + startRect.w : startRect.x;
  const anchorY = handle.includes("n") ? startRect.y + startRect.h : startRect.y;
  const rawW = Math.max(24, startRect.w + (handle.includes("e") ? dx : -dx));
  const rawH = Math.max(24, startRect.h + (handle.includes("s") ? dy : -dy));
  const widthFromHeight = rawH * aspect;
  const useWidth = Math.abs(rawW - startRect.w) >= Math.abs(widthFromHeight - startRect.w);
  const w = useWidth ? rawW : widthFromHeight;
  const h = w / aspect;
  return {
    x: handle.includes("w") ? anchorX - w : anchorX,
    y: handle.includes("n") ? anchorY - h : anchorY,
    w,
    h,
  };
}

canvas.addEventListener("pointerup", () => {
  drag = null;
});

canvas.addEventListener("wheel", (event) => {
  event.preventDefault();
  zoomAt(event.deltaY > 0 ? 0.9 : 1.1, event.clientX, event.clientY);
}, { passive: false });

document.querySelector("#zoomOutButton").addEventListener("click", () => zoomAt(0.86));
document.querySelector("#zoomInButton").addEventListener("click", () => zoomAt(1.16));
document.querySelector("#centerButton").addEventListener("click", centerCamera);

document.querySelector("#deleteButton").addEventListener("click", () => {
  deleteSelected();
});

bringForwardButton.addEventListener("click", () => moveSelectedLayer(1));
sendBackwardButton.addEventListener("click", () => moveSelectedLayer(-1));

document.addEventListener("keydown", (event) => {
  if ((event.key === "Delete" || event.key === "Backspace") && selectedId && document.activeElement === document.body) {
    deleteSelected();
  }
});

function deleteSelected() {
  if (!selectedId) return;
  if (selectedLayer === "terrain") {
    map.terrain = map.terrain.filter((item) => item.id !== selectedId);
  } else {
    map.items = map.items.filter((item) => item.id !== selectedId);
  }
  selectItem(null);
}

function moveSelectedLayer(delta) {
  const item = getSelected();
  if (!item || (item.type !== "house" && item.type !== "object")) return;
  item.z = Math.max(-5, Math.min(5, (Number(item.z) || 0) + delta));
  updateJson();
  requestRender();
}

[typeSelect, xInput, yInput, wInput, hInput, variantInput, scaleInput, colorInput, shapeSelect].forEach((input) => {
  input.addEventListener("input", updateSelectedFromInputs);
});
mapNameInput.addEventListener("input", updateJson);

document.querySelector("#exportButton").addEventListener("click", () => {
  const blob = new Blob([jsonOutput.value], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${slugify(map.name)}.json`;
  a.click();
  URL.revokeObjectURL(url);
});

document.querySelector("#copyJsonButton").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(jsonOutput.value);
    statusLabel.textContent = "JSON copiado";
  } catch {
    jsonOutput.select();
    statusLabel.textContent = "JSON seleccionado";
  }
});

document.querySelector("#loadExampleButton").addEventListener("click", async () => {
  const response = await fetch("maps/piornal-editor-example.json");
  map = normalizeMap(await response.json());
  mapNameInput.value = map.name;
  selectItem(null);
  centerCamera();
  updateJson();
});

importInput.addEventListener("change", async () => {
  const [file] = importInput.files;
  if (!file) return;
  map = normalizeMap(JSON.parse(await file.text()));
  mapNameInput.value = map.name;
  selectItem(null);
  centerCamera();
  updateJson();
});

async function boot() {
  const [housesImages, objectsImages] = await Promise.all([assets.houses, assets.objects]);
  assets.housesImages = housesImages;
  assets.objectsImages = objectsImages;
  createPalette();
  mapNameInput.value = map.name;
  resizeCanvas();
  centerCamera();
  updateJson();
}

window.addEventListener("resize", resizeCanvas);
boot();
