import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTodo } from "./deleteTodo";
import type { useTodos } from "./useTodos";

export function useDeleteTodo(todoId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn() {
      return deleteTodo({
        data: todoId,
      });
    },

    onSuccess(id) {
      queryClient.setQueryData(
        ["todos"],
        (oldTodos: ReturnType<typeof useTodos>["data"]) => {
          return oldTodos.filter((t) => t.id !== id);
        },
      );
    },
  });
}
