import { render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { useAuth } from "../auth/useAuth";
import { TodoApp } from "./TodoApp";

const mocks = vi.hoisted(() => {
  return {
    setQueryData: vi.fn(),
  };
});

vi.mock("@tanstack/react-query", () => {
  return {
    useQueryClient: vi.fn().mockReturnValue({
      setQueryData: mocks.setQueryData,
    }),
  };
});

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
  const mockTodos = [
    {
      checked: false,
      id: "mockid",
      text: "Mock text",
    },
  ];

  vi.mocked(useAuth).mockReturnValue({
    loading: false,
    logout: vi.fn(),
    user: {
      email: "mock@email.test",
      todos: mockTodos,
    },
  });

  render(<TodoApp />);

  screen.findByText("MockTodoList");
  screen.findByText("MockTodoForm");
  expect(mocks.setQueryData).toHaveBeenCalledExactlyOnceWith(
    ["todos"],
    mockTodos,
  );
});
