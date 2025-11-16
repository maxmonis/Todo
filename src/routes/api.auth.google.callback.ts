import { createFileRoute } from "@tanstack/react-router"
import { googleAuthCallback } from "~/features/auth/googleAuthCallback"

export let Route = createFileRoute("/api/auth/google/callback")({
  server: { handlers: { GET: googleAuthCallback } },
})
