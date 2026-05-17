import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { AuthProvider } from "./features/auth/context/AuthProvider";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: 5 * 60 * 1000 } },
  });

  const router = createRouter({
    context: { ...{ queryClient } },
    defaultPreload: "intent",
    routeTree,
    Wrap({ children }: React.PropsWithChildren) {
      return (
        <QueryClientProvider client={queryClient}>
          <AuthProvider>{children}</AuthProvider>
        </QueryClientProvider>
      );
    },
  });

  setupRouterSsrQueryIntegration({ queryClient, router });

  return router;
}
