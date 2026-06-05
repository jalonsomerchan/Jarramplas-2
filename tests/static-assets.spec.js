import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";

const forbiddenFragments = [
  ["patch", "Game", "Script"].join(""),
  ["network", "First", "Game", "Script"].join(""),
  ["is", "Game", "Script"].join(""),
  ["global", "Scope", ".", "fetch"].join(""),
  ["patch", "Game", "Source"].join(""),
];

test("los scripts de aplicacion se tratan como assets estaticos", async () => {
  const files = await Promise.all([
    readFile("service-worker.js", "utf8"),
    readFile("pwa-assets.js", "utf8"),
  ]);
  const source = files.join("\n");

  forbiddenFragments.forEach((fragment) => {
    expect(source).not.toContain(fragment);
  });
  expect(source).toContain("if (isStaticAsset(request))");
});
