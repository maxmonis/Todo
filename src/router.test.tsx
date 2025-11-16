import { render, screen } from "@testing-library/react"
import { it, vi } from "vitest"
import { getRouter } from "./router"

let mocks = vi.hoisted(() => {
  return { createRouter: vi.fn(opts => ({ ...opts, mockRouter: true })) }
})

vi.mock("@tanstack/react-query", async () => {
  let actual = await vi.importActual("@tanstack/react-query")
  return {
    ...actual,
    QueryClientProvider: vi.fn(({ children }: React.PropsWithChildren) => (
      <div data-testid="query">{children}</div>
    )),
  }
})

vi.mock("@tanstack/react-router", async () => {
  let actual = await vi.importActual("@tanstack/react-router")
  return { ...actual, createRouter: mocks.createRouter }
})

vi.mock("@tanstack/react-router-ssr-query")

vi.mock("./features/auth/AuthProvider", () => {
  return {
    AuthProvider: vi.fn(({ children }: React.PropsWithChildren) => (
      <div data-testid="auth">{children}</div>
    )),
  }
})

it("Wrap calls both providers and renders children", () => {
  getRouter()

  let { Wrap } = mocks.createRouter.mock.calls[0]![0]!

  render(
    <Wrap>
      <div data-testid="child"></div>
    </Wrap>,
  )

  screen.getByTestId("auth")
  screen.getByTestId("query")
  screen.getByTestId("child")
})
