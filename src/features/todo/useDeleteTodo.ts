import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTodo } from "./deleteTodo";
import type { useTodos } from "./useTodos";

export function useDeleteTodo(todoId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteTodo({ data: todoId }),
    onSuccess(id) {
      queryClient.setQueryData<ReturnType<typeof useTodos>["data"]>(
        ["todos"],
        (oldTodos) => oldTodos?.filter((t) => t.id !== id),
      );
    },
  });
}
