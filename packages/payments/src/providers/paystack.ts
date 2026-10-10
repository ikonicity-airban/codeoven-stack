import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import {
  ProviderError,
  WebhookSignatureError,
  getHeader,
  type InitializeInput,
  type PaymentEvent,
  type PaymentProvider,
  type PaymentStatus,
  type RefundInput,
} from "../types";

const BASE = "https://api.paystack.co";

interface PaystackOptions {
  secretKey: string;
  fetch?: typeof fetch;
}

const mapStatus = (s: string): PaymentStatus =>
  s === "success"
    ? "success"
    : s === "failed" || s === "abandoned" || s === "reversed"
      ? "failed"
      : "pending";

export function createPaystackProvider({
  secretKey,
  fetch: f = fetch,
}: PaystackOptions): PaymentProvider {
  if (!secretKey) throw new Error("PAYSTACK_SECRET_KEY is required");

  async function call<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await f(`${BASE}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });
    const json = (await res.json().catch(() => ({}))) as {
      status?: boolean;
      message?: string;
      data?: T;
    };
    if (!res.ok || json.status === false)
      throw new ProviderError("paystack", json.message ?? res.statusText, res.status, json);
    return json.data as T;
  }

  return {
    name: "paystack",

    async initialize(input: InitializeInput) {
      const reference = input.reference ?? `ps_${randomUUID().replaceAll("-", "")}`;
      const data = await call<{ authorization_url: string; reference: string }>(
        "/transaction/initialize",
        {
          method: "POST",
          body: JSON.stringify({
            email: input.email,
            amount: input.amount,
            currency: input.currency,
            reference,
            callback_url: input.callbackUrl,
            metadata: input.metadata,
          }),
        },
      );
      return { reference: data.reference, checkoutUrl: data.authorization_url };
    },

    async verify(reference) {
      const d = await call<{
        status: string;
        amount: number;
        currency: string;
        reference: string;
        customer?: { email?: string };
      }>(`/transaction/verify/${encodeURIComponent(reference)}`);
      return {
        reference: d.reference,
        status: mapStatus(d.status),
        amount: d.amount,
        currency: d.currency,
        email: d.customer?.email,
        raw: d,
      };
    },

    async refund({ reference, amount }: RefundInput) {
      const raw = await call<unknown>("/refund", {
        method: "POST",
        body: JSON.stringify({ transaction: reference, amount }),
      });
      return { ok: true, raw };
    },

    parseWebhook(rawBody, headers): PaymentEvent {
      const signature = getHeader(headers, "x-paystack-signature");
      const expected = createHmac("sha512", secretKey).update(rawBody).digest("hex");
      const a = Buffer.from(signature ?? "", "utf8");
      const b = Buffer.from(expected, "utf8");
      if (!signature || a.length !== b.length || !timingSafeEqual(a, b))
        throw new WebhookSignatureError();

      const body = JSON.parse(rawBody) as {
        event: string;
        data: {
          id?: number;
          reference?: string;
          amount?: number;
          currency?: string;
          customer?: { email?: string };
        };
      };
      const type: PaymentEvent["type"] =
        body.event === "charge.success"
          ? "payment.succeeded"
          : body.event === "charge.failed"
            ? "payment.failed"
            : body.event === "refund.processed"
              ? "refund.processed"
              : "unknown";
      return {
        id: `${body.event}:${body.data.id ?? body.data.reference}`,
        type,
        reference: body.data.reference ?? "",
        amount: body.data.amount,
        currency: body.data.currency,
        email: body.data.customer?.email,
        raw: body,
      };
    },
  };
}
