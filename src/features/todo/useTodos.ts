import { useQuery } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import { db } from "~/server/mongoose"
import { authMiddleware } from "../auth/authMiddleware"

export function useTodos() {
  return useQuery({
    initialData: [],
    queryFn: getTodos,
    queryKey: ["todos"],
  })
}

let getTodos = createServerFn()
  .middleware([authMiddleware])
  .handler(async ({ context: { userId } }) => {
    let todos = await db.Todo.find({ userId }).lean()
    return todos.map(({ _id, checked = false, text }) => {
      return { checked, id: _id.toString(), text }
    })
  })
