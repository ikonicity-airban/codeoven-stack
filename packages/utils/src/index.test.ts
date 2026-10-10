import { describe, expect, it } from "vitest";
import { slugify, toMinorUnits } from "./index";

describe("utils", () => {
  it("converts to minor units", () => expect(toMinorUnits(1500.5)).toBe(150050));
  it("slugifies", () => expect(slugify("Hello, World!")).toBe("hello-world"));
});
