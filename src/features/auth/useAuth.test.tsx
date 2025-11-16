import { renderHook } from "@testing-library/react"
import { expect, it, vi } from "vitest"
import { AuthContext } from "./AuthContext"
import { useAuth } from "./useAuth"

let mockContext = {
  loading: false,
  logout: vi.fn(),
  user: { email: "test@example.com" },
}

function wrapper({ children }: React.PropsWithChildren) {
  return (
    <AuthContext.Provider value={mockContext}>{children}</AuthContext.Provider>
  )
}

it("returns context", () => {
  let { result } = renderHook(() => useAuth(), { wrapper })

  expect(result.current).toBe(mockContext)
})

it("throws error when used outside provider", () => {
  expect(() => renderHook(() => useAuth())).toThrowError(
    "useAuth must be used within AuthProvider",
  )
})
