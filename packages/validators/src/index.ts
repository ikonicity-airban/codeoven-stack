import { z } from "zod";

export const emailSchema = z.string().trim().toLowerCase().email();

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});
export type Pagination = z.infer<typeof paginationSchema>;

export const initializePaymentSchema = z.object({
  email: emailSchema,
  /** Amount in minor units (kobo for NGN). */
  amount: z.number().int().positive(),
  currency: z.string().length(3).default("NGN"),
  reference: z.string().min(6).max(100).optional(),
  callbackUrl: z.string().url().optional(),
  metadata: z.record(z.unknown()).optional(),
});
export type InitializePaymentInput = z.infer<typeof initializePaymentSchema>;
