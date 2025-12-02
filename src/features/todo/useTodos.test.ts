import { renderHook, waitFor } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { useAuth } from "../auth/useAuth";
import { loadTodos } from "./loadTodos";
import { useTodos } from "./useTodos";
import { mockQueryClient } from "@/test/mocks/mockQueryClient";

vi.mock("../auth/useAuth");
vi.mock("./loadTodos");

const { wrapper } = mockQueryClient();

it("loads todos from DB", async () => {
  vi.mocked(useAuth).mockReturnValue({
    loading: false,
    logout: vi.fn(),
    user: {
      email: "valid@email.mock",
    },
  });
  vi.mocked(loadTodos).mockResolvedValueOnce([
    {
      checked: false,
      id: "mock-todo-id-123",
      text: "Wash car",
    },
    {
      checked: true,
      id: "mock-todo-id-456",
      text: "Buy groceries",
    },
  ]);

  const { result } = renderHook(() => useTodos(), {
    wrapper,
  });

  expect(result.current.data).toEqual([]);
  await waitFor(() =>
    expect(result.current.data).toEqual([
      {
        checked: false,
        id: "mock-todo-id-123",
        text: "Wash car",
      },
      {
        checked: true,
        id: "mock-todo-id-456",
        text: "Buy groceries",
      },
    ]),
  );
});
