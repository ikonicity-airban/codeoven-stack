import type { PaymentProvider } from "../types";

/**
 * STUB: implement the `PaymentProvider` contract for stripe, then run the shared contract suite
 * (`runProviderContract` from "@template/payments/testing") against it.
 */
export function createStripeProvider(_opts: { secretKey: string }): PaymentProvider {
  const notImplemented = (): never => {
    throw new Error("stripe provider is not implemented yet");
  };
  return {
    name: "stripe",
    initialize: notImplemented,
    verify: notImplemented,
    refund: notImplemented,
    parseWebhook: notImplemented,
  };
}
