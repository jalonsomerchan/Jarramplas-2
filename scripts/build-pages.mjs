import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const outDir = join(root, "pages-dist");

const entries = [
  ".nojekyll",
  "CNAME",
  "index.html",
  "map-editor.html",
  "styles.css",
  "home-title.css",
  "game.js",
  "game",
  "config.js",
  "storage.js",
  "leaderboard.js",
  "GameAPI.js",
  "analytics.js",
  "firebase-config.js",
  "pwa-assets.js",
  "asset-fallbacks.js",
  "service-worker.js",
  "manifest.webmanifest",
  "assets",
  "maps",
  "tools",
  "vendor",
];

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

for (const entry of entries) {
  await cp(join(root, entry), join(outDir, entry), {
    recursive: true,
    force: true,
    errorOnExist: false,
  });
}

await writeFile(
  join(outDir, "README.txt"),
  "Static GitHub Pages build for Jarramplas. Generated with `npm run build:pages`.\n",
);

console.log(`GitHub Pages static build ready at ${outDir}`);
