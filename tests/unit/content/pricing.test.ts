import { describe, expect, it } from "vitest";
import { isFilled, known } from "@/config/site";
import { platformCosts, priceText, pricingCards, type PricingCard } from "@/content/pricing";

const card = (price: PricingCard["price"]): PricingCard => ({
  slug: "web-development",
  name: "Website",
  price,
  fallback: "Fixed price after a short scoping call",
  model: "",
  included: [],
  timeline: "[OWNER: typical timeline]",
});

describe("priceText", () => {
  it("hides the price while any part of it is a placeholder", () => {
    expect(
      priceText(card([{ before: "from ", value: "[OWNER: starting price]" }])),
    ).toBeUndefined();
    expect(
      priceText(
        card([
          { before: "setup from ", value: "INR 50,000" },
          { before: "then ", value: "[OWNER: monthly fee]", after: " per month" },
        ]),
      ),
    ).toBeUndefined();
  });

  it("joins the parts once every value is known", () => {
    expect(
      priceText(
        card([
          { before: "setup from ", value: "INR 50,000" },
          { before: "then ", value: "INR 8,000", after: " per month" },
        ]),
      ),
    ).toBe("setup from INR 50,000, then INR 8,000 per month");
  });

  it("shows no price for a card without one", () => {
    expect(priceText(card([]))).toBeUndefined();
  });
});

describe("pricing cards", () => {
  it("never put a placeholder where it would render: fallback, model, and included items", () => {
    for (const entry of pricingCards) {
      for (const text of [entry.fallback, entry.model, ...entry.included]) {
        expect(isFilled(text), `${entry.name}: ${text}`).toBe(true);
      }
    }
    expect(isFilled(platformCosts)).toBe(true);
  });

  it("render a timeline only once it is known", () => {
    for (const entry of pricingCards) {
      if (!isFilled(entry.timeline)) expect(known(entry.timeline)).toBeUndefined();
    }
  });

  it("have one card per service line, the website card featured", () => {
    expect(pricingCards.map((entry) => entry.slug)).toEqual([
      "web-development",
      "app-development",
      "agentic-automation",
      "digital-marketing",
      "custom-software",
    ]);
    expect(pricingCards.filter((entry) => entry.featured).map((entry) => entry.slug)).toEqual([
      "web-development",
    ]);
  });
});
