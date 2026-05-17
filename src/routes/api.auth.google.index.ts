import { createFileRoute } from "@tanstack/react-router";
import { googleAuth } from "@/features/auth/server/googleAuth";

export const Route = createFileRoute("/api/auth/google/")({
  server: { handlers: { GET: googleAuth } },
});
