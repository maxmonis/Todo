import { createFileRoute } from "@tanstack/react-router"
import { TodoApp } from "~/features/todo/TodoApp"

export let Route = createFileRoute("/")({ component: TodoApp })
