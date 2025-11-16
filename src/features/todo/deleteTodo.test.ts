import mongoose from "mongoose"
import { expect, it, vi } from "vitest"
import { db } from "~/server/db"
import { mockCreateServerFn } from "~/test/mocks/mockCreateServerFn"
import { deleteTodo } from "./deleteTodo"

let mockTodoId = new mongoose.Types.ObjectId().toString()

vi.mock("@tanstack/react-start", () => {
  return { createServerFn: mockCreateServerFn }
})

vi.mock("~/server/db")

vi.mock("../auth/authMiddleware", () => {
  return { authMiddleware: vi.fn().mockReturnValue({ userId: "mockUserId" }) }
})

it("rejects invalid objectId", async () => {
  let res = deleteTodo({ data: "not-a-valid-object-id" })

  await expect(res).rejects.toThrow()
})

it("throws if not found", async () => {
  vi.mocked(db.Todo.findById).mockResolvedValueOnce(null)

  let res = deleteTodo({ data: mockTodoId })

  await expect(res).rejects.toThrow("Not found")
})

it("throws if userId does not match", async () => {
  vi.mocked(db.Todo.findById).mockResolvedValueOnce({
    userId: "not-the-matching-user-id",
  })

  let res = deleteTodo({ data: mockTodoId })

  await expect(res).rejects.toThrow("Not authorized")
})

it("deletes todo and returns ID", async () => {
  let deleteOneSpy = vi.fn()

  vi.mocked(db.Todo.findById).mockResolvedValueOnce({
    deleteOne: deleteOneSpy,
    userId: "mockUserId",
  })

  let res = await deleteTodo({ data: mockTodoId })

  expect(res).toBe(mockTodoId)
  expect(deleteOneSpy).toHaveBeenCalledOnce()
})
