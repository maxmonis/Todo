import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toggleTodo } from "./toggleTodo"
import { useTodos } from "./useTodos"

export function useToggleTodo(id: string) {
  let queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => toggleTodo({ data: id }),
    onSuccess({ checked, id }) {
      queryClient.setQueryData(
        ["todos"],
        (oldTodos: ReturnType<typeof useTodos>["data"]) => {
          return oldTodos.map<(typeof oldTodos)[number]>(todo =>
            todo.id == id ? { ...todo, checked } : todo,
          )
        },
      )
    },
  })
}
