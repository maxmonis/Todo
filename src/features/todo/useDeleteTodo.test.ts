import { renderHook, waitFor } from "@testing-library/react"
import { expect, it, vi } from "vitest"
import { mockQueryClient } from "~/test/mocks/mockQueryClient"
import { deleteTodo } from "./deleteTodo"
import { useDeleteTodo } from "./useDeleteTodo"

vi.mock("./deleteTodo")

let { queryClient, wrapper } = mockQueryClient()

it("removes cached todo on success", async () => {
  vi.mocked(deleteTodo).mockResolvedValueOnce("mockTodoId123")
  queryClient.setQueryData(
    ["todos"],
    [
      { checked: false, id: "mockTodoId123", text: "Wash car" },
      { checked: true, id: "mockTodoId456", text: "Buy groceries" },
    ],
  )

  let { result } = renderHook(() => useDeleteTodo("mockTodoId123"), { wrapper })

  result.current.mutate()

  await waitFor(() => {
    expect(queryClient.getQueryData(["todos"])).toEqual([
      { checked: true, id: "mockTodoId456", text: "Buy groceries" },
    ])
  })
})
