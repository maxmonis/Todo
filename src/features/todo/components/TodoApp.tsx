import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/features/auth/context/useAuth";
import { TodoForm } from "./TodoForm";
import { TodoList } from "./TodoList";

export function TodoApp() {
  const { loading, user } = useAuth();

  if (loading) return <LoadingSpinner />;

  if (!user) return <p className="mb-2">Please log in to use this feature</p>;

  return (
    <div className="mb-5">
      <TodoList />
      <TodoForm />
    </div>
  );
}
