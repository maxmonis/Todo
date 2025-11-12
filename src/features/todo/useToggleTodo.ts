import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import { isValidObjectId } from "mongoose"
import z from "zod"
import { db } from "~/server/mongoose"
import { authMiddleware } from "../auth/authMiddleware"
import { useTodos } from "./useTodos"

export function useToggleTodo() {
  let queryClient = useQueryClient()
  return useMutation({
    mutationFn: toggleTodo,
    onSuccess(id) {
      queryClient.setQueryData(
        ["todos"],
        (oldTodos: ReturnType<typeof useTodos>["data"]) => {
          return oldTodos.map(todo =>
            todo.id == id ? { ...todo, checked: !todo.checked } : todo,
          )
        },
      )
    },
  })
}

let toggleTodo = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(z.string().refine(id => isValidObjectId(id)))
  .handler(async ({ context: { userId }, data: id }) => {
    let doc = await db.Todo.findById(id)
    if (!doc) throw "Not found"

    if (doc.userId.toString() != userId) throw "Not authorized"

    doc.checked = !doc.checked
    await doc.save()
    return id
  })
