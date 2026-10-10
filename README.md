# Monorepo Template

Opinionated starter for full-stack TypeScript monorepos. Click **Use this template**, then run:

```bash
pnpm install
pnpm setup          # rename scope, pick modules, pick hosting target
```

## Stack

| Concern  | Choice                                                                                                   |
| -------- | -------------------------------------------------------------------------------------------------------- |
| Monorepo | pnpm workspaces + Turborepo                                                                              |
| Web      | Next.js 15 (App Router), React 19, Tailwind v4, shadcn-style UI package                                  |
| API      | Hono (typed RPC client, runs on Vercel _and_ Node/Docker)                                                |
| Database | Supabase Postgres + Drizzle ORM                                                                          |
| Quality  | TypeScript strict, ESLint 9 (flat), Prettier, Husky, lint-staged, commitlint, Knip, Syncpack, Changesets |
| Testing  | Vitest (unit), Playwright (e2e)                                                                          |
| CI       | GitHub Actions (lint, typecheck, test, build, e2e), CodeQL, Dependabot                                   |
| Hosting  | Vercel by default; Docker + Caddy + SSH deploy for a VPS                                                 |

## Layout

```
apps/web  apps/api
packages/{config,ui,db,validators,utils}                 core
packages/{auth,email,payments,notifications,jobs,observability}   optional modules
docker/  supabase/  scripts/  docs/addons/
```

## Optional modules (chosen in `pnpm setup`)

| Module          | What you get                                                                                                                                      |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `auth`          | Supabase Auth: browser/server clients, session middleware, magic-link login page, RBAC helper, RLS + profile trigger SQL                          |
| `email`         | Resend + React Email, sample welcome template                                                                                                     |
| `payments`      | Provider-agnostic `PaymentProvider`; Paystack reference implementation; Flutterwave/Stripe stubs; shared contract tests; idempotent webhook route |
| `notifications` | Termii SMS client; push provider interface                                                                                                        |
| `jobs`          | Inngest client + example function, mounted at `/api/jobs`                                                                                         |
| `observability` | Pino logger, `captureException` seam (wire Sentry/PostHog here)                                                                                   |

Add-on apps (docs, mobile, admin, worker) are documented as recipes in `docs/addons/`.

## What setup does

1. Renames `@template/*` to your scope everywhere.
2. Deletes unselected modules: their packages, route files, env vars, schema blocks and dependencies.
3. Removes Docker/VPS files if you pick Vercel-only.
4. Replaces this README and deletes itself.

Non-interactive: `pnpm setup --name my-app --scope @my-app --modules auth,payments --hosting both --addons none --yes`

## Database workflow

Drizzle owns the schema: edit `packages/db/src/schema`, run `pnpm db:generate` then `pnpm db:migrate`. Afterwards run `supabase/sql/auth.sql` once (RLS + signup trigger). On Vercel use Supabase's transaction pooler URL with `DATABASE_POOLED=true`; on a VPS use a direct URL with `DATABASE_POOLED=false`.

## Deploying

- **Vercel:** two projects, Root Directory `apps/web` and `apps/api` (set `SKIP_ENV_VALIDATION` only for builds if needed).
- **VPS:** `docker compose -f docker/docker-compose.yml --env-file .env up -d --build`; the GitHub Action in `.github/workflows/deploy-vps.yml` automates this over SSH.

## After creating a repo from this template

- Replace `@your-username` in `.github/CODEOWNERS`.
- Add `TURBO_TOKEN` (secret) and `TURBO_TEAM` (variable) for remote caching, optional.
- Run `pnpm up -L -r` to refresh dependency versions.
- Mark the repo as a template: Settings → General → Template repository.
