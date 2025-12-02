import { render } from "@testing-library/react";
import { it, vi } from "vitest";
import { NotFoundComponent } from "./NotFoundComponent";

vi.mock("@tanstack/react-router", async () => {
  const { MockLink } = await import("@/test/mocks/MockLink");

  return {
    Link: MockLink,
  };
});

it("renders", () => {
  render(<NotFoundComponent />);
});
