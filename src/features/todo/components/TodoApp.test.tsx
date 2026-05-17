import { render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { useAuth } from "@/features/auth/context/useAuth";
import { TodoApp } from "./TodoApp";

vi.mock("@/features/auth/context/useAuth");

vi.mock("@/components/ui/LoadingSpinner", () => {
  return { LoadingSpinner: () => <div>MockLoadingSpinner</div> };
});

vi.mock("./TodoForm", () => {
  return { TodoForm: () => <div>MockTodoForm</div> };
});

vi.mock("./TodoList", () => {
  return { TodoList: () => <div>MockTodoList</div> };
});

it("renders spinner if authenticating", () => {
  vi.mocked(useAuth).mockReturnValueOnce({
    loading: true,
    logout: vi.fn(),
    user: null,
  });

  render(<TodoApp />);

  screen.getByText("MockLoadingSpinner");

  expect(screen.queryByText("MockTodoList")).toBeNull();
  expect(screen.queryByText("MockTodoForm")).toBeNull();
  expect(screen.queryByText("Please log in to use this feature")).toBeNull();
});

it("renders login prompt if signed out", () => {
  vi.mocked(useAuth).mockReturnValueOnce({
    loading: false,
    logout: vi.fn(),
    user: null,
  });

  render(<TodoApp />);

  screen.getByText("Please log in to use this feature");

  expect(screen.queryByText("MockLoadingSpinner")).toBeNull();
  expect(screen.queryByText("MockTodoList")).toBeNull();
  expect(screen.queryByText("MockTodoForm")).toBeNull();
});

it("renders list and form if signed in", () => {
  vi.mocked(useAuth).mockReturnValue({
    loading: false,
    logout: vi.fn(),
    user: { email: "mock@email.test", todos: [] },
  });

  render(<TodoApp />);

  screen.getByText("MockTodoList");
  screen.getByText("MockTodoForm");

  expect(screen.queryByText("MockLoadingSpinner")).toBeNull();
  expect(screen.queryByText("Please log in to use this feature")).toBeNull();
});
