import { render, screen } from "@testing-library/react"
import { expect, it, vi } from "vitest"
import { Checkbox } from "./Checkbox"

it("displays loading state", () => {
  render(<Checkbox checked label="mock label" loading onChange={vi.fn()} />)

  let checkbox = screen.getByLabelText("mock label")

  expect(checkbox.getAttribute("aria-checked")).toBe("mixed")
  expect(checkbox).toBeDisabled()
})
