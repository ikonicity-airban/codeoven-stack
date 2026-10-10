export const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/** Convert major units (e.g. NGN 1500.50) to minor units (kobo): 150050. */
export const toMinorUnits = (amount: number) => Math.round(amount * 100);
export const fromMinorUnits = (amount: number) => amount / 100;

export function formatCurrency(minor: number, currency = "NGN", locale = "en-NG") {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(
    fromMinorUnits(minor),
  );
}

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** Narrowing helper for exhaustive switches. */
export function assertNever(x: never): never {
  throw new Error(`Unexpected value: ${JSON.stringify(x)}`);
}
