import { renderHook, waitFor } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { toggleTodo } from "./toggleTodo";
import { useToggleTodo } from "./useToggleTodo";
import { mockQueryClient } from "@/test/mocks/mockQueryClient";

vi.mock("./toggleTodo");

const { queryClient, wrapper } = mockQueryClient();

it("toggles cached todo on success", async () => {
  vi.mocked(toggleTodo).mockResolvedValueOnce({
    checked: true,
    id: "mocktodoid123",
  });
  queryClient.setQueryData(
    ["todos"],
    [
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
    ],
  );

  const { result } = renderHook(() => useToggleTodo("mocktodoid123"), {
    wrapper,
  });

  result.current.mutate();

  await waitFor(() => {
    expect(queryClient.getQueryData(["todos"])).toEqual([
      {
        checked: true,
        id: "mocktodoid123",
        text: "Wash car",
      },
      {
        checked: true,
        id: "mocktodoid456",
        text: "Buy groceries",
      },
    ]);
  });
});
