/**
 * Builds the static site into dist/.
 *
 *   1. data/*.ts           -> site/data/*.json   (view models the templates read)
 *   2. tracker /stats      -> site/data/stats.json (+ site/static/stats-snapshot.json)
 *   3. client/*.ts         -> site/static/assets/*-<hash>.js   (esbuild)
 *   4. styles/site.css     -> site/static/assets/site-<hash>.css    (Tailwind, render-blocking)
 *      styles/sprites.css  -> site/static/assets/sprites-<hash>.css (item icons, loaded async)
 *   5. zola build          -> dist/
 *
 * Usage: tsx scripts/build.ts [--dev]
 *   --dev  unminified JS with sourcemaps, for local iteration.
 *
 * Ads and Umami are only emitted for production deploys (VERCEL_ENV=production,
 * or ANALYTICS=1 on another host), so local and preview builds don't pollute them.
 */

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import * as esbuild from "esbuild";
import { buildChartView } from "@/lib/chart-view";
import { fetchRawStats, parseRawStats, shapeStats, type TStatsResponse } from "@/lib/stats";
import { buildStatsView } from "@/lib/stats-view";

const ROOT = path.resolve(import.meta.dirname, "..");
const SITE = path.join(ROOT, "site");
const DATA_DIR = path.join(SITE, "data");
const ASSETS_DIR = path.join(SITE, "static", "assets");
const OUT_DIR = path.join(ROOT, "dist");

const dev = process.argv.includes("--dev");

function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    const p = path.join(ROOT, file);
    // Never overrides variables already set (e.g. by Vercel).
    if (existsSync(p)) process.loadEnvFile(p);
  }
}

const writeJson = (file: string, value: unknown) =>
  writeFileSync(path.join(DATA_DIR, file), JSON.stringify(value));

const hashOf = (content: string | Buffer) =>
  createHash("sha256").update(content).digest("hex").slice(0, 10);

function log(step: string, detail = "") {
  console.log(`build: ${step}${detail ? ` ${detail}` : ""}`);
}

/** Where the live site (and its stats snapshot) is served; overridable for testing. */
const SITE_URL = process.env.SITE_URL ?? "https://www.vsevochart.com";
/** Raw stats published with every deploy, the fallback when the tracker fails. */
const STATS_SNAPSHOT = "stats-snapshot.json";

async function withRetries<T>(attempts: number, fn: () => Promise<T | null>): Promise<T | null> {
  for (let i = 0; i < attempts; i++) {
    const result = await fn();
    if (result) return result;
    if (i < attempts - 1) await new Promise((r) => setTimeout(r, 2000 * (i + 1)));
  }
  return null;
}

/**
 * Stats come from the tracker Worker. Retry, then fall back to the snapshot the
 * live site published, so a flaky tracker (or a day over the D1 free-tier read
 * limit) never replaces real numbers with the "not available" page.
 */
async function loadStats(trackUrl: string): Promise<TStatsResponse | null> {
  const token = process.env.STATS_TOKEN;
  if (trackUrl && token) {
    const raw = await withRetries(dev ? 1 : 3, () =>
      fetchRawStats(process.env.STATS_URL ?? trackUrl, token)
    );
    if (raw) {
      log("stats", "fetched from tracker");
      return raw;
    }
  }
  try {
    const res = await fetch(`${SITE_URL}/${STATS_SNAPSHOT}`);
    const raw = res.ok ? parseRawStats(await res.json()) : null;
    if (raw) {
      log("stats", `tracker unavailable, reusing the live site's snapshot`);
      return raw;
    }
  } catch {
    // fall through
  }
  log("stats", "unavailable (set NEXT_PUBLIC_TRACK_URL and STATS_TOKEN)");
  return null;
}

async function buildData(trackUrl: string, chartView: ReturnType<typeof buildChartView>) {
  writeJson("chart.json", chartView.page);
  writeJson("chart-client.json", chartView.client);

  const raw = await loadStats(trackUrl);
  const stats = raw ? shapeStats(raw.totals) : null;
  writeJson("stats.json", buildStatsView(stats, new Date()));
  if (raw) writeFileSync(path.join(ASSETS_DIR, "..", STATS_SNAPSHOT), JSON.stringify(raw));
}

async function buildScripts(trackUrl: string, dlcCount: number) {
  const gate = await esbuild.build({
    entryPoints: [path.join(ROOT, "client/restore-gate.ts")],
    bundle: true,
    write: false,
    minify: true,
    format: "iife",
    target: "es2020",
    define: { __DLC_COUNT__: String(dlcCount) },
  });
  writeFileSync(path.join(DATA_DIR, "restore-gate.js"), gate.outputFiles[0].text.trim());

  const result = await esbuild.build({
    entryPoints: {
      chart: path.join(ROOT, "client/chart.ts"),
      stats: path.join(ROOT, "client/stats.ts"),
    },
    bundle: true,
    splitting: true,
    format: "esm",
    target: "es2020",
    minify: !dev,
    sourcemap: dev ? "linked" : false,
    outdir: ASSETS_DIR,
    entryNames: "[name]-[hash]",
    chunkNames: "chunk-[hash]",
    metafile: true,
    define: { __TRACK_URL__: JSON.stringify(trackUrl) },
    logLevel: "warning",
  });

  const entries: Record<string, string> = {};
  for (const [file, meta] of Object.entries(result.metafile.outputs)) {
    if (!meta.entryPoint) continue;
    const name = path.basename(meta.entryPoint, ".ts");
    entries[name] = path.basename(file);
    log("js", `${entries[name]} ${(meta.bytes / 1024).toFixed(1)} KB`);
  }
  return entries as { chart: string; stats: string };
}

/** Run one Tailwind entry and emit it as a content-hashed asset. */
function buildCss(entry: string, name: string) {
  const tmp = path.join(ASSETS_DIR, `${name}.tmp.css`);
  execFileSync(
    path.join(ROOT, "node_modules/.bin/tailwindcss"),
    ["-i", path.join(ROOT, "styles", entry), "-o", tmp, "--minify"],
    { cwd: ROOT, stdio: ["ignore", "ignore", "inherit"] }
  );
  const css = readFileSync(tmp);
  rmSync(tmp);
  const file = `${name}-${hashOf(css)}.css`;
  writeFileSync(path.join(ASSETS_DIR, file), css);
  log("css", `${file} ${(css.length / 1024).toFixed(1)} KB`);
  return file;
}

function runZola() {
  const zola = execFileSync(path.join(ROOT, "scripts/ensure-zola.sh"), { encoding: "utf8" }).trim();
  execFileSync(zola, ["--root", SITE, "build", "--output-dir", OUT_DIR, "--force"], {
    stdio: "inherit",
  });
}

async function main() {
  loadEnv();
  const trackUrl = (process.env.TRACK_URL ?? process.env.NEXT_PUBLIC_TRACK_URL ?? "").replace(
    /\/+$/,
    ""
  );

  rmSync(DATA_DIR, { recursive: true, force: true });
  rmSync(ASSETS_DIR, { recursive: true, force: true });
  rmSync(path.join(SITE, "static", STATS_SNAPSHOT), { force: true });
  mkdirSync(DATA_DIR, { recursive: true });
  mkdirSync(ASSETS_DIR, { recursive: true });

  const chartView = buildChartView();
  await buildData(trackUrl, chartView);
  const js = await buildScripts(trackUrl, chartView.client.dlcs.length);
  // CSS last: Tailwind scans the generated view models for class names.
  const css = buildCss("site.css", "site");
  const sprites = buildCss("sprites.css", "sprites");

  writeJson("build.json", {
    css,
    sprites,
    js,
    year: new Date().getFullYear(),
    analytics: !dev && (process.env.VERCEL_ENV === "production" || process.env.ANALYTICS === "1"),
  });

  runZola();
  log("done", path.relative(ROOT, OUT_DIR));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
