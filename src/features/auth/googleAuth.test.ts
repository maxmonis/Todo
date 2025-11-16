import { redirect } from "@tanstack/react-router"
import { expect, it, vi } from "vitest"
import { googleAuth } from "./googleAuth"

vi.mock("@tanstack/react-router", () => ({
  redirect: vi.fn(args => {
    return { type: "redirect", ...args }
  }),
}))

it("returns correct Google OAuth redirect", () => {
  process.env.GOOGLE_CLIENT_ID = "TEST_CLIENT_ID"
  process.env.VITE_BASE_URL = "https://example.com"

  let result = googleAuth()

  expect(redirect).toHaveBeenCalledOnce()

  expect(result.type).toBe("redirect")

  let url = new URL((result as any).href)

  expect(url.origin).toBe("https://accounts.google.com")
  expect(url.pathname).toBe("/o/oauth2/v2/auth")

  let params = url.searchParams

  expect(params.get("access_type")).toBe("offline")
  expect(params.get("client_id")).toBe("TEST_CLIENT_ID")
  expect(params.get("redirect_uri")).toBe(
    "https://example.com/api/auth/google/callback",
  )
  expect(params.get("response_type")).toBe("code")
  expect(params.get("scope")).toBe("email")
})
