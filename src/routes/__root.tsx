import type { QueryClient } from "@tanstack/react-query"
import {
  HeadContent,
  Link,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router"
import stylesheet from "../styles.css?url"

export let Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  errorComponent({ error, reset }) {
    return (
      <div>
        <h1 className="mb-3 text-2xl">Error</h1>
        <p>
          {error instanceof Error
            ? error.message
            : typeof error == "string"
              ? error
              : "Something went wrong"}
        </p>
        <button className="mt-3 rounded-lg border px-3 py-1" onClick={reset}>
          Try Again
        </button>
      </div>
    )
  },
  head() {
    return {
      links: [{ href: stylesheet, rel: "stylesheet" }],
      meta: [
        { charSet: "utf-8" },
        { content: "initial-scale=1, width=device-width", name: "viewport" },
        { title: "Todo App" },
      ],
    }
  },
  notFoundComponent() {
    return (
      <div>
        <h1 className="mb-3 text-2xl">404: Not Found</h1>
        <Link className="underline" replace to="/">
          Return Home
        </Link>
      </div>
    )
  },
  shellComponent({ children }) {
    return (
      <html lang="en">
        <head>
          <HeadContent />
        </head>
        <body
          className="min-h-screen bg-linear-to-br from-purple-950 via-purple-900 to-black p-5 text-white"
          style={{
            backgroundImage:
              "radial-gradient(50% 50% at 80% 20%, #3B021F 0%, #7B1028 60%, #1A000A 100%)",
          }}
        >
          {children}
          <Scripts />
        </body>
      </html>
    )
  },
})
