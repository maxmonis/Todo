import { motion } from "framer-motion";
import { useDeleteTodo } from "./useDeleteTodo";
import { useToggleTodo } from "./useToggleTodo";
import type { useTodos } from "./useTodos";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/Checkbox";

interface Props {
  todo: ReturnType<typeof useTodos>["data"][number];
}

export function TodoListItem({ todo: { checked, id, text } }: Props) {
  const { isPending: deleting, mutate: deleteTodo } = useDeleteTodo(id);
  const { isPending: toggling, mutate: toggleTodo } = useToggleTodo(id);

  const mutating = deleting || toggling;

  return (
    <motion.li
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="flex justify-between gap-5 rounded-lg border border-white/20 bg-white/10 px-5 py-3 shadow-md backdrop-blur-sm"
      exit={{
        opacity: 0,
        y: 20,
      }}
      initial={{
        opacity: 0,
        y: -20,
      }}
      layout
      transition={{
        duration: 0.2,
        ease: "easeOut",
      }}
    >
      <Checkbox
        checked={checked}
        className={cn(checked && "line-through")}
        label={text}
        loading={mutating}
        onChange={() => {
          toggleTodo();
        }}
      />
      <button
        className="text-red-500"
        disabled={mutating}
        onClick={() => {
          deleteTodo();
        }}
      >
        Delete
      </button>
    </motion.li>
  );
}
