import { redirect } from "@tanstack/react-router"
import { expect, it, vi } from "vitest"
import { googleAuth } from "./googleAuth"

vi.mock("@tanstack/react-router")

it("returns correct Google OAuth redirect", () => {
  vi.mocked(redirect).mockImplementationOnce(
    vi.fn().mockImplementationOnce(req => {
      let { origin, pathname, searchParams } = new URL(req.href)

      expect(origin).toBe("https://accounts.google.com")
      expect(pathname).toBe("/o/oauth2/v2/auth")
      expect(searchParams.get("access_type")).toBe("offline")
      expect(searchParams.get("client_id")).toBe("MOCK_GOOGLE_CLIENT_ID")
      expect(searchParams.get("redirect_uri")).toBe(
        "https://base-url.mock/api/auth/google/callback",
      )
      expect(searchParams.get("response_type")).toBe("code")
      expect(searchParams.get("scope")).toBe("email")
    }),
  )

  googleAuth()
})
