import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import { useDeleteTodo } from "../hooks/useDeleteTodo";
import { useToggleTodo } from "../hooks/useToggleTodo";
import { TodoListItem } from "./TodoListItem";

const mocks = vi.hoisted(() => {
  return { deleteTodo: vi.fn(), toggleTodo: vi.fn() };
});

vi.mock("../hooks/useDeleteTodo", () => {
  return {
    useDeleteTodo: vi.fn().mockReturnValue({ mutate: mocks.deleteTodo }),
  };
});

vi.mock("../hooks/useToggleTodo", () => {
  return {
    useToggleTodo: vi.fn().mockReturnValue({ mutate: mocks.toggleTodo }),
  };
});

beforeEach(() => {
  render(<TodoListItem todo={{ checked: false, id: "1", text: "Wash car" }} />);
});

it("allows todo toggling", () => {
  expect(vi.mocked(useToggleTodo)).toHaveBeenCalledExactlyOnceWith("1");

  const checkbox = screen.getByLabelText("Wash car");

  expect(checkbox.getAttribute("aria-checked")).toBe("false");

  fireEvent.click(checkbox);

  expect(mocks.toggleTodo).toHaveBeenCalledOnce();
});

it("allows todo deletion", () => {
  expect(vi.mocked(useDeleteTodo)).toHaveBeenCalledExactlyOnceWith("1");

  fireEvent.click(screen.getByRole("button", { name: "Delete" }));

  expect(mocks.deleteTodo).toHaveBeenCalledOnce();
});
