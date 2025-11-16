import mongoose from "mongoose"
import { expect, it, vi } from "vitest"
import { authMiddleware } from "./authMiddleware"
import { useAuthSession } from "./useAuthSession"

let mockUserId = new mongoose.Types.ObjectId().toString()

vi.mock("@tanstack/react-start", () => {
  return {
    createMiddleware: vi.fn(() => {
      return { server: vi.fn((handler: Function) => handler) }
    }),
  }
})

vi.mock("./useAuthSession")

it("calls next if session valid", async () => {
  let nextSpy = vi.fn()

  vi.mocked(useAuthSession).mockResolvedValueOnce({
    clear: vi.fn(),
    data: { email: "mock@valid.email", userId: mockUserId },
    id: "mockid",
    update: vi.fn(),
  })

  // @ts-expect-error
  await authMiddleware({ next: nextSpy })

  expect(nextSpy).toHaveBeenCalledExactlyOnceWith({
    context: { email: "mock@valid.email", userId: mockUserId },
  })
})

it("throws if email missing", async () => {
  vi.mocked(useAuthSession).mockResolvedValueOnce({
    clear: vi.fn(),
    data: { userId: mockUserId },
    id: "mockid",
    update: vi.fn(),
  })

  // @ts-expect-error
  let res = authMiddleware({ next: vi.fn() })

  await expect(res).rejects.toThrowError("Not authorized")
})

it("throws if user ID missing", async () => {
  vi.mocked(useAuthSession).mockResolvedValueOnce({
    clear: vi.fn(),
    data: { email: "mock@valid.email" },
    id: "mockid",
    update: vi.fn(),
  })

  // @ts-expect-error
  let res = authMiddleware({ next: vi.fn() })

  await expect(res).rejects.toThrowError("Not authorized")
})

it("throws if user ID invalid", async () => {
  vi.mocked(useAuthSession).mockResolvedValueOnce({
    clear: vi.fn(),
    data: { email: "mock@valid.email", userId: "invalid" },
    id: "mockid",
    update: vi.fn(),
  })

  // @ts-expect-error
  let res = authMiddleware({ next: vi.fn() })

  await expect(res).rejects.toThrowError("Not authorized")
})
