import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createRouter } from "@tanstack/react-router"
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query"
import { AuthProvider } from "./features/auth/AuthProvider"
import { routeTree } from "./routeTree.gen"

export function getRouter() {
  let queryClient = new QueryClient()

  let router = createRouter({
    context: { ...{ queryClient } },
    defaultPreload: "intent",
    routeTree,
    Wrap({ children }: React.PropsWithChildren) {
      return (
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </AuthProvider>
      )
    },
  })

  setupRouterSsrQueryIntegration({ queryClient, router })

  return router
}
