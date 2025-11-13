import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addTodo } from "./addTodo"
import { useTodos } from "./useTodos"

export function useAddTodo() {
  let queryClient = useQueryClient()

  return useMutation({
    mutationFn: addTodo,
    onSuccess(newTodo) {
      queryClient.setQueryData(
        ["todos"],
        (oldTodos: ReturnType<typeof useTodos>["data"]) => {
          let newTodos = [...oldTodos]
          newTodos.push(newTodo)
          return newTodos
        },
      )
    },
  })
}
