import { jarramplasVariants, playerVariants, scenarios } from "../config.js";
import { VILLAGER_THROW_TYPE_COUNT } from "./constants.js";
import { loadingBar } from "./dom.js";
import { houseAssets } from "./house-assets.js";
import { objectAssets } from "./object-assets.js";
import { assets } from "./state.js";

export function loadImage(src) {
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

export function updateLoading() {
  const pct = assets.total ? (assets.loaded / assets.total) * 100 : 100;
  if (loadingBar) loadingBar.style.width = `${pct}%`;
}

export async function loadAssets() {
  const generated = {
    playerWalk: "assets/generated/player_walk/sheet.png",
    playerThrow: "assets/generated/player_throw/sheet.png",
    villagerThrow: "assets/generated/villager_throw/sheet.png",
    turnipPiles: "assets/generated/turnip_piles/sheet.png",
    dogWalk: "assets/generated/animals/dog_walk/sheet-transparent.png",
    catWalk: "assets/generated/animals/cat_walk/sheet-transparent.png",
  };
  const imageEntries = await Promise.all(Object.entries(generated).map(async ([key, path]) => [key, await loadImage(path)]));
  assets.images = Object.fromEntries(imageEntries);
  assets.images.houses = await Promise.all(houseAssets.map((house) => loadImage(house.src)));
  assets.images.objects = await Promise.all(objectAssets.map((object) => loadImage(object.src)));
  assets.images.playerCharacters = await Promise.all(playerVariants.map(async (variant) => ({
    walk: await loadImage(variant.walk),
    throw: await loadImage(variant.throw),
    preview: await loadImage(variant.preview),
  })));
  assets.images.villagerThrowTypes = await Promise.all(
    Array.from({ length: VILLAGER_THROW_TYPE_COUNT }, (_, index) => loadImage(`assets/generated/villager_throw_types/type_${index + 1}/sheet.png`)),
  );
  assets.jarramplas = await Promise.all(jarramplasVariants.map((variant) => Promise.all(variant.frames.map(loadImage))));
  assets.backgrounds = [];
}
