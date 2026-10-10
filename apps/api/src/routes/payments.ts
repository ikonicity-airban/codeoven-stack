import { zValidator } from "@hono/zod-validator";
import { getDb, eq, tables } from "@template/db";
import { WebhookSignatureError, getPaymentProvider } from "@template/payments";
import { initializePaymentSchema } from "@template/validators";
import { Hono } from "hono";
import { randomUUID } from "node:crypto";

export const payments = new Hono()
  /** Start a checkout. Persists a pending payment, then returns the provider's hosted checkout URL. */
  .post("/initialize", zValidator("json", initializePaymentSchema), async (c) => {
    const input = c.req.valid("json");
    const provider = getPaymentProvider();
    const reference = input.reference ?? `pay_${randomUUID().replaceAll("-", "")}`;

    await getDb().insert(tables.payments).values({
      provider: provider.name,
      reference,
      email: input.email,
      amount: input.amount,
      currency: input.currency,
      metadata: input.metadata,
    });

    const result = await provider.initialize({ ...input, reference });
    return c.json(result);
  })

  /** Verify a payment with the provider and sync our record. */
  .get("/verify/:reference", async (c) => {
    const reference = c.req.param("reference");
    const provider = getPaymentProvider();
    const result = await provider.verify(reference);
    await getDb()
      .update(tables.payments)
      .set({ status: result.status, updatedAt: new Date() })
      .where(eq(tables.payments.reference, reference));
    return c.json({ reference, status: result.status });
  })

  /** Provider webhook: signature-verified and idempotent. */
  .post("/webhook", async (c) => {
    const provider = getPaymentProvider();
    const rawBody = await c.req.text(); // must be the raw body for signature verification

    let event;
    try {
      event = provider.parseWebhook(rawBody, c.req.raw.headers);
    } catch (err) {
      if (err instanceof WebhookSignatureError) return c.json({ error: "invalid signature" }, 401);
      throw err;
    }

    const db = getDb();
    const inserted = await db
      .insert(tables.webhookEvents)
      .values({
        provider: provider.name,
        eventId: event.id,
        type: event.type,
        payload: event.raw as object,
      })
      .onConflictDoNothing()
      .returning({ id: tables.webhookEvents.id });
    if (inserted.length === 0) return c.json({ ok: true, duplicate: true });

    if (event.type === "payment.succeeded" || event.type === "payment.failed") {
      await db
        .update(tables.payments)
        .set({
          status: event.type === "payment.succeeded" ? "success" : "failed",
          updatedAt: new Date(),
        })
        .where(eq(tables.payments.reference, event.reference));
    }
    return c.json({ ok: true });
  });
