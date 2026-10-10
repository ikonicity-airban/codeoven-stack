import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export * from "drizzle-orm";
export * as tables from "./schema";

export type Database = ReturnType<typeof createDb>;

/**
 * Create a Drizzle client.
 * - Serverless (Vercel): point DATABASE_URL at Supabase's transaction pooler and set
 *   DATABASE_POOLED=true -> prepared statements are disabled (required by pgbouncer/Supavisor).
 * - VPS/Docker: use a direct or session-mode URL with DATABASE_POOLED=false.
 */
export function createDb(
  url = process.env.DATABASE_URL,
  pooled = process.env.DATABASE_POOLED === "true",
) {
  if (!url) throw new Error("DATABASE_URL is not set");
  const client = postgres(url, { prepare: !pooled, max: pooled ? 1 : 10 });
  return drizzle(client, { schema });
}

const globalForDb = globalThis as unknown as { __db?: Database };

/** Lazy singleton (survives Next.js hot reloads). */
export function getDb(): Database {
  return (globalForDb.__db ??= createDb());
}
