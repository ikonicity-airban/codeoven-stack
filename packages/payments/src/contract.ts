import { describe, expect, it } from "vitest";
import { WebhookSignatureError, type PaymentProvider } from "./types";

/**
 * Shared contract every provider must satisfy. `makeValidWebhook` returns a correctly signed
 * (rawBody, headers) pair for the provider under test.
 */
export function runProviderContract(
  name: string,
  provider: PaymentProvider,
  makeValidWebhook: () => { rawBody: string; headers: Record<string, string> },
) {
  describe(`${name} provider contract`, () => {
    it("exposes its name", () => expect(provider.name).toBe(name));

    it("accepts a correctly signed webhook and normalizes it", () => {
      const { rawBody, headers } = makeValidWebhook();
      const event = provider.parseWebhook(rawBody, headers);
      expect(event.id).toBeTruthy();
      expect(event.reference).toBeTruthy();
      expect(["payment.succeeded", "payment.failed", "refund.processed", "unknown"]).toContain(
        event.type,
      );
    });

    it("rejects a tampered webhook", () => {
      const { rawBody, headers } = makeValidWebhook();
      expect(() => provider.parseWebhook(rawBody + " ", headers)).toThrow(WebhookSignatureError);
    });
  });
}
