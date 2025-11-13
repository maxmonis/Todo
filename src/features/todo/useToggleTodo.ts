import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toggleTodo } from "./toggleTodo"
import { useTodos } from "./useTodos"

export function useToggleTodo() {
  let queryClient = useQueryClient()

  return useMutation({
    mutationFn: toggleTodo,
    onSuccess(id) {
      queryClient.setQueryData(
        ["todos"],
        (oldTodos: ReturnType<typeof useTodos>["data"]) => {
          return oldTodos.map<(typeof oldTodos)[number]>(todo =>
            todo.id == id ? { ...todo, checked: !todo.checked } : todo,
          )
        },
      )
    },
  })
}
