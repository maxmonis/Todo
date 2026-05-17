import { renderHook, waitFor } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { mockQueryClient } from "@/test/mocks/mockQueryClient";
import { deleteTodo } from "../server/deleteTodo";
import { useDeleteTodo } from "./useDeleteTodo";

vi.mock("../server/deleteTodo");

const { queryClient, wrapper } = mockQueryClient();

it("removes cached todo on success", async () => {
  const mockTodo1 = { checked: false, id: "1", text: "Wash car" };
  const mockTodo2 = { checked: true, id: "2", text: "Buy groceries" };

  vi.mocked(deleteTodo).mockResolvedValueOnce(mockTodo1.id);
  queryClient.setQueryData(["todos"], [mockTodo1, mockTodo2]);

  const { result } = renderHook(() => useDeleteTodo(mockTodo1.id), { wrapper });

  result.current.mutate();

  await waitFor(() => {
    expect(queryClient.getQueryData(["todos"])).toEqual([mockTodo2]);
  });
});
