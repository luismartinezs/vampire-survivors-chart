/**
 * Local development: builds once (--dev), serves dist/ on :4173, and rebuilds
 * whenever a source file changes. Reload the browser to see changes.
 */

import { spawn, spawnSync } from "node:child_process";
import { watch } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const TSX = path.join(ROOT, "node_modules/.bin/tsx");
const WATCHED = [
  "data",
  "lib",
  "client",
  "styles",
  "site/templates",
  "site/content",
  "site/static",
  "site/config.toml",
];
// Written by the build itself; watching them would loop.
const GENERATED = [
  path.join("site", "static", "assets"),
  path.join("site", "static", "stats-snapshot.json"),
];

const build = () =>
  spawnSync(TSX, ["scripts/build.ts", "--dev"], { cwd: ROOT, stdio: "inherit" }).status === 0;

build();
spawn(TSX, ["scripts/preview.ts", "4173"], { cwd: ROOT, stdio: "inherit" });

let timer: NodeJS.Timeout | undefined;
let pending = false;
let running = false;

function schedule() {
  clearTimeout(timer);
  timer = setTimeout(() => {
    if (running) {
      pending = true;
      return;
    }
    running = true;
    console.log("dev: change detected, rebuilding…");
    build();
    running = false;
    if (pending) {
      pending = false;
      schedule();
    }
  }, 150);
}

for (const target of WATCHED) {
  watch(path.join(ROOT, target), { recursive: true }, (_event, file) => {
    const rel = path.join(target, file ?? "");
    if (GENERATED.some((g) => rel.startsWith(g))) return;
    schedule();
  });
}
