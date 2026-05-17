import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { afterEach, beforeEach } from "vitest";
import { AuthProvider } from "@/features/auth/context/AuthProvider";

let queryClient: QueryClient;

beforeEach(() => {
  queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: 5 * 60 * 1000 } },
  });
});

afterEach(() => {
  queryClient.clear();
});

export function renderWithProviders(element: React.ReactElement) {
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{element}</AuthProvider>
    </QueryClientProvider>,
  );
}
