import { renderHook, waitFor } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { addTodo } from "./addTodo";
import { useAddTodo } from "./useAddTodo";
import { mockQueryClient } from "@/test/mocks/mockQueryClient";

vi.mock("./addTodo");

const { queryClient, wrapper } = mockQueryClient();

it("adds new todo to cache on success", async () => {
  vi.mocked(addTodo).mockResolvedValueOnce({
    checked: false,
    id: "mock-todo-id-789",
    text: "Fix faucet",
  });
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

  const { result } = renderHook(() => useAddTodo(), {
    wrapper,
  });

  result.current.mutate({
    data: "Fix faucet",
  });

  await waitFor(() => {
    expect(queryClient.getQueryData(["todos"])).toEqual([
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
      {
        checked: false,
        id: "mock-todo-id-789",
        text: "Fix faucet",
      },
    ]);
  });
});
