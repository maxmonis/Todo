import { redirect } from "@tanstack/react-router"
import { beforeAll, expect, it, vi } from "vitest"
import { db } from "~/server/db"
import { googleAuthCallback } from "./googleAuthCallback"
import { useAuthSession } from "./useAuthSession"

vi.mock("@tanstack/react-router", () => ({
  redirect: vi.fn(args => ({ type: "redirect", ...args })),
}))

vi.mock("~/server/db")

vi.mock("./useAuthSession")

beforeAll(() => {
  process.env.GOOGLE_CLIENT_ID = "TEST_CLIENT_ID"
  process.env.GOOGLE_CLIENT_SECRET = "TEST_CLIENT_SECRET"
  process.env.VITE_BASE_URL = "https://example.com"
})

it("throws redirect if no code", async () => {
  let res = googleAuthCallback({
    request: new Request("https://example.com/api/auth/google/callback"),
  })

  await expect(res).rejects.toEqual({
    href: "https://example.com",
    type: "redirect",
  })
})

it("exchanges code, creates session, and redirects", async () => {
  let fetchSpy = vi
    .spyOn(global, "fetch")
    .mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ access_token: "MOCK_TOKEN" }),
      } as any),
    )
    .mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ email: "test@example.com" }),
      } as any),
    )

  vi.mocked(db.User.findOne).mockResolvedValueOnce(null)
  vi.mocked(db.User.create).mockResolvedValueOnce({
    _id: "USER_ID",
    email: "test@example.com",
  } as any)

  let updateSpy = vi.fn()
  vi.mocked(useAuthSession).mockResolvedValueOnce({
    clear: vi.fn(),
    data: {},
    id: "mockid",
    update: updateSpy,
  })

  let res: any = await googleAuthCallback({
    request: new Request(
      "https://example.com/api/auth/google/callback?code=MOCK_CODE",
    ),
  })

  expect(fetchSpy).toHaveBeenCalledTimes(2)
  expect(db.User.findOne).toHaveBeenCalledExactlyOnceWith({
    email: "test@example.com",
  })
  expect(db.User.create).toHaveBeenCalledExactlyOnceWith({
    email: "test@example.com",
  })
  expect(updateSpy).toHaveBeenCalledExactlyOnceWith({
    email: "test@example.com",
    userId: "USER_ID",
  })

  expect(redirect).toHaveBeenCalledOnce()
  expect(res.href).toBe("https://example.com")
})

it("uses existing user if found", async () => {
  let updateSpy = vi.fn()

  vi.spyOn(global, "fetch")
    .mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ access_token: "MOCK_TOKEN" }),
      } as any),
    )
    .mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ email: "existing@example.com" }),
      } as any),
    )
  vi.mocked(db.User.findOne).mockResolvedValueOnce({
    _id: "EXISTING_ID",
    email: "existing@example.com",
  })
  vi.mocked(useAuthSession).mockResolvedValueOnce({
    update: updateSpy,
  } as any)

  let res: any = await googleAuthCallback({
    request: new Request(
      "https://example.com/api/auth/google/callback?code=MOCK_CODE",
    ),
  })

  expect(db.User.create).not.toHaveBeenCalled()
  expect(updateSpy).toHaveBeenCalledWith({
    email: "existing@example.com",
    userId: "EXISTING_ID",
  })
  expect(res.href).toBe("https://example.com")
})

it("throws if access_token missing", async () => {
  vi.spyOn(global, "fetch").mockResolvedValueOnce({
    json: () => Promise.resolve({}),
  } as any)

  let res = googleAuthCallback({
    request: new Request(
      "https://example.com/api/auth/google/callback?code=MOCK_CODE",
    ),
  })

  await expect(res).rejects.toThrow("No access token")
})

it("throws if email missing", async () => {
  vi.spyOn(global, "fetch")
    .mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ access_token: "t" }),
      } as any),
    )
    .mockImplementationOnce(() =>
      Promise.resolve({ json: () => Promise.resolve({}) } as any),
    )

  let res = googleAuthCallback({
    request: new Request(
      "https://example.com/api/auth/google/callback?code=MOCK_CODE",
    ),
  })

  await expect(res).rejects.toThrow("No email")
})
