import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import { TodoList } from "./TodoList";

const mocks = vi.hoisted(() => {
  return {
    deleteTodo: vi.fn(),
    todo1: { checked: false, id: "1", text: "Wash car" },
    todo2: { checked: true, id: "2", text: "Buy groceries" },
    toggleTodo: vi.fn(),
  };
});

vi.mock("./useDeleteTodo", () => {
  return {
    useDeleteTodo: vi.fn().mockReturnValue({ mutate: mocks.deleteTodo }),
  };
});

vi.mock("./useTodos", () => {
  return {
    useTodos: vi.fn().mockReturnValue({ data: [mocks.todo1, mocks.todo2] }),
  };
});

vi.mock("./useToggleTodo", () => {
  return {
    useToggleTodo: vi.fn().mockReturnValue({ mutate: mocks.toggleTodo }),
  };
});

beforeEach(() => {
  render(<TodoList />);
});

it("displays todo checked state", () => {
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

it("allows todo deletion", () => {
  const [one, two] = screen.getAllByRole("listitem");

  fireEvent.click(within(one!).getByRole("button", { name: "Delete" }));
  fireEvent.click(within(two!).getByRole("button", { name: "Delete" }));

  expect(mocks.deleteTodo).toHaveBeenCalledTimes(2);
});

it("allows todo toggling", () => {
  const [one, two] = screen.getAllByRole("listitem");

  fireEvent.click(within(one!).getByLabelText(mocks.todo1.text));
  fireEvent.click(within(two!).getByLabelText(mocks.todo2.text));

  expect(mocks.toggleTodo).toHaveBeenCalledTimes(2);
});
