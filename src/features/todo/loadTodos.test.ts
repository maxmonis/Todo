import { expect, it, vi } from "vitest"
import { db } from "~/server/db"
import { mockCreateServerFn } from "~/test/mocks/mockCreateServerFn"
import { loadTodos } from "./loadTodos"

vi.mock("@tanstack/react-start", () => {
  return { createServerFn: mockCreateServerFn }
})

vi.mock("~/server/db")

vi.mock("../auth/authMiddleware", () => {
  return {
    authMiddleware: vi
      .fn()
      .mockReturnValue({ context: { userId: "mockUserId" } }),
  }
})

it("returns todos from DB", async () => {
  vi.mocked(db.Todo.find).mockReturnValueOnce({
    lean: vi.fn().mockResolvedValueOnce([
      { _id: "mockTodoId123", text: "Wash car" },
      { _id: "mockTodoId456", checked: true, text: "Buy groceries" },
    ]),
  } as any)

  let res = await loadTodos()

  expect(res).toEqual([
    { checked: false, id: "mockTodoId123", text: "Wash car" },
    { checked: true, id: "mockTodoId456", text: "Buy groceries" },
  ])
})
