import { renderHook, waitFor } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { deleteTodo } from "./deleteTodo";
import { useDeleteTodo } from "./useDeleteTodo";
import { mockQueryClient } from "@/test/mocks/mockQueryClient";

vi.mock("./deleteTodo");

const { queryClient, wrapper } = mockQueryClient();

it("removes cached todo on success", async () => {
  vi.mocked(deleteTodo).mockResolvedValueOnce("mock-todo-id-123");
  queryClient.setQueryData(
    ["todos"],
    [
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
    ],
  );

  const { result } = renderHook(() => useDeleteTodo("mock-todo-id-123"), {
    wrapper,
  });

  result.current.mutate();

  await waitFor(() => {
    expect(queryClient.getQueryData(["todos"])).toEqual([
      {
        checked: true,
        id: "mock-todo-id-456",
        text: "Buy groceries",
      },
    ]);
  });
});
