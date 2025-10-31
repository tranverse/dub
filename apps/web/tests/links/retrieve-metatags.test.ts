import { expect, test } from "vitest";
import { IntegrationHarness } from "../utils/integration";

test("GET /links/metatags", async (ctx) => {
  const h = new IntegrationHarness(ctx);
  const { http } = await h.init();

  const { status, data: metatags } = await http.get({
    path: "/links/metatags",
    query: {
      url: "https://dub.co",
    },
  });

  expect(status).toEqual(200);
  expect(metatags).toStrictEqual({
    title: "Buzz - The Modern Link Attribution Platform",
    description:
      "Buzz is the modern link attribution platform for short links, conversion tracking, and affiliate programs.",
    image: "https://assets.dub.co/thumbnail.jpg",
    poweredBy: "Buzz - The Modern Link Attribution Platform",
  });
});
