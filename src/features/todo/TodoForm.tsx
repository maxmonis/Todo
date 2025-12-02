import { useState } from "react";
import { useAddTodo } from "./useAddTodo";

export function TodoForm() {
  const { mutate: addTodo } = useAddTodo();

  const [text, setText] = useState("");

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        addTodo({
          data: text,
        });
        setText("");
      }}
    >
      <input
        className="w-full rounded-lg border border-white/20 bg-white/10 px-5 py-3 placeholder-white/60 backdrop-blur-sm focus:border-transparent focus:ring-2 focus:ring-blue-400 focus:outline-none"
        onChange={(e) => {
          setText(e.target.value);
        }}
        placeholder="Enter a new todo..."
        value={text}
      />
      <button
        className="rounded-lg bg-blue-500 px-5 py-3 font-bold transition-colors hover:bg-blue-600 disabled:bg-blue-500/50"
        disabled={text.trim().length === 0}
        type="submit"
      >
        Add Todo
      </button>
    </form>
  );
}
