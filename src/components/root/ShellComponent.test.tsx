import { render } from "@testing-library/react";
import { it, vi } from "vitest";
import { ShellComponent } from "./ShellComponent";

vi.mock("@tanstack/react-router");

it("renders", () => {
  const errorSpy = vi.spyOn(console, "error");

  // hide <html> cannot be a child of <div> warning
  errorSpy.mockImplementationOnce(() => {});

  render(<ShellComponent />);
});
