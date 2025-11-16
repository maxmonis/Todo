import { expect, it } from "vitest"
import { googleAuth } from "~/features/auth/googleAuth"
import { Route } from "./api.auth.google.index"

it("handles google auth", () => {
  expect(Route.options.server?.handlers).toEqual({ GET: googleAuth })
})
