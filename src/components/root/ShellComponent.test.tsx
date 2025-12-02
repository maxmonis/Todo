import { render } from "@testing-library/react";
import { it, vi } from "vitest";
import { ShellComponent } from "./ShellComponent";

vi.mock("@tanstack/react-router");

it("renders", () => {
  const errorSpy = vi.spyOn(console, "error");

  errorSpy.mockImplementationOnce(() => {});

  render(<ShellComponent />);

  errorSpy.mockClear();
});
