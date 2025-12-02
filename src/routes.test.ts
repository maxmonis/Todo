import { expect, it } from "vitest";
import { Route as RootRoute } from "./routes/__root";
import stylesheet from "@/styles.css?url";

it("__root sets the correct head metadata", () => {
  const options: any = RootRoute.options;
  const head = options.head();

  expect(head.links).toEqual([
    {
      href: stylesheet,
      rel: "stylesheet",
    },
  ]);
  expect(head.meta).toEqual([
    {
      charSet: "utf-8",
    },
    {
      content: "initial-scale=1, width=device-width",
      name: "viewport",
    },
    {
      title: "Todo",
    },
  ]);
});
