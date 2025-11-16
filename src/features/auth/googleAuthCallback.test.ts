import { redirect } from "@tanstack/react-router"
import { beforeAll, expect, it, vi } from "vitest"
import { db } from "~/server/db"
import { googleAuthCallback } from "./googleAuthCallback"
import { useAuthSession } from "./useAuthSession"

vi.mock("@tanstack/react-router")

vi.mock("~/server/db")

vi.mock("./useAuthSession")

beforeAll(() => {
  process.env.GOOGLE_CLIENT_ID = "MOCK_CLIENT_ID"
  process.env.GOOGLE_CLIENT_SECRET = "MOCK_CLIENT_SECRET"
  process.env.VITE_BASE_URL = "https://example.mock"
})

it("throws redirect if no code", async () => {
  vi.mocked(redirect).mockImplementationOnce(vi.fn(args => args))

  let res = googleAuthCallback({
    request: new Request("https://example.mock/api/auth/google/callback"),
  })

  await expect(res).rejects.toEqual({ href: "https://example.mock" })
  expect(redirect).toHaveBeenCalledOnce()
})

it("exchanges code, creates session, and redirects", async () => {
  let updateSpy = vi.fn()

  let fetchSpy = vi
    .spyOn(global, "fetch")
    .mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ access_token: "MOCK_TOKEN" }),
      } as any),
    )
    .mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ email: "mock@valid.email" }),
      } as any),
    )

  vi.mocked(db.User.findOne).mockResolvedValueOnce(null)
  vi.mocked(db.User.create).mockResolvedValueOnce({
    _id: "USER_ID",
    email: "mock@valid.email",
  } as any)

  vi.mocked(useAuthSession).mockResolvedValueOnce({
    clear: vi.fn(),
    data: {},
    id: "mockid",
    update: updateSpy,
  })
  vi.mocked(redirect).mockImplementationOnce(
    vi.fn().mockImplementationOnce(req => {
      expect(new URL(req.href).origin).toBe("https://example.mock")
    }),
  )

  await googleAuthCallback({
    request: new Request(
      "https://example.mock/api/auth/google/callback?code=MOCK_CODE",
    ),
  })

  expect(fetchSpy).toHaveBeenCalledTimes(2)
  expect(db.User.findOne).toHaveBeenCalledExactlyOnceWith({
    email: "mock@valid.email",
  })
  expect(db.User.create).toHaveBeenCalledExactlyOnceWith({
    email: "mock@valid.email",
  })
  expect(updateSpy).toHaveBeenCalledExactlyOnceWith({
    email: "mock@valid.email",
    userId: "USER_ID",
  })
  expect(redirect).toHaveBeenCalledOnce()
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
        json: () => Promise.resolve({ email: "mock@valid.email" }),
      } as any),
    )

  vi.mocked(db.User.findOne).mockResolvedValueOnce({
    _id: "EXISTING_ID",
    email: "mock@valid.email",
  })
  vi.mocked(useAuthSession).mockResolvedValueOnce({
    update: updateSpy,
  } as any)
  vi.mocked(redirect).mockImplementationOnce(
    vi.fn().mockImplementationOnce(req => {
      expect(new URL(req.href).origin).toBe("https://example.mock")
    }),
  )

  await googleAuthCallback({
    request: new Request(
      "https://example.mock/api/auth/google/callback?code=MOCK_CODE",
    ),
  })

  expect(db.User.create).not.toHaveBeenCalled()
  expect(updateSpy).toHaveBeenCalledExactlyOnceWith({
    email: "mock@valid.email",
    userId: "EXISTING_ID",
  })
  expect(redirect).toHaveBeenCalledOnce()
})

it("throws if access_token missing", async () => {
  vi.spyOn(global, "fetch").mockResolvedValueOnce({
    json: () => Promise.resolve({}),
  } as any)

  let res = googleAuthCallback({
    request: new Request(
      "https://example.mock/api/auth/google/callback?code=MOCK_CODE",
    ),
  })

  await expect(res).rejects.toThrow("No access token")
})

it("throws if email missing", async () => {
  vi.spyOn(global, "fetch")
    .mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ access_token: "MOCK_TOKEN" }),
      } as any),
    )
    .mockImplementationOnce(() =>
      Promise.resolve({ json: () => Promise.resolve({}) } as any),
    )

  let res = googleAuthCallback({
    request: new Request(
      "https://example.mock/api/auth/google/callback?code=MOCK_CODE",
    ),
  })

  await expect(res).rejects.toThrow("No email")
})
