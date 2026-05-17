import {
  fireEvent,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import { loadUser } from "@/features/auth/server/loadUser";
import { renderWithProviders } from "@/test/utils/renderWithProviders";
import { addTodo } from "../server/addTodo";
import { deleteTodo } from "../server/deleteTodo";
import { toggleTodo } from "../server/toggleTodo";
import { TodoPage } from "./TodoPage";

vi.mock("@/features/auth/server/loadUser");
vi.mock("../server/addTodo");
vi.mock("../server/deleteTodo");
vi.mock("../server/toggleTodo");

it("shows unauthenticated state", async () => {
  vi.mocked(loadUser).mockResolvedValueOnce(null);

  renderWithProviders(<TodoPage />);
  await waitForElementToBeRemoved(screen.getByText("Loading..."));

  screen.getByText("Please log in to use this feature");
  screen.getByRole("button", { name: /Continue with Google/ });

  expect(screen.queryByPlaceholderText("Enter a new todo...")).toBeNull();
  expect(screen.queryByRole("button", { name: "Add Todo" })).toBeNull();
});

it("renders todos, email, and logout button if authenticated", async () => {
  vi.mocked(loadUser).mockResolvedValueOnce({
    email: "mock@user.test",
    todos: [
      { checked: false, id: "1", text: "Wash car" },
      { checked: true, id: "2", text: "Buy groceries" },
    ],
  });

  renderWithProviders(<TodoPage />);
  await waitForElementToBeRemoved(screen.getByText("Loading..."));

  expect(screen.getByLabelText("Wash car").getAttribute("aria-checked")).toBe(
    "false",
  );
  expect(
    screen.getByLabelText("Buy groceries").getAttribute("aria-checked"),
  ).toBe("true");

  expect(screen.getAllByRole("button", { name: "Delete" })).toHaveLength(2);

  screen.getByText(/Logged in as mock@user.test/);
  screen.getByRole("button", { name: "Logout" });
});

it("allows creating, toggling, and deleting todos", async () => {
  vi.mocked(loadUser).mockResolvedValueOnce({
    email: "mock@user.test",
    todos: [],
  });

  renderWithProviders(<TodoPage />);
  await waitForElementToBeRemoved(screen.getByText("Loading..."));

  const todoInput = screen.getByPlaceholderText("Enter a new todo...");
  const submitButton = screen.getByRole("button", { name: "Add Todo" });

  expect(submitButton).toBeDisabled();
  await userEvent.type(todoInput, "   ");
  expect(submitButton).toBeDisabled();
  await userEvent.clear(todoInput);

  vi.mocked(addTodo).mockImplementationOnce(({ data: text }) =>
    Promise.resolve({ checked: false, id: "1", text }),
  );

  await userEvent.type(todoInput, " Wash car ");
  fireEvent.click(submitButton);

  const todo = await screen.findByRole("listitem");

  expect(todoInput).toHaveValue("");
  expect(submitButton).toBeDisabled();

  const checkbox = within(todo).getByLabelText("Wash car");
  expect(checkbox.getAttribute("aria-checked")).toBe("false");

  vi.mocked(toggleTodo).mockResolvedValueOnce({ checked: true, id: "1" });

  fireEvent.click(checkbox);
  await waitFor(() => {
    expect(checkbox.getAttribute("aria-checked")).toBe("true");
  });

  vi.mocked(deleteTodo).mockResolvedValueOnce("1");

  fireEvent.click(within(todo).getByRole("button", { name: "Delete" }));
  await waitForElementToBeRemoved(todo);
});
