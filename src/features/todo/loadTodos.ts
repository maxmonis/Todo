import { createServerFn } from "@tanstack/react-start"
import { db } from "~/server/mongoose"
import { authMiddleware } from "../auth/authMiddleware"

export let loadTodos = createServerFn()
  .middleware([authMiddleware])
  .handler(async ({ context: { userId } }) => {
    let todos = await db.Todo.find({ userId }).lean()
    return todos.map(({ _id, checked = false, text }) => {
      return { checked, id: _id.toString(), text }
    })
  })
