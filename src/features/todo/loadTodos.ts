import { createServerFn } from "@tanstack/react-start"
import { db } from "~/server/db"
import { authMiddleware } from "../auth/authMiddleware"

export let loadTodos = createServerFn()
  .middleware([authMiddleware])
  .handler(async ({ context: { userId } }) => {
    let docs = await db.Todo.find({ userId }).lean()

    let todos = docs.map(({ _id, checked = false, text }) => {
      return { checked, id: _id.toString(), text }
    })

    return todos
  })
