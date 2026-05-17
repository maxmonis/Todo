import { render, screen, within } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { TodoList } from "./TodoList";

const mocks = vi.hoisted(() => {
  return {
    todo1: { checked: false, id: "1", text: "Wash car" },
    todo2: { checked: true, id: "2", text: "Buy groceries" },
  };
});

vi.mock("../hooks/useDeleteTodo", () => {
  return {
    useDeleteTodo: vi.fn().mockReturnValue({ mutate: vi.fn() }),
  };
});

vi.mock("../hooks/useTodos", () => {
  return {
    useTodos: vi.fn().mockReturnValue({ data: [mocks.todo1, mocks.todo2] }),
  };
});

vi.mock("../hooks/useToggleTodo", () => {
  return {
    useToggleTodo: vi.fn().mockReturnValue({ mutate: vi.fn() }),
  };
});

it("displays todos with checked state", () => {
  render(<TodoList />);
  const listItems = screen.getAllByRole("listitem");

  expect(listItems).toHaveLength(2);
  expect(
    within(listItems[0]!)
      .getByLabelText(mocks.todo1.text)
      .getAttribute("aria-checked"),
  ).toBe("false");
  expect(
    within(listItems[1]!)
      .getByLabelText(mocks.todo2.text)
      .getAttribute("aria-checked"),
  ).toBe("true");
});
