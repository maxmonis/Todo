import { AuthButton } from "@/features/auth/components/AuthButton";
import { TodoApp } from "./TodoApp";

export function TodoPage() {
  return (
    <div className="flex min-h-screen items-center justify-center overflow-auto p-5">
      <div className="w-full max-w-150 rounded-xl border-2 border-black/10 bg-black/50 p-5 shadow-xl backdrop-blur-md">
        <h1 className="mb-3 text-2xl">Todos</h1>
        <TodoApp />
        <AuthButton />
      </div>
    </div>
  );
}
