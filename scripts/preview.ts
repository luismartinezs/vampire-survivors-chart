/**
 * Serves dist/ the way Vercel does (clean URLs, 404.html), for checking a
 * production build locally. Usage: tsx scripts/preview.ts [port] [--gzip]
 *   --gzip  serve gzip instead of brotli (to compare against `next start`).
 */

import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { brotliCompressSync, gzipSync } from "node:zlib";

const DIST = path.resolve(import.meta.dirname, "../dist");
const PORT = Number(process.argv[2] ?? 4173);
const ENCODING = process.argv.includes("--gzip") ? "gzip" : "br";

const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".map": "application/json",
};

function resolve(urlPath: string): string | null {
  const clean = path.normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, "");
  for (const candidate of [clean, `${clean}.html`, path.join(clean, "index.html")]) {
    const file = path.join(DIST, candidate);
    if (file.startsWith(DIST) && existsSync(file) && statSync(file).isFile()) return file;
  }
  return null;
}

/** Compressed output per file, keyed by mtime, so a rebuild is picked up. */
const brotliCache = new Map<string, { mtime: number; body: Buffer }>();
function compressed(file: string): Buffer {
  const mtime = statSync(file).mtimeMs;
  const hit = brotliCache.get(file);
  if (hit && hit.mtime === mtime) return hit.body;
  const raw = readFileSync(file);
  const body = ENCODING === "gzip" ? gzipSync(raw) : brotliCompressSync(raw);
  brotliCache.set(file, { mtime, body });
  return body;
}

const COMPRESSIBLE = new Set([
  ".html",
  ".css",
  ".js",
  ".json",
  ".webmanifest",
  ".svg",
  ".txt",
  ".xml",
]);

createServer((req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  const file = resolve(url.pathname);
  const target = file ?? path.join(DIST, "404.html");
  // Compress like the CDN would, so local performance numbers are comparable.
  const compress =
    COMPRESSIBLE.has(path.extname(target)) &&
    String(req.headers["accept-encoding"]).includes(ENCODING);
  res.writeHead(file ? 200 : 404, {
    "content-type": TYPES[path.extname(target)] ?? "application/octet-stream",
    "cache-control": target.includes(`${path.sep}assets${path.sep}`)
      ? "public, max-age=31536000, immutable"
      : "no-cache",
    ...(compress ? { "content-encoding": ENCODING, vary: "accept-encoding" } : {}),
  });
  if (compress) {
    res.end(compressed(target));
  } else {
    createReadStream(target).pipe(res);
  }
}).listen(PORT, () => console.log(`preview: http://localhost:${PORT}`));
