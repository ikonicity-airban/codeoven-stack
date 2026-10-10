#!/usr/bin/env node
/**
 * Template setup: rename the package scope, pick modules, pick hosting target.
 *
 * Interactive:      pnpm setup
 * Non-interactive:  pnpm setup --name my-app --scope @my-app --modules auth,payments --hosting vercel --yes
 *
 * Module code is wrapped in marker comments:
 *   // @module:<name>            -> single line (removed if module is deselected)
 *   // @module:<name>:start/end  -> block
 * Markers are stripped from kept code. Run this ONCE, right after "Use this template".
 */
import { existsSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { createInterface } from "node:readline/promises";

const ROOT = new URL("..", import.meta.url).pathname;
const SELF = "scripts/setup.mjs";
const OLD_SCOPE = "@template";

const MODULES = {
  auth: {
    label: "Supabase Auth (login, session middleware, RBAC)",
    paths: [
      "packages/auth",
      "apps/web/src/middleware.ts",
      "apps/web/src/app/login",
      "supabase/sql/auth.sql",
    ],
    pkgs: ["@template/auth"],
  },
  email: {
    label: "Email (Resend + React Email)",
    paths: ["packages/email"],
    pkgs: ["@template/email"],
  },
  payments: {
    label: "Payments (provider-agnostic, Paystack reference)",
    paths: ["packages/payments", "apps/api/src/routes/payments.ts"],
    pkgs: ["@template/payments"],
  },
  notifications: {
    label: "Notifications (Termii SMS, push interface)",
    paths: ["packages/notifications"],
    pkgs: ["@template/notifications"],
  },
  jobs: {
    label: "Background jobs (Inngest)",
    paths: ["packages/jobs", "apps/api/src/routes/jobs.ts"],
    pkgs: ["@template/jobs"],
  },
  observability: {
    label: "Observability (Pino logger, error-capture seam)",
    paths: ["packages/observability"],
    pkgs: ["@template/observability"],
  },
};
const ADDONS = ["docs", "mobile", "admin", "worker"]; // recipes in docs/addons/*.md
const HOSTING = ["vercel", "vps", "both"];

// ---------- args ----------
const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => {
    if (a.startsWith("--"))
      acc.push([a.slice(2), all[i + 1] && !all[i + 1].startsWith("--") ? all[i + 1] : "true"]);
    return acc;
  }, []),
);
const yes = args.yes === "true";
const rl = yes ? null : createInterface({ input: process.stdin, output: process.stdout });
const ask = async (q, def) => {
  if (!rl) return def;
  const a = (await rl.question(`${q}${def ? ` (${def})` : ""}: `)).trim();
  return a || def;
};
const csv = (s) =>
  (s ?? "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);

// ---------- file helpers ----------
const SKIP_DIRS = new Set(["node_modules", ".git", ".next", "dist", ".turbo", "coverage"]);
const TEXT_EXT =
  /\.(ts|tsx|js|mjs|cjs|json|yml|yaml|css|toml|sql|example|Dockerfile)$|Dockerfile$|Caddyfile$|CODEOWNERS$|\.md$/;
function* walk(dir) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) yield* walk(full);
    else yield full;
  }
}
const rel = (p) => relative(ROOT, p).replaceAll("\\", "/");
const isText = (p) => TEXT_EXT.test(p) || p.endsWith(".env.example");

function stripModules(content, removed, file) {
  const lines = content.split("\n");
  const out = [];
  let skipping = null;
  for (const line of lines) {
    const t = line.trim();
    const blk = t.match(/^(?:\/\/|#)\s*@module:([\w-]+):(start|end)\s*$/);
    if (blk) {
      const [, name, kind] = blk;
      if (kind === "start" && removed.has(name)) skipping = name;
      else if (kind === "end" && skipping === name) skipping = null;
      continue; // marker lines never survive
    }
    if (skipping) continue;
    const m = line.match(/\s*(?:\/\/|#)\s*@module:([\w-]+)\s*$/);
    if (m) {
      if (removed.has(m[1])) continue;
      out.push(line.replace(/\s*(?:\/\/|#)\s*@module:[\w-]+\s*$/, ""));
      continue;
    }
    out.push(line);
  }
  if (skipping) throw new Error(`Unterminated @module:${skipping}:start in ${file}`);
  return out.join("\n");
}

// ---------- main ----------
async function main() {
  if (!existsSync(join(ROOT, SELF)))
    throw new Error("Setup already ran (scripts/setup.mjs is gone).");

  console.log("\n  Monorepo template setup\n");
  const name = args.name ?? (await ask("Project name (kebab-case)", "my-app"));
  let scope = args.scope ?? (await ask("Package scope", `@${name}`));
  if (!scope.startsWith("@")) scope = `@${scope}`;

  let selected;
  if (args.modules !== undefined)
    selected = new Set(
      args.modules === "all" ? Object.keys(MODULES) : csv(args.modules).filter((x) => x !== "none"),
    );
  else if (yes) selected = new Set(Object.keys(MODULES));
  else {
    selected = new Set();
    console.log("\nOptional modules:");
    for (const [key, m] of Object.entries(MODULES)) {
      const a = (await ask(`  Include ${key} — ${m.label}? [Y/n]`, "y")).toLowerCase();
      if (a.startsWith("y")) selected.add(key);
    }
  }
  for (const s of selected) if (!MODULES[s]) throw new Error(`Unknown module: ${s}`);

  const hosting = args.hosting ?? (await ask(`Hosting target [${HOSTING.join("/")}]`, "both"));
  if (!HOSTING.includes(hosting)) throw new Error(`hosting must be one of ${HOSTING.join(", ")}`);
  const addonInput =
    args.addons !== undefined
      ? csv(args.addons)
      : csv(await ask(`Add-on recipes to keep [${ADDONS.join(",")} | none]`, "none"));
  const addons = addonInput.filter((x) => x !== "none");
  for (const a of addons) if (!ADDONS.includes(a)) throw new Error(`Unknown add-on: ${a}`);

  const removed = new Set(Object.keys(MODULES).filter((k) => !selected.has(k)));

  // 1. delete files of removed modules
  for (const k of removed)
    for (const p of MODULES[k].paths) rmSync(join(ROOT, p), { recursive: true, force: true });

  // 2. strip markers / removed code in text files
  const removedPkgs = new Set([...removed].flatMap((k) => MODULES[k].pkgs));
  for (const file of walk(ROOT)) {
    const r = rel(file);
    if (r === SELF || r === "pnpm-lock.yaml" || !isText(r)) continue;
    let content = readFileSync(file, "utf8");
    const before = content;
    if (!r.endsWith(".md")) content = stripModules(content, removed, r);
    if (content !== before && !r.endsWith(".json")) content = content.replace(/\n{3,}/g, "\n\n");
    if (r.endsWith("package.json")) {
      const pkg = JSON.parse(content);
      for (const field of ["dependencies", "devDependencies"])
        for (const d of removedPkgs) if (pkg[field]) delete pkg[field][d];
      content = JSON.stringify(pkg, null, 2) + "\n";
    }
    if (content !== before) writeFileSync(file, content);
  }

  // 3. hosting target
  if (hosting === "vercel") {
    rmSync(join(ROOT, "docker"), { recursive: true, force: true });
    rmSync(join(ROOT, ".dockerignore"), { force: true });
    rmSync(join(ROOT, ".github/workflows/deploy-vps.yml"), { force: true });
  }

  // 4. add-on recipes
  for (const a of ADDONS)
    if (!addons.includes(a)) rmSync(join(ROOT, `docs/addons/${a}.md`), { force: true });
  if (addons.length === 0) rmSync(join(ROOT, "docs/addons"), { recursive: true, force: true });

  // 5. rename scope + project name everywhere
  for (const file of walk(ROOT)) {
    const r = rel(file);
    if (r === SELF || !isText(r)) continue;
    const content = readFileSync(file, "utf8");
    if (content.includes(OLD_SCOPE + "/"))
      writeFileSync(file, content.replaceAll(OLD_SCOPE + "/", scope + "/"));
  }

  // 6. project README + root scripts
  const mods = [...selected].map((k) => `- ${k}`).join("\n") || "- (none)";
  writeFileSync(
    join(ROOT, "README.md"),
    `# ${name}\n\nNext.js + Hono + Drizzle + Supabase monorepo (pnpm + Turborepo).\n\n## Quick start\n\n\`\`\`bash\npnpm install\ncp .env.example .env   # fill in values\npnpm db:generate && pnpm db:migrate\npnpm dev\n\`\`\`\n\n- Web: http://localhost:3000\n- API: http://localhost:8787/api/health\n\n## Modules included\n\n${mods}\n\n## Hosting\n\n${hosting === "vercel" ? "Vercel (set the project Root Directory to `apps/web`; deploy `apps/api` as a second Vercel project)." : hosting === "vps" ? "Docker on a VPS: see `docker/` and `.github/workflows/deploy-vps.yml`." : "Vercel by default; Docker/VPS ready via `docker/` and `.github/workflows/deploy-vps.yml`."}\n\nSee \`AGENTS.md\` for repo conventions.\n`,
  );
  const rootPkgPath = join(ROOT, "package.json");
  const rootPkg = JSON.parse(readFileSync(rootPkgPath, "utf8"));
  delete rootPkg.scripts.setup;
  writeFileSync(rootPkgPath, JSON.stringify(rootPkg, null, 2) + "\n");

  // 6b. drop template-only guidance
  const agents = join(ROOT, "AGENTS.md");
  if (existsSync(agents))
    writeFileSync(
      agents,
      readFileSync(agents, "utf8").replace(/\n## Module markers[\s\S]*$/, "\n"),
    );
  const envExample = join(ROOT, ".env.example");
  if (existsSync(envExample))
    writeFileSync(
      envExample,
      readFileSync(envExample, "utf8").replace(
        /^# Copy to \.env[^\n]*\n\n?/,
        "# Copy to .env and fill in.\n\n",
      ),
    );

  // 7. lockfile references the old scope; let `pnpm install` regenerate it
  rmSync(join(ROOT, "pnpm-lock.yaml"), { force: true });

  // 8. remove the script itself
  rmSync(join(ROOT, SELF));

  console.log(
    `\nDone. Scope ${scope}, modules: ${[...selected].join(", ") || "none"}, hosting: ${hosting}.`,
  );
  if (removed.size) console.log(`Removed: ${[...removed].join(", ")}`);
  if (addons.length)
    console.log(`Add-on recipes kept: ${addons.map((a) => `docs/addons/${a}.md`).join(", ")}`);
  console.log(
    "\nNext:\n  pnpm install\n  cp .env.example .env\n  pnpm db:generate && pnpm db:migrate\n  pnpm dev\n",
  );
  rl?.close();
}

main().catch((e) => {
  console.error(`\nSetup failed: ${e.message}`);
  process.exit(1);
});
