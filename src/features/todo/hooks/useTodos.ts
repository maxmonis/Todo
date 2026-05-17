import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/context/useAuth";
import { loadTodos } from "../server/loadTodos";

export function useTodos() {
  const { user } = useAuth();

  return useQuery({
    enabled: Boolean(user),
    initialData: [],
    queryFn: loadTodos,
    queryKey: ["todos"],
  });
}
