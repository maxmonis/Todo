import { render } from "@testing-library/react"
import { it, vi } from "vitest"
import { MockLink } from "~/test/mocks/MockLink"
import { NotFoundComponent } from "./NotFoundComponent"

vi.mock("@tanstack/react-router", () => {
  return { Link: MockLink }
})

it("renders", () => {
  render(<NotFoundComponent />)
})
