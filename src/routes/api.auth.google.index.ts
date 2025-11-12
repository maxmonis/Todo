import { createFileRoute, redirect } from "@tanstack/react-router"

export let Route = createFileRoute("/api/auth/google/")({
  server: {
    handlers: {
      GET({ request }) {
        let next = new URL(request.url).searchParams.get("next")
        let state = next ? JSON.stringify({ next }) : null

        return redirect({
          href: `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams(
            {
              access_type: "offline",
              client_id: process.env.GOOGLE_CLIENT_ID!,
              redirect_uri: `${process.env.VITE_BASE_URL}/api/auth/google/callback`,
              response_type: "code",
              scope: "email",
              ...(state ? { state } : {}),
            },
          )}`,
        })
      },
    },
  },
})
