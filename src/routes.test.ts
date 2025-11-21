import { expect, it } from "vitest"
import stylesheet from "~/styles.css?url"
import { Route as RootRoute } from "./routes/__root"

it("__root sets the correct head metadata", () => {
  let options: any = RootRoute.options
  let head = options.head()

  expect(head.links).toEqual([{ href: stylesheet, rel: "stylesheet" }])
  expect(head.meta).toEqual([
    { charSet: "utf-8" },
    { content: "initial-scale=1, width=device-width", name: "viewport" },
    { title: "Todo" },
  ])
})
