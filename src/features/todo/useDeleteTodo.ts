import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteTodo } from "./deleteTodo"
import { useTodos } from "./useTodos"

export function useDeleteTodo(id: string) {
  let queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => deleteTodo({ data: id }),
    onSuccess(id) {
      queryClient.setQueryData(
        ["todos"],
        (oldTodos: ReturnType<typeof useTodos>["data"]) => {
          return oldTodos.filter(t => t.id != id)
        },
      )
    },
  })
}
