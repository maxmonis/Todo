import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, it, vi } from "vitest";
import { TodoForm } from "./TodoForm";

const mocks = vi.hoisted(() => {
  return { addTodo: vi.fn() };
});

vi.mock("../hooks/useAddTodo", () => {
  return { useAddTodo: vi.fn().mockReturnValue({ mutate: mocks.addTodo }) };
});

beforeEach(() => {
  render(<TodoForm />);
});

it("prevents empty submission", () => {
  expect(screen.getByRole("button", { name: "Add Todo" })).toBeDisabled();
});

it("prevents whitespace submission", async () => {
  await userEvent.type(
    screen.getByPlaceholderText("Enter a new todo..."),
    "   ",
  );

  expect(screen.getByRole("button", { name: "Add Todo" })).toBeDisabled();
});

it("allows adding a new todo", async () => {
  const mockTodoText = "Mock new todo text";

  await userEvent.type(
    screen.getByPlaceholderText("Enter a new todo..."),
    mockTodoText,
  );
  fireEvent.click(screen.getByRole("button", { name: "Add Todo" }));

  expect(mocks.addTodo).toHaveBeenCalledExactlyOnceWith({ data: mockTodoText });
});
