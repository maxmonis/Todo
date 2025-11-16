import type { QueryClient } from "@tanstack/react-query"
import { createRootRouteWithContext } from "@tanstack/react-router"
import { ErrorComponent } from "~/components/root/ErrorComponent"
import { NotFoundComponent } from "~/components/root/NotFoundComponent"
import { ShellComponent } from "~/components/root/ShellComponent"
import stylesheet from "~/styles.css?url"

export let Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  errorComponent: ErrorComponent,
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
  notFoundComponent: NotFoundComponent,
  shellComponent: ShellComponent,
})
