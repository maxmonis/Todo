import { Checkbox } from "~/components/Checkbox"
import { cn } from "~/lib/utils"
import { useDeleteTodo } from "./useDeleteTodo"
import { useTodos } from "./useTodos"
import { useToggleTodo } from "./useToggleTodo"

export function TodoList() {
  let { data: todos } = useTodos()
  let { mutate: deleteTodo } = useDeleteTodo()
  let { mutate: toggleTodo } = useToggleTodo()

  return (
    <ul className="mb-5 space-y-2">
      {todos.map(({ checked, id, text }) => (
        <li
          className="flex justify-between gap-5 rounded-lg border border-white/20 bg-white/10 px-5 py-3 shadow-md backdrop-blur-sm"
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
