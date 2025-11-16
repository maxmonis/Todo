import { expect, it } from "vitest"
import { ErrorComponent } from "~/components/root/ErrorComponent"
import { NotFoundComponent } from "~/components/root/NotFoundComponent"
import { ShellComponent } from "~/components/root/ShellComponent"
import stylesheet from "~/styles.css?url"
import { Route } from "./__root"

let options: any = Route.options

it("sets the correct components", () => {
  expect(options.errorComponent).toBe(ErrorComponent)
  expect(options.notFoundComponent).toBe(NotFoundComponent)
  expect(options.shellComponent).toBe(ShellComponent)
})

it("sets the correct head metadata", () => {
  let head = options.head()
  expect(head.links).toEqual([{ href: stylesheet, rel: "stylesheet" }])
  expect(head.meta).toEqual([
    { charSet: "utf-8" },
    { content: "initial-scale=1, width=device-width", name: "viewport" },
    { title: "Todo App" },
  ])
})
