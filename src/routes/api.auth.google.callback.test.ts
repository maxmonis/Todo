import { expect, it } from "vitest"
import { googleAuthCallback } from "~/features/auth/googleAuthCallback"
import { Route } from "./api.auth.google.callback"

it("handles google auth callback", () => {
  expect(Route.options.server?.handlers).toEqual({ GET: googleAuthCallback })
})
