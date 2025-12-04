import { render, screen } from "@testing-library/react";
import { it, vi } from "vitest";
import { useAuth } from "../auth/useAuth";
import { TodoApp } from "./TodoApp";

vi.mock("../auth/AuthButton", () => {
  return {
    AuthButton: () => <div>MockAuthButton</div>,
  };
});

vi.mock("../auth/useAuth");

vi.mock("./TodoForm", () => {
  return {
    TodoForm: () => <div>MockTodoForm</div>,
  };
});

vi.mock("./TodoList", () => {
  return {
    TodoList: () => <div>MockTodoList</div>,
  };
});

it("renders spinner if authenticating", () => {
  vi.mocked(useAuth).mockReturnValueOnce({
    loading: true,
    logout: vi.fn(),
    user: null,
  });

  render(<TodoApp />);

  screen.findByText("Loading...");
});

it("renders auth button if logged out", () => {
  vi.mocked(useAuth).mockReturnValueOnce({
    loading: false,
    logout: vi.fn(),
    user: null,
  });

  render(<TodoApp />);

  screen.findByText("Please log in to use this feature");
  screen.findByText("MockAuthButton");
});

it("renders list and form if signed in", () => {
  vi.mocked(useAuth).mockReturnValueOnce({
    loading: false,
    logout: vi.fn(),
    user: {
      email: "mock@email.test",
    },
  });

  render(<TodoApp />);

  screen.findByText("MockTodoList");
  screen.findByText("MockTodoForm");
});
