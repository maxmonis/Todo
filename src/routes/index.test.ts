import { expect, it } from "vitest"
import { TodoApp } from "~/features/todo/TodoApp"
import { Route } from "./index"

it("renders root route", () => {
  expect(Route.options.component).toBe(TodoApp)
})
