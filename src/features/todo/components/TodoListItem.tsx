import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/Checkbox";
import { cn } from "@/lib/utils";
import { useDeleteTodo } from "../hooks/useDeleteTodo";
import type { useTodos } from "../hooks/useTodos";
import { useToggleTodo } from "../hooks/useToggleTodo";

interface Props {
  todo: ReturnType<typeof useTodos>["data"][number];
}

export function TodoListItem(props: Props) {
  const {
    todo: { checked, id, text },
  } = props;

  const { isPending: isDeleting, mutate: deleteTodo } = useDeleteTodo(id);
  const { isPending: isToggling, mutate: toggleTodo } = useToggleTodo(id);

  const isMutating = isDeleting || isToggling;

  const onCheckboxChange = () => {
    toggleTodo();
  };

  const onDeleteClick = () => {
    deleteTodo();
  };

  return (
    <motion.li
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-between gap-5 rounded-lg border border-white/20 bg-white/10 px-5 py-3 shadow-md backdrop-blur-sm"
      exit={{ opacity: 0, y: 20 }}
      initial={{ opacity: 0, y: -20 }}
      layout
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Checkbox
        checked={checked}
        className={cn(checked && "line-through")}
        label={text}
        loading={isMutating}
        onChange={onCheckboxChange}
      />
      <button
        className="text-red-500"
        disabled={isMutating}
        onClick={onDeleteClick}
      >
        Delete
      </button>
    </motion.li>
  );
}
