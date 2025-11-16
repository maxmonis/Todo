import { AnimatePresence, motion } from "framer-motion"
import { TodoListItem } from "./TodoListItem"
import { useTodos } from "./useTodos"

export function TodoList() {
  let { data: todos } = useTodos()

  return (
    <motion.ul className="mb-5 space-y-2" layout>
      <AnimatePresence>
        {todos.map(todo => (
          <TodoListItem key={todo.id} todo={todo} />
        ))}
      </AnimatePresence>
    </motion.ul>
  )
}
