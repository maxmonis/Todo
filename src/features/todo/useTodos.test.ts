import { renderHook, waitFor } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { useAuth } from "../auth/useAuth";
import { loadTodos } from "./loadTodos";
import { useTodos } from "./useTodos";
import { mockQueryClient } from "@/test/mocks/mockQueryClient";

vi.mock("../auth/useAuth");

vi.mock("./loadTodos");

const { wrapper } = mockQueryClient();

const mockTodos = [
  {
    checked: false,
    id: "mocktodoid123",
    text: "Wash car",
  },
  {
    checked: true,
    id: "mocktodoid456",
    text: "Buy groceries",
  },
];

it("loads todos from DB", async () => {
  vi.mocked(useAuth).mockReturnValue({
    loading: false,
    logout: vi.fn(),
    user: {
      email: "mock@email.test",
    },
  });
  vi.mocked(loadTodos).mockResolvedValueOnce(mockTodos);

  const { result } = renderHook(() => useTodos(), {
    wrapper,
  });

  expect(result.current.data).toEqual([]);
  await waitFor(() => {
    expect(result.current.data).toEqual(mockTodos);
  });
});
