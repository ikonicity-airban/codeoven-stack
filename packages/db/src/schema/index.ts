import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { index, integer, jsonb, uniqueIndex } from "drizzle-orm/pg-core"; // @module:payments

export const userRole = pgEnum("user_role", ["user", "admin"]);

/** App profile. `id` mirrors auth.users.id when using Supabase Auth (see supabase/sql/auth.sql). */
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  role: userRole("role").notNull().default("user"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Profile = typeof profiles.$inferSelect;

// @module:payments:start
export const paymentStatus = pgEnum("payment_status", ["pending", "success", "failed", "refunded"]);

export const payments = pgTable(
  "payments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    provider: text("provider").notNull(),
    reference: text("reference").notNull(),
    email: text("email").notNull(),
    /** Minor units (kobo/cents). */
    amount: integer("amount").notNull(),
    currency: text("currency").notNull().default("NGN"),
    status: paymentStatus("status").notNull().default("pending"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("payments_provider_reference_idx").on(t.provider, t.reference),
    index("payments_email_idx").on(t.email),
  ],
);

/** Webhook idempotency log: a (provider, eventId) pair is processed at most once. */
export const webhookEvents = pgTable(
  "webhook_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    provider: text("provider").notNull(),
    eventId: text("event_id").notNull(),
    type: text("type").notNull(),
    payload: jsonb("payload").notNull(),
    receivedAt: timestamp("received_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("webhook_events_provider_event_idx").on(t.provider, t.eventId)],
);

export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
// @module:payments:end
