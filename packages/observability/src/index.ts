import pino from "pino";

export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  redact: ["req.headers.authorization", "*.password", "*.secret", "*.apiKey"],
  ...(process.env.NODE_ENV === "development"
    ? { transport: { target: "pino/file", options: { destination: 1 } } }
    : {}),
});

export const childLogger = (bindings: Record<string, unknown>) => logger.child(bindings);

/**
 * Error reporting seam. Wire Sentry here (`pnpm add @sentry/node`) and call
 * `Sentry.captureException(err)`. Kept dependency-free so the template builds without a DSN.
 */
export function captureException(err: unknown, context?: Record<string, unknown>) {
  logger.error({ err, ...context }, "captured exception");
}
