import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { Checkbox } from "~/components/ui/Checkbox"
import { LoadingSpinner } from "~/components/ui/LoadingSpinner"
import { AuthButton } from "~/features/auth/AuthButton"
import { useAuth } from "~/features/auth/authContext"
import { useAddTodo } from "~/features/todo/useAddTodo"
import { useDeleteTodo } from "~/features/todo/useDeleteTodo"
import { useTodos } from "~/features/todo/useTodos"
import { useToggleTodo } from "~/features/todo/useToggleTodo"
import { cn } from "~/lib/dom"

export let Route = createFileRoute("/")({ component: HomePage })

function HomePage() {
  let { loading: loadingUser, user } = useAuth()
  let { isLoading: loadingTodos } = useTodos()

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-linear-to-br from-red-900 via-red-800 to-black p-4 text-white"
      style={{
        backgroundImage:
          "radial-gradient(50% 50% at 80% 20%, #3B021F 0%, #7B1028 60%, #1A000A 100%)",
      }}
    >
      <div className="w-full max-w-2xl rounded-xl border-8 border-black/10 bg-black/50 p-8 shadow-xl backdrop-blur-md">
        <h1 className="mb-4 text-2xl">Todos</h1>
        {loadingUser || loadingTodos ? (
          <LoadingSpinner />
        ) : user ? (
          <>
            <TodoList />
            <TodoForm />
          </>
        ) : (
          <p className="mb-2">Please log in to use this feature</p>
        )}
        <AuthButton />
      </div>
    </div>
  )
}

function TodoList() {
  let { data: todos } = useTodos()
  let { mutate: deleteTodo } = useDeleteTodo()
  let { mutate: toggleTodo } = useToggleTodo()

  return (
    <ul className="mb-4 space-y-2">
      {todos.map(({ checked, id, text }) => (
        <li
          className="flex justify-between gap-5 rounded-lg border border-white/20 bg-white/10 p-3 shadow-md backdrop-blur-sm"
          key={id}
        >
          <Checkbox
            checked={checked}
            className={cn(checked && "line-through")}
            label={text}
            onChange={() => {
              toggleTodo({ data: id })
            }}
          />
          <button
            className="text-red-500"
            onClick={() => {
              deleteTodo({ data: id })
            }}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  )
}

function TodoForm() {
  let { mutate: addTodo } = useAddTodo()
  let [todo, setTodo] = useState("")

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={e => {
        e.preventDefault()
        addTodo({ data: todo })
        setTodo("")
      }}
    >
      <input
        className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/60 backdrop-blur-sm focus:border-transparent focus:ring-2 focus:ring-blue-400 focus:outline-none"
        onChange={e => {
          setTodo(e.target.value)
        }}
        placeholder="Enter a new todo..."
        value={todo}
      />
      <button
        className="rounded-lg bg-blue-500 px-4 py-3 font-bold text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-500/50"
        disabled={todo.trim().length == 0}
        type="submit"
      >
        Add todo
      </button>
    </form>
  )
}
