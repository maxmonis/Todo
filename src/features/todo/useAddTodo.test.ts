import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { mockQueryClient } from "@/test/mocks/mockQueryClient";
import { addTodo } from "./addTodo";
import { useAddTodo } from "./useAddTodo";

vi.mock("./addTodo");

const { queryClient, wrapper } = mockQueryClient();

afterEach(() => {
  queryClient.clear();
});

const mockNewTodo = { checked: false, id: "3", text: "Fix faucet" };

it("adds new todo to cache on success", async () => {
  const mockTodo1 = { checked: false, id: "1", text: "Wash car" };
  const mockTodo2 = { checked: true, id: "2", text: "Buy groceries" };

  queryClient.setQueryData(["todos"], [mockTodo1, mockTodo2]);
  vi.mocked(addTodo).mockResolvedValueOnce(mockNewTodo);

  const { result } = renderHook(() => useAddTodo(), { wrapper });

  result.current.mutate({ data: mockNewTodo.text });

  await waitFor(() => {
    expect(queryClient.getQueryData(["todos"])).toEqual([
      mockTodo1,
      mockTodo2,
      mockNewTodo,
    ]);
  });
});

it("does not update cache if undefined", async () => {
  vi.mocked(addTodo).mockResolvedValueOnce(mockNewTodo);

  const { result } = renderHook(() => useAddTodo(), { wrapper });

  result.current.mutate({ data: mockNewTodo.text });

  await waitFor(() => {
    expect(queryClient.getQueryData(["todos"])).toBeUndefined();
  });
});
