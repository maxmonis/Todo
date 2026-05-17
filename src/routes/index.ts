import { createFileRoute } from "@tanstack/react-router";
import { TodoPage } from "@/features/todo/components/TodoPage";

export const Route = createFileRoute("/")({ component: TodoPage });
