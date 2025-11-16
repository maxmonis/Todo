import { renderHook, waitFor } from "@testing-library/react"
import { expect, it, vi } from "vitest"
import { mockQueryClient } from "~/test/helpers/mockQueryClient"
import { addTodo } from "./addTodo"
import { useAddTodo } from "./useAddTodo"

vi.mock("./addTodo")

let { queryClient, wrapper } = mockQueryClient()

it("adds new todo to cache on success", async () => {
  vi.mocked(addTodo).mockResolvedValueOnce({
    checked: false,
    id: "fixfaucetid",
    text: "Fix faucet",
  })
  queryClient.setQueryData(
    ["todos"],
    [
      { checked: false, id: "washcarid", text: "Wash car" },
      { checked: true, id: "buygroceriesid", text: "Buy groceries" },
    ],
  )

  let { result } = renderHook(() => useAddTodo(), { wrapper })

  result.current.mutate({ data: "Fix faucet" })

  await waitFor(() => {
    expect(queryClient.getQueryData(["todos"])).toEqual([
      { checked: false, id: "washcarid", text: "Wash car" },
      { checked: true, id: "buygroceriesid", text: "Buy groceries" },
      { checked: false, id: "fixfaucetid", text: "Fix faucet" },
    ])
  })
})
