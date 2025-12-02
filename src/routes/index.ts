import { createFileRoute } from "@tanstack/react-router";
import { TodoApp } from "@/features/todo/TodoApp";

export const Route = createFileRoute("/")({
  component: TodoApp,
});
