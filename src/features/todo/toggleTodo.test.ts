import mongoose from "mongoose"
import { expect, it, vi } from "vitest"
import { db } from "~/server/db"
import { mockCreateServerFn } from "~/test/helpers/mockCreateServerFn"
import { toggleTodo } from "./toggleTodo"

let mockTodoId = new mongoose.Types.ObjectId().toString()

vi.mock("@tanstack/react-start", () => {
  return { createServerFn: mockCreateServerFn }
})

vi.mock("~/server/db")

vi.mock("../auth/authMiddleware", () => {
  return { authMiddleware: vi.fn().mockReturnValue({ userId: "mockUserId" }) }
})

it("rejects invalid objectId", async () => {
  let res = toggleTodo({ data: "not-a-valid-object-id" })

  await expect(res).rejects.toThrow()
})

it("throws if not found", async () => {
  vi.mocked(db.Todo.findById).mockResolvedValueOnce(null)

  let res = toggleTodo({ data: mockTodoId })

  await expect(res).rejects.toThrow("Not found")
})

it("throws if userId does not match", async () => {
  vi.mocked(db.Todo.findById).mockResolvedValueOnce({
    userId: "not-the-matching-user-id",
  })

  let res = toggleTodo({ data: mockTodoId })

  await expect(res).rejects.toThrow("Not authorized")
})

it("toggles todo then returns ID and status", async () => {
  let saveSpy = vi.fn()

  vi.mocked(db.Todo.findById).mockResolvedValueOnce({
    checked: true,
    save: saveSpy,
    userId: "mockUserId",
  })

  let res = await toggleTodo({ data: mockTodoId })

  expect(res).toEqual({ checked: false, id: mockTodoId })
  expect(saveSpy).toHaveBeenCalledOnce()
})
