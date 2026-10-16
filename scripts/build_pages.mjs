import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/bwpone";
if (!/^\/[A-Za-z0-9_-]+$/.test(basePath) && basePath !== "") {
  throw new Error("NEXT_PUBLIC_BASE_PATH must be empty or a single /repository-name.");
}
const result = spawnSync(process.execPath, ["node_modules/next/dist/bin/next", "build"], {
  cwd: root,
  stdio: "inherit",
  env: { ...process.env, GITHUB_PAGES: "true", NEXT_PUBLIC_BASE_PATH: basePath, NEXT_TELEMETRY_DISABLED: "1" },
});
if (result.status !== 0) process.exit(result.status ?? 1);
const out = join(root, "out");
mkdirSync(out, { recursive: true });
writeFileSync(join(out, ".nojekyll"), "");
writeFileSync(join(out, "index.html"), `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta http-equiv="refresh" content="0;url=${basePath}/zh/"><title>黑白测评组 · 预览样刊</title></head><body><a href="${basePath}/zh/">进入黑白测评组预览样刊 / Open the journal</a></body></html>\n`);
if (process.argv.includes("--stage")) {
  // Keep Pages compatible with the repository's existing main / root publishing setting.
  const manifest = join(root, ".pages-files.json");
  const previous = existsSync(manifest) ? JSON.parse(readFileSync(manifest, "utf8")) : [];
  const allowed = new Set([".nojekyll", "index.html", "404.html", "404", "robots.txt", "_next", "_not-found", "en", "zh", "images"]);
  const current = readdirSync(out);
  for (const name of [...previous, ...current]) {
    if (!allowed.has(name)) throw new Error(`Unexpected export entry: ${name}`);
  }
  for (const name of previous) rmSync(join(root, name), { recursive: true, force: true });
  for (const name of current) cpSync(join(out, name), join(root, name), { recursive: true });
  writeFileSync(manifest, JSON.stringify(current, null, 2) + "\n");
  console.log("GitHub Pages files staged in repository root.");
}
