import { expect, it, vi } from "vitest"
import { db } from "~/server/db"
import { mockCreateServerFn } from "~/test/mocks/mockCreateServerFn"
import { addTodo } from "./addTodo"

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

it("saves the new todo and returns it", async () => {
  vi.mocked(db.Todo.create).mockImplementationOnce((args: any) => {
    return Promise.resolve({ ...args, _id: "mockid" })
  })

  let res = await addTodo({ data: "Fix faucet" })

  expect(res).toEqual({ checked: false, id: "mockid", text: "Fix faucet" })
})
