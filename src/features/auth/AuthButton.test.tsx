import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { AuthButton } from "./AuthButton";
import { useAuth } from "./useAuth";

vi.mock("./useAuth");

it("renders nothing if loading", () => {
  vi.mocked(useAuth).mockReturnValueOnce({
    loading: true,
    logout: vi.fn(),
    user: null,
  });

  const { container } = render(<AuthButton />);

  expect(container).toBeEmptyDOMElement();
});

it("renders logout button if signed in", () => {
  const logoutSpy = vi.fn();

  vi.mocked(useAuth).mockReturnValueOnce({
    loading: false,
    logout: logoutSpy,
    user: {
      email: "mock@email.test",
    },
  });

  render(<AuthButton />);

  fireEvent.click(
    screen.getByRole("button", {
      name: "Logout",
    }),
  );

  expect(logoutSpy).toHaveBeenCalledOnce();
});

it("renders Google button if logged out", () => {
  Object.defineProperty(window, "location", {
    value: {
      href: "",
    },
    writable: true,
  });
  vi.mocked(useAuth).mockReturnValueOnce({
    loading: false,
    logout: vi.fn(),
    user: null,
  });

  render(<AuthButton />);

  fireEvent.click(
    screen.getByRole("button", {
      name: /Continue with Google/,
    }),
  );

  expect(window.location.href).toBe(
    `${import.meta.env.VITE_BASE_URL}/api/auth/google`,
  );
});
