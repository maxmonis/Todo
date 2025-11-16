import { renderHook, waitFor } from "@testing-library/react"
import { expect, it, vi } from "vitest"
import { mockQueryClient } from "~/test/helpers/mockQueryClient"
import { toggleTodo } from "./toggleTodo"
import { useToggleTodo } from "./useToggleTodo"

vi.mock("./toggleTodo")

let { queryClient, wrapper } = mockQueryClient()

it("toggles cached todo on success", async () => {
  vi.mocked(toggleTodo).mockResolvedValue({ checked: true, id: "washcarid" })
  queryClient.setQueryData(
    ["todos"],
    [
      { checked: false, id: "washcarid", text: "Wash car" },
      { checked: true, id: "buygroceriesid", text: "Buy groceries" },
    ],
  )

  let { result } = renderHook(() => useToggleTodo("washcarid"), { wrapper })

  result.current.mutate()

  await waitFor(() => {
    expect(queryClient.getQueryData(["todos"])).toEqual([
      { checked: true, id: "washcarid", text: "Wash car" },
      { checked: true, id: "buygroceriesid", text: "Buy groceries" },
    ])
  })
})
