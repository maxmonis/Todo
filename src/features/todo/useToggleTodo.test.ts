import { renderHook, waitFor } from "@testing-library/react"
import { expect, it, vi } from "vitest"
import { mockQueryClient } from "~/test/mocks/mockQueryClient"
import { toggleTodo } from "./toggleTodo"
import { useToggleTodo } from "./useToggleTodo"

vi.mock("./toggleTodo")

let { queryClient, wrapper } = mockQueryClient()

it("toggles cached todo on success", async () => {
  vi.mocked(toggleTodo).mockResolvedValueOnce({
    checked: true,
    id: "mockTodoId123",
  })
  queryClient.setQueryData(
    ["todos"],
    [
      { checked: false, id: "mockTodoId123", text: "Wash car" },
      { checked: true, id: "mockTodoId456", text: "Buy groceries" },
    ],
  )

  let { result } = renderHook(() => useToggleTodo("mockTodoId123"), { wrapper })

  result.current.mutate()

  await waitFor(() => {
    expect(queryClient.getQueryData(["todos"])).toEqual([
      { checked: true, id: "mockTodoId123", text: "Wash car" },
      { checked: true, id: "mockTodoId456", text: "Buy groceries" },
    ])
  })
})
