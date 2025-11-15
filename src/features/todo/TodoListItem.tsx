import { Checkbox } from "~/components/ui/Checkbox"
import { cn } from "~/lib/utils"
import { useDeleteTodo } from "./useDeleteTodo"
import { useTodos } from "./useTodos"
import { useToggleTodo } from "./useToggleTodo"

export function TodoListItem({
  todo: { checked, id, text },
}: {
  todo: ReturnType<typeof useTodos>["data"][number]
}) {
  let { isPending: deleting, mutate: deleteTodo } = useDeleteTodo(id)
  let { isPending: toggling, mutate: toggleTodo } = useToggleTodo(id)

  let mutating = deleting || toggling

  return (
    <li className="flex justify-between gap-5 rounded-lg border border-white/20 bg-white/10 px-5 py-3 shadow-md backdrop-blur-sm">
      <Checkbox
        checked={checked}
        className={cn(checked && "line-through")}
        label={text}
        loading={mutating}
        onChange={() => {
          toggleTodo()
        }}
      />
      <button
        className="text-red-500"
        disabled={mutating}
        onClick={() => {
          deleteTodo()
        }}
      >
        Delete
      </button>
    </li>
  )
}
