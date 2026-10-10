import type { PaymentProvider } from "../types";

/**
 * STUB: implement the `PaymentProvider` contract for flutterwave, then run the shared contract suite
 * (`runProviderContract` from "@template/payments/testing") against it.
 */
export function createFlutterwaveProvider(_opts: { secretKey: string }): PaymentProvider {
  const notImplemented = (): never => {
    throw new Error("flutterwave provider is not implemented yet");
  };
  return {
    name: "flutterwave",
    initialize: notImplemented,
    verify: notImplemented,
    refund: notImplemented,
    parseWebhook: notImplemented,
  };
}
