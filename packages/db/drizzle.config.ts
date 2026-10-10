import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema/index.ts",
  out: "./drizzle",
  dbCredentials: { url: process.env.DATABASE_URL ?? "" },
  // Only manage tables in `public`; Supabase owns auth/storage schemas.
  schemaFilter: ["public"],
});
