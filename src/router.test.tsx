import { render, screen, within } from "@testing-library/react";
import { it, vi } from "vitest";
import { getRouter } from "./router";

const mocks = vi.hoisted(() => {
  return {
    createRouter: vi.fn(),
  };
});

vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual("@tanstack/react-query");
  return {
    ...actual,
    QueryClientProvider: vi.fn(({ children }: React.PropsWithChildren) => (
      <div data-testid="query">{children}</div>
    )),
  };
});

vi.mock("@tanstack/react-router", async () => {
  const actual = await vi.importActual("@tanstack/react-router");
  return {
    ...actual,
    createRouter: mocks.createRouter,
  };
});

vi.mock("@tanstack/react-router-ssr-query");

vi.mock("./features/auth/AuthProvider", () => {
  return {
    AuthProvider: vi.fn(({ children }: React.PropsWithChildren) => (
      <div data-testid="auth">{children}</div>
    )),
  };
});

it("Wrap calls both providers and renders children", () => {
  getRouter();

  const { Wrap } = mocks.createRouter.mock.calls[0]![0]!;

  render(
    <Wrap>
      <div data-testid="child"></div>
    </Wrap>,
  );

  within(within(screen.getByTestId("auth")).getByTestId("query")).getByTestId(
    "child",
  );
});
