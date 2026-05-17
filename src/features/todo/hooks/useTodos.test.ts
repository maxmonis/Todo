import { renderHook, waitFor } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { useAuth } from "@/features/auth/context/useAuth";
import { mockQueryClient } from "@/test/mocks/mockQueryClient";
import { loadTodos } from "../server/loadTodos";
import { useTodos } from "./useTodos";

vi.mock("@/features/auth/context/useAuth");

vi.mock("../server/loadTodos");

const { wrapper } = mockQueryClient();

const mockTodos = [
  { checked: false, id: "1", text: "Wash car" },
  { checked: true, id: "2", text: "Buy groceries" },
];

it("loads todos from DB", async () => {
  vi.mocked(useAuth).mockReturnValue({
    loading: false,
    logout: vi.fn(),
    user: { email: "mock@email.test", todos: [] },
  });
  vi.mocked(loadTodos).mockResolvedValueOnce(mockTodos);

  const { result } = renderHook(() => useTodos(), { wrapper });

  expect(result.current.data).toEqual([]);
  await waitFor(() => {
    expect(result.current.data).toEqual(mockTodos);
  });
});
