import { AnimatePresence, motion } from "framer-motion";
import { useTodos } from "../hooks/useTodos";
import { TodoListItem } from "./TodoListItem";

export function TodoList() {
  const { data: todos } = useTodos();

  return (
    <motion.ul className="mb-5 space-y-2" layout>
      <AnimatePresence>
        {todos.map((todo) => (
          <TodoListItem key={todo.id} todo={todo} />
        ))}
      </AnimatePresence>
    </motion.ul>
  );
}
