import { createFileRoute } from "@tanstack/react-router"
import { googleAuth } from "~/features/auth/googleAuth"

export let Route = createFileRoute("/api/auth/google/")({
  server: { handlers: { GET: googleAuth } },
})
