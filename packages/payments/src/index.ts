import { createFlutterwaveProvider } from "./providers/flutterwave";
import { createPaystackProvider } from "./providers/paystack";
import { createStripeProvider } from "./providers/stripe";
import type { PaymentProvider } from "./types";

export * from "./types";
export { createPaystackProvider, createFlutterwaveProvider, createStripeProvider };

export type ProviderName = "paystack" | "flutterwave" | "stripe";

/** Resolve a provider by name from env. Add new providers here. */
export function getPaymentProvider(
  name: string = process.env.PAYMENT_PROVIDER ?? "paystack",
): PaymentProvider {
  switch (name as ProviderName) {
    case "paystack":
      return createPaystackProvider({ secretKey: process.env.PAYSTACK_SECRET_KEY ?? "" });
    case "flutterwave":
      return createFlutterwaveProvider({ secretKey: process.env.FLUTTERWAVE_SECRET_KEY ?? "" });
    case "stripe":
      return createStripeProvider({ secretKey: process.env.STRIPE_SECRET_KEY ?? "" });
    default:
      throw new Error(`Unknown payment provider: ${name}`);
  }
}
