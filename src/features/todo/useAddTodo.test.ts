import { renderHook, waitFor } from "@testing-library/react"
import { expect, it, vi } from "vitest"
import { mockQueryClient } from "~/test/mocks/mockQueryClient"
import { addTodo } from "./addTodo"
import { useAddTodo } from "./useAddTodo"

vi.mock("./addTodo")

let { queryClient, wrapper } = mockQueryClient()

it("adds new todo to cache on success", async () => {
  vi.mocked(addTodo).mockResolvedValueOnce({
    checked: false,
    id: "mockTodoId789",
    text: "Fix faucet",
  })
  queryClient.setQueryData(
    ["todos"],
    [
      { checked: false, id: "mockTodoId123", text: "Wash car" },
      { checked: true, id: "mockTodoId456", text: "Buy groceries" },
    ],
  )

  let { result } = renderHook(() => useAddTodo(), { wrapper })

  result.current.mutate({ data: "Fix faucet" })

  await waitFor(() => {
    expect(queryClient.getQueryData(["todos"])).toEqual([
      { checked: false, id: "mockTodoId123", text: "Wash car" },
      { checked: true, id: "mockTodoId456", text: "Buy groceries" },
      { checked: false, id: "mockTodoId789", text: "Fix faucet" },
    ])
  })
})
