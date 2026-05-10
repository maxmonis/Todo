import { useQueryClient } from "@tanstack/react-query";
import { AuthButton } from "../auth/AuthButton";
import { useAuth } from "../auth/useAuth";
import { TodoList } from "./TodoList";
import { TodoForm } from "./TodoForm";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export function TodoApp() {
  const queryClient = useQueryClient();

  const { loading, user } = useAuth();

  if (user) {
    queryClient.setQueryData(["todos"], user.todos);
  }

  return (
    <div className="flex min-h-screen items-center justify-center overflow-auto py-20">
      <div className="w-full max-w-150 rounded-xl border-2 border-black/10 bg-black/50 p-5 shadow-xl backdrop-blur-md">
        <h1 className="mb-3 text-2xl">Todos</h1>
        {loading ? (
          <LoadingSpinner />
        ) : user ? (
          <div className="mb-5">
            <TodoList />
            <TodoForm />
          </div>
        ) : (
          <p className="mb-2">Please log in to use this feature</p>
        )}
        <AuthButton />
      </div>
    </div>
  );
}
