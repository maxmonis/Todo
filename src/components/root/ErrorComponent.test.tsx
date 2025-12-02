import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ErrorComponent } from "./ErrorComponent";

describe("ErrorComponent", () => {
  it("handles Error", () => {
    render(
      <ErrorComponent error={Error("Mock error message")} reset={vi.fn()} />,
    );

    screen.getByText("Mock error message");
  });

  it("handles string", () => {
    render(<ErrorComponent error={"Mock error message"} reset={vi.fn()} />);

    screen.getByText("Mock error message");
  });

  it("handles unknown", () => {
    render(<ErrorComponent error={null} reset={vi.fn()} />);

    expect(screen.getByText("Something went wrong"));
  });

  it("calls reset when button clicked", () => {
    const resetSpy = vi.fn();

    render(<ErrorComponent error={null} reset={resetSpy} />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Try Again",
      }),
    );

    expect(resetSpy).toHaveBeenCalledOnce();
  });
});
