# AGENTS.md

Conventions for humans and coding agents working in this monorepo.

## Layout

- `apps/web` — Next.js (App Router). `apps/api` — Hono API (typed RPC client in `apps/web/src/lib/api.ts`).
- `packages/*` — internal TypeScript packages, consumed as **source** (no build step). Next transpiles them; the API bundles them with tsup.
- `packages/db` — Drizzle schema + migrations (single source of truth for the DB). `supabase/` holds local config and RLS/trigger SQL only.

## Commands

- `pnpm dev | build | lint | typecheck | test` (all via Turborepo; use `--filter @scope/pkg` to target one package)
- `pnpm db:generate` after editing `packages/db/src/schema`, then `pnpm db:migrate`
- `pnpm changeset` when a package's public behaviour changes

## Rules

- TypeScript strict. No `any` unless commented with why.
- Validate every external input with Zod (shared schemas live in `packages/validators`).
- Money is stored in **minor units** (kobo/cents) as integers.
- Env vars: add to `.env.example`, validate in the app's `env.ts`. Never read `process.env` ad hoc in app code.
- Payments: go through `PaymentProvider` in `packages/payments`; new providers must pass `runProviderContract`.
- Keep Vercel-only services out of core code so the Docker/VPS path keeps working.
- Commits follow Conventional Commits (enforced by commitlint).

## Module markers

Code for optional modules may carry `// @module:<name>` markers (used by `scripts/setup.mjs`, which is deleted after setup). Do not remove markers by hand in a fresh template.
