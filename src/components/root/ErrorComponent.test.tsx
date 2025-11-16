import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { ErrorComponent } from "./ErrorComponent"

describe("ErrorComponent", () => {
  it("handles Error", () => {
    render(<ErrorComponent error={Error("Error error")} reset={vi.fn()} />)

    screen.getByText("Error error")
  })

  it("handles string", () => {
    render(<ErrorComponent error={"String error"} reset={vi.fn()} />)

    screen.getByText("String error")
  })

  it("handles unknown", () => {
    render(<ErrorComponent error={null} reset={vi.fn()} />)

    expect(screen.getByText("Something went wrong"))
  })

  it("calls reset when button clicked", () => {
    let resetSpy = vi.fn()

    render(<ErrorComponent error={"Test error"} reset={resetSpy} />)

    fireEvent.click(screen.getByRole("button", { name: "Try Again" }))

    expect(resetSpy).toHaveBeenCalledOnce()
  })
})
