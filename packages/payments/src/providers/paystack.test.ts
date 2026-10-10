import { createHmac } from "node:crypto";
import { describe, expect, it, vi } from "vitest";
import { runProviderContract } from "../contract";
import { createPaystackProvider } from "./paystack";

const secretKey = "sk_test_dummy";

const fakeFetch = vi.fn(async (url: string | URL | Request) => {
  const u = String(url);
  const data = u.includes("/transaction/initialize")
    ? { authorization_url: "https://checkout.paystack.com/abc", reference: "ref_123456" }
    : {
        status: "success",
        amount: 500000,
        currency: "NGN",
        reference: "ref_123456",
        customer: { email: "a@b.com" },
      };
  return new Response(JSON.stringify({ status: true, data }), { status: 200 });
}) as unknown as typeof fetch;

const provider = createPaystackProvider({ secretKey, fetch: fakeFetch });

runProviderContract("paystack", provider, () => {
  const rawBody = JSON.stringify({
    event: "charge.success",
    data: {
      id: 42,
      reference: "ref_123456",
      amount: 500000,
      currency: "NGN",
      customer: { email: "a@b.com" },
    },
  });
  const signature = createHmac("sha512", secretKey).update(rawBody).digest("hex");
  return { rawBody, headers: { "x-paystack-signature": signature } };
});

describe("paystack API calls", () => {
  it("initializes a transaction", async () => {
    const r = await provider.initialize({
      email: "a@b.com",
      amount: 500000,
      reference: "ref_123456",
    });
    expect(r.checkoutUrl).toContain("paystack.com");
  });
  it("verifies a transaction", async () => {
    const r = await provider.verify("ref_123456");
    expect(r.status).toBe("success");
    expect(r.amount).toBe(500000);
  });
});
