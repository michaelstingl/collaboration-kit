#!/usr/bin/env bun
// Create a new kit from template/, stamping the frontmatter so nothing is filled by
// hand (and kit_version comes straight from kit.schema.json — one source). Requires bun.
//
// Usage:
//   bun new-kit.ts <slug> [--title "..."] [--status active] [--kits <dir>]
//   - <slug> must match the schema's kit pattern.
//   - --kits: target dir (default: existing _work/kits, then kits, else _work/kits is created).
import { readFileSync, writeFileSync, existsSync, mkdirSync, cpSync, statSync } from "node:fs";
import { join } from "node:path";

const here = import.meta.dir;
const schema = JSON.parse(readFileSync(join(here, "kit.schema.json"), "utf8"));
const kitProps = schema.properties ?? {};

// ---- args: positional slug + --flag value pairs ----
const argv = process.argv.slice(2);
const flags: Record<string, string> = {};
const pos: string[] = [];
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a.startsWith("--")) flags[a.slice(2)] = argv[++i] ?? "";
  else pos.push(a);
}
const slug = pos[0];

function die(msg: string): never { console.error(`new-kit: ${msg}`); process.exit(1); }

if (!slug) die(`usage: bun new-kit.ts <slug> [--title "..."] [--status active] [--kits <dir>]`);
const slugPat = kitProps.kit?.pattern && new RegExp(kitProps.kit.pattern);
if (slugPat && !slugPat.test(slug)) die(`slug "${slug}" does not match ${kitProps.kit.pattern}`);

// ---- resolve target dir ----
let kitsDir = flags.kits;
if (!kitsDir) kitsDir = ["_work/kits", "kits"].find((d) => existsSync(d) && statSync(d).isDirectory()) ?? "_work/kits";
mkdirSync(kitsDir, { recursive: true });

const dest = join(kitsDir, slug);
if (existsSync(dest)) die(`kit already exists: ${dest}`);

// ---- copy template, stamp SCOPE.md ----
cpSync(join(here, "template"), dest, { recursive: true });

const mm = String(schema.version ?? "0.0").split(".").slice(0, 2).join("."); // MAJOR.MINOR
const today = new Date().toISOString().slice(0, 10);
const status = flags.status ?? "active";
const enumv: string[] = kitProps.status?.enum ?? [];
if (enumv.length && !enumv.includes(status)) die(`status "${status}" not in schema enum: ${enumv.join(", ")}`);
const title = flags.title ?? "<one-line problem or topic>";

const scopePath = join(dest, "SCOPE.md");
let scope = readFileSync(scopePath, "utf8");
scope = scope
  .replace(/^kit:\s*<slug>\s*$/m, `kit: ${slug}\nkit_version: ${mm}`)
  .replace(/^kit_version:.*$/m, `kit_version: ${mm}`) // in case the template still ships one
  .replace(/^title:.*$/m, `title: "${title}"`)
  .replace(/^status:.*$/m, `status: ${status}`)
  .replace(/^created:.*$/m, `created: ${today}`)
  .replace(/^updated:.*$/m, `updated: ${today}`);
writeFileSync(scopePath, scope);

console.log(`created ${dest}/  (kit=${slug}, kit_version=${mm}, status=${status}, created=${today})`);
console.log(`next: edit ${scopePath} (title, dossier) — then: bun ${join("…", "board.ts")}`);
