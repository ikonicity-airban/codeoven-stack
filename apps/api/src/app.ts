import { captureException } from "@template/observability"; // @module:observability
import { Hono } from "hono";
import { cors } from "hono/cors";
import { health } from "./routes/health";
import { jobs } from "./routes/jobs"; // @module:jobs
import { payments } from "./routes/payments"; // @module:payments

const app = new Hono().basePath("/api");

app.use("*", cors({ origin: (origin) => origin ?? "*", credentials: true }));

// @module:observability:start
app.onError((err, c) => {
  captureException(err, { path: c.req.path });
  return c.json({ error: "Internal Server Error" }, 500);
});
// @module:observability:end

// Chain routes so the Hono RPC client (apps/web/src/lib/api.ts) gets end-to-end types.
const routes = app
  .route("/health", health)
  .route("/payments", payments) // @module:payments
  .route("/jobs", jobs) // @module:jobs
  .get("/", (c) => c.json({ name: "api" }));

export type AppType = typeof routes;
export { app, routes };
