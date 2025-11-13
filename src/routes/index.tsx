import { createFileRoute } from "@tanstack/react-router"
import { LoadingSpinner } from "~/components/LoadingSpinner"
import { AuthButton } from "~/features/auth/AuthButton"
import { useAuth } from "~/features/auth/authContext"
import { TodoForm } from "~/features/todo/TodoForm"
import { TodoList } from "~/features/todo/TodoList"
import { useTodos } from "~/features/todo/useTodos"

export let Route = createFileRoute("/")({ component: HomePage })

function HomePage() {
  let { loading: loadingUser, user } = useAuth()
  let { isLoading: loadingTodos } = useTodos()

  return (
    <div className="flex min-h-screen items-center justify-center overflow-auto py-20">
      <div className="w-full max-w-150 rounded-xl border-2 border-black/10 bg-black/50 p-5 shadow-xl backdrop-blur-md">
        <h1 className="mb-3 text-2xl">Todos</h1>
        {loadingUser || loadingTodos ? (
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
  )
}
