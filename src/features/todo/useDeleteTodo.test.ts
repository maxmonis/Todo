import { renderHook, waitFor } from "@testing-library/react"
import { expect, it, vi } from "vitest"
import { mockQueryClient } from "~/test/helpers/mockQueryClient"
import { deleteTodo } from "./deleteTodo"
import { useDeleteTodo } from "./useDeleteTodo"

vi.mock("./deleteTodo")

let { queryClient, wrapper } = mockQueryClient()

it("removes cached todo on success", async () => {
  vi.mocked(deleteTodo).mockResolvedValue("washcarid")
  queryClient.setQueryData(
    ["todos"],
    [
      { checked: false, id: "washcarid", text: "Wash car" },
      { checked: true, id: "buygroceriesid", text: "Buy groceries" },
    ],
  )

  let { result } = renderHook(() => useDeleteTodo("washcarid"), { wrapper })

  result.current.mutate()

  await waitFor(() => {
    expect(queryClient.getQueryData(["todos"])).toEqual([
      { checked: true, id: "buygroceriesid", text: "Buy groceries" },
    ])
  })
})
