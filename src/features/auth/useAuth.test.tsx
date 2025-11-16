import { renderHook } from "@testing-library/react"
import { expect, it, vi } from "vitest"
import { AuthContext } from "./AuthContext"
import { useAuth } from "./useAuth"

it("returns context", () => {
  let mockContext = {
    loading: false,
    logout: vi.fn(),
    user: { email: "mock@valid.email" },
  }

  let { result } = renderHook(() => useAuth(), {
    wrapper: ({ children }) => (
      <AuthContext.Provider value={mockContext}>
        {children}
      </AuthContext.Provider>
    ),
  })

  expect(result.current).toBe(mockContext)
})

it("throws error when used outside provider", () => {
  expect(() => renderHook(() => useAuth())).toThrowError(
    "useAuth must be used within AuthProvider",
  )
})
