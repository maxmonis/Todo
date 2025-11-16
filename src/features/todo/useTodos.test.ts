import { renderHook, waitFor } from "@testing-library/react"
import { expect, it, vi } from "vitest"
import { mockQueryClient } from "~/test/mocks/mockQueryClient"
import { useAuth } from "../auth/useAuth"
import { loadTodos } from "./loadTodos"
import { useTodos } from "./useTodos"

vi.mock("../auth/useAuth")

vi.mock("./loadTodos")

let { wrapper } = mockQueryClient()

it("loads todos from DB", async () => {
  vi.mocked(useAuth).mockReturnValue({
    loading: false,
    logout: vi.fn(),
    user: { email: "valid@email.mock" },
  })
  vi.mocked(loadTodos).mockResolvedValueOnce([
    { checked: false, id: "mockTodoId123", text: "Wash car" },
    { checked: true, id: "mockTodoId456", text: "Buy groceries" },
  ])

  let { result } = renderHook(() => useTodos(), { wrapper })

  expect(result.current.data).toEqual([])
  await waitFor(() =>
    expect(result.current.data).toEqual([
      { checked: false, id: "mockTodoId123", text: "Wash car" },
      { checked: true, id: "mockTodoId456", text: "Buy groceries" },
    ]),
  )
})
