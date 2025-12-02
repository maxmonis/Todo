import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTodo } from "./addTodo";
import type { useTodos } from "./useTodos";

export function useAddTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addTodo,
    onSuccess(todo) {
      queryClient.setQueryData(
        ["todos"],
        (oldTodos: ReturnType<typeof useTodos>["data"]) => {
          const newTodos = [...oldTodos];
          newTodos.push(todo);
          return newTodos;
        },
      );
    },
  });
}
