import { redirect } from "@tanstack/react-router"
import { expect, it, vi } from "vitest"
import { db } from "~/server/db"
import { googleAuthCallback } from "./googleAuthCallback"
import { useAuthSession } from "./useAuthSession"

vi.mock("@tanstack/react-router")

vi.mock("~/server/db")

vi.mock("./useAuthSession")

it("throws redirect if no code", async () => {
  vi.mocked(redirect).mockImplementationOnce(vi.fn(args => args))

  let res = googleAuthCallback({
    request: new Request("https://base-url.mock/api/auth/google/callback"),
  })

  await expect(res).rejects.toEqual({ href: "https://base-url.mock" })
  expect(redirect).toHaveBeenCalledOnce()
})

it("exchanges code, creates session, and redirects", async () => {
  let updateSpy = vi.fn()

  let fetchSpy = vi
    .spyOn(global, "fetch")
    .mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ access_token: "mock_access_token" }),
      } as any),
    )
    .mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ email: "valid@email.mock" }),
      } as any),
    )

  vi.mocked(db.User.findOne).mockResolvedValueOnce(null)
  vi.mocked(db.User.create).mockResolvedValueOnce({
    _id: "mockUserId",
    email: "valid@email.mock",
  } as any)

  vi.mocked(useAuthSession).mockResolvedValueOnce({
    clear: vi.fn(),
    data: {},
    id: undefined,
    update: updateSpy,
  })
  vi.mocked(redirect).mockImplementationOnce(
    vi.fn().mockImplementationOnce(req => {
      expect(new URL(req.href).origin).toBe("https://base-url.mock")
    }),
  )

  await googleAuthCallback({
    request: new Request(
      "https://base-url.mock/api/auth/google/callback?code=mock_code",
    ),
  })

  expect(fetchSpy).toHaveBeenCalledTimes(2)
  expect(db.User.findOne).toHaveBeenCalledExactlyOnceWith({
    email: "valid@email.mock",
  })
  expect(db.User.create).toHaveBeenCalledExactlyOnceWith({
    email: "valid@email.mock",
  })
  expect(updateSpy).toHaveBeenCalledExactlyOnceWith({
    email: "valid@email.mock",
    userId: "mockUserId",
  })
  expect(redirect).toHaveBeenCalledOnce()
})

it("uses existing user if found", async () => {
  let updateSpy = vi.fn()

  vi.spyOn(global, "fetch")
    .mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ access_token: "mock_access_token" }),
      } as any),
    )
    .mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ email: "valid@email.mock" }),
      } as any),
    )

  vi.mocked(db.User.findOne).mockResolvedValueOnce({
    _id: "mockUserId",
    email: "valid@email.mock",
  })
  vi.mocked(useAuthSession).mockResolvedValueOnce({
    update: updateSpy,
  } as any)
  vi.mocked(redirect).mockImplementationOnce(
    vi.fn().mockImplementationOnce(req => {
      expect(new URL(req.href).origin).toBe("https://base-url.mock")
    }),
  )

  await googleAuthCallback({
    request: new Request(
      "https://base-url.mock/api/auth/google/callback?code=mock_code",
    ),
  })

  expect(db.User.create).not.toHaveBeenCalled()
  expect(updateSpy).toHaveBeenCalledExactlyOnceWith({
    email: "valid@email.mock",
    userId: "mockUserId",
  })
  expect(redirect).toHaveBeenCalledOnce()
})

it("throws if access_token missing", async () => {
  vi.spyOn(global, "fetch").mockResolvedValueOnce({
    json: () => Promise.resolve({}),
  } as any)

  let res = googleAuthCallback({
    request: new Request(
      "https://base-url.mock/api/auth/google/callback?code=mock_code",
    ),
  })

  await expect(res).rejects.toThrow("No access token")
})

it("throws if email missing", async () => {
  vi.spyOn(global, "fetch")
    .mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ access_token: "mock_access_token" }),
      } as any),
    )
    .mockImplementationOnce(() =>
      Promise.resolve({ json: () => Promise.resolve({}) } as any),
    )

  let res = googleAuthCallback({
    request: new Request(
      "https://base-url.mock/api/auth/google/callback?code=mock_code",
    ),
  })

  await expect(res).rejects.toThrow("No email")
})
