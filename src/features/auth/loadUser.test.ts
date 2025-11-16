import mongoose from "mongoose"
import { expect, it, vi } from "vitest"
import { db } from "~/server/db"
import { mockCreateServerFn } from "~/test/helpers/mockCreateServerFn"
import { loadUser } from "./loadUser"
import { useAuthSession } from "./useAuthSession"

let mockUserId = new mongoose.Types.ObjectId().toString()

vi.mock("@tanstack/react-start", () => {
  return { createServerFn: mockCreateServerFn }
})

vi.mock("~/server/db")

vi.mock("./useAuthSession")

it("returns null if no session exists", async () => {
  vi.mocked(useAuthSession).mockResolvedValueOnce({
    clear: vi.fn(),
    data: {},
    id: "mockid",
    update: vi.fn(),
  })

  let res = await loadUser()

  expect(res).toBeNull()
})

it("clears session and returns null if user ID invalid", async () => {
  let clearSpy = vi.fn()

  vi.mocked(useAuthSession).mockResolvedValueOnce({
    clear: clearSpy,
    data: { userId: "invalid" },
    id: "mockid",
    update: vi.fn(),
  })

  let res = await loadUser()

  expect(res).toBeNull()
  expect(clearSpy).toHaveBeenCalledOnce()
})

it("clears session and returns null if user not found", async () => {
  let clearSpy = vi.fn()

  vi.mocked(useAuthSession).mockResolvedValueOnce({
    clear: clearSpy,
    data: { userId: mockUserId },
    id: "mockid",
    update: vi.fn(),
  })
  vi.mocked(db.User.findById).mockResolvedValueOnce(null)

  let res = await loadUser()

  expect(res).toBeNull()
  expect(db.User.findById).toHaveBeenCalledExactlyOnceWith(mockUserId)
  expect(clearSpy).toHaveBeenCalledOnce()
})

it("updates session and returns user if found", async () => {
  let updateSpy = vi.fn()

  vi.mocked(useAuthSession).mockResolvedValueOnce({
    clear: vi.fn(),
    data: { userId: mockUserId },
    id: "mockid",
    update: updateSpy,
  })
  vi.mocked(db.User.findById).mockResolvedValueOnce({
    email: "mock@valid.email",
  })

  let res = await loadUser()

  expect(res).toEqual({ email: "mock@valid.email" })
  expect(updateSpy).toHaveBeenCalledExactlyOnceWith({
    email: "mock@valid.email",
    userId: mockUserId,
  })
})
