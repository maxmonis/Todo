import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleTodo } from "./toggleTodo";
import type { useTodos } from "./useTodos";

export function useToggleTodo(todoId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn() {
      return toggleTodo({
        data: todoId,
      });
    },

    onSuccess({ checked, id }) {
      queryClient.setQueryData(
        ["todos"],
        (oldTodos: ReturnType<typeof useTodos>["data"]) => {
          return oldTodos.map<(typeof oldTodos)[number]>((todo) =>
            todo.id === id
              ? {
                  ...todo,
                  checked,
                }
              : todo,
          );
        },
      );
    },
  });
}
