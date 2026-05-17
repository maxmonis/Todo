import { renderHook, waitFor } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { mockQueryClient } from "@/test/mocks/mockQueryClient";
import { toggleTodo } from "../server/toggleTodo";
import { useToggleTodo } from "./useToggleTodo";

vi.mock("../server/toggleTodo");

const { queryClient, wrapper } = mockQueryClient();

it("toggles cached todo on success", async () => {
  const mockTodo1 = { checked: false, id: "1", text: "Wash car" };
  const mockTodo2 = { checked: true, id: "2", text: "Buy groceries" };
  const checked = !mockTodo1.checked;

  vi.mocked(toggleTodo).mockResolvedValueOnce({ checked, id: mockTodo1.id });
  queryClient.setQueryData(["todos"], [mockTodo1, mockTodo2]);

  const { result } = renderHook(() => useToggleTodo(mockTodo1.id), { wrapper });

  result.current.mutate();

  await waitFor(() => {
    expect(queryClient.getQueryData(["todos"])).toEqual([
      { ...mockTodo1, checked },
      mockTodo2,
    ]);
  });
});
