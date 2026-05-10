import { render } from "@testing-library/react";
import { it, vi } from "vitest";
import { ShellComponent } from "./ShellComponent";

vi.mock("@tanstack/react-router");

it("renders", () => {
  // hide <html> cannot be a child of <div> warning
  vi.spyOn(console, "error").mockImplementationOnce(() => {});

  render(<ShellComponent />);
});
