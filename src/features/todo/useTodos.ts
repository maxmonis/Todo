import { useQuery } from "@tanstack/react-query"
import { useAuth } from "../auth/useAuth"
import { loadTodos } from "./loadTodos"

export function useTodos() {
  let { user } = useAuth()

  return useQuery({
    enabled: Boolean(user),
    initialData: [],
    queryFn: loadTodos,
    queryKey: ["todos"],
  })
}
