import { TodoListItem } from "./TodoListItem"
import { useTodos } from "./useTodos"

export function TodoList() {
  let { data: todos } = useTodos()

  return (
    <ul className="mb-5 space-y-2">
      {todos.map(todo => (
        <TodoListItem key={todo.id} todo={todo} />
      ))}
    </ul>
  )
}
