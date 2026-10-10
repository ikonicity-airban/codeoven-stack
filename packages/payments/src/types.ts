export type PaymentStatus = "pending" | "success" | "failed" | "refunded";

export interface InitializeInput {
  email: string;
  /** Minor units (kobo/cents). */
  amount: number;
  currency?: string;
  reference?: string;
  callbackUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface InitializeResult {
  reference: string;
  /** Hosted checkout URL to redirect the customer to. */
  checkoutUrl: string;
}

export interface VerifyResult {
  reference: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  email?: string;
  raw: unknown;
}

export interface RefundInput {
  reference: string;
  /** Minor units; omit for a full refund. */
  amount?: number;
}

/** Provider-neutral webhook event. Adapters normalize their payloads into this shape. */
export interface PaymentEvent {
  /** Stable id used for idempotency. */
  id: string;
  type: "payment.succeeded" | "payment.failed" | "refund.processed" | "unknown";
  reference: string;
  amount?: number;
  currency?: string;
  email?: string;
  raw: unknown;
}

export interface PaymentProvider {
  readonly name: string;
  initialize(input: InitializeInput): Promise<InitializeResult>;
  verify(reference: string): Promise<VerifyResult>;
  refund(input: RefundInput): Promise<{ ok: boolean; raw: unknown }>;
  /** Verify the signature and normalize the payload. Throws `WebhookSignatureError` when invalid. */
  parseWebhook(
    rawBody: string,
    headers: Headers | Record<string, string | undefined>,
  ): PaymentEvent;
}

export class WebhookSignatureError extends Error {
  constructor(message = "Invalid webhook signature") {
    super(message);
    this.name = "WebhookSignatureError";
  }
}

export class ProviderError extends Error {
  constructor(
    public readonly provider: string,
    message: string,
    public readonly status?: number,
    public readonly raw?: unknown,
  ) {
    super(`[${provider}] ${message}`);
    this.name = "ProviderError";
  }
}

export const getHeader = (
  h: Headers | Record<string, string | undefined>,
  name: string,
): string | undefined =>
  h instanceof Headers ? (h.get(name) ?? undefined) : (h[name] ?? h[name.toLowerCase()]);
