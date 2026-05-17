import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTodo } from "../server/addTodo";
import type { useTodos } from "./useTodos";

export function useAddTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addTodo,

    onSuccess(newTodo) {
      queryClient.setQueryData<ReturnType<typeof useTodos>["data"]>(
        ["todos"],
        (oldTodos) => {
          if (oldTodos) return [...oldTodos, newTodo];
        },
      );
    },
  });
}
