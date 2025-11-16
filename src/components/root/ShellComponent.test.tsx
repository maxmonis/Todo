import { render } from "@testing-library/react"
import { it, vi } from "vitest"
import { ShellComponent } from "./ShellComponent"

vi.mock("@tanstack/react-router")

it("renders", () => {
  let errorSpy = vi.spyOn(console, "error").mockImplementationOnce(() => {})

  render(<ShellComponent />)

  errorSpy.mockClear()
})
