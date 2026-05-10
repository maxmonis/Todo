import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleTodo } from "./toggleTodo";
import type { useTodos } from "./useTodos";

export function useToggleTodo(todoId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => toggleTodo({ data: todoId }),
    onSuccess({ checked, id }) {
      queryClient.setQueryData<ReturnType<typeof useTodos>["data"]>(
        ["todos"],
        (oldTodos) =>
          oldTodos?.map((todo) =>
            todo.id === id ? { ...todo, checked } : todo,
          ),
      );
    },
  });
}
