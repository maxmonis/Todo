import { expect, it, vi } from "vitest"
import { clearSession } from "./clearSession"
import { useAuthSession } from "./useAuthSession"

vi.mock("@tanstack/react-start", () => {
  return {
    createServerFn: vi.fn(() => {
      return {
        handler: vi.fn((cb: Function) => {
          return vi.fn(() => cb())
        }),
      }
    }),
  }
})
vi.mock("./useAuthSession")

it("clears session and returns message", async () => {
  let clearSpy = vi.fn()
  vi.mocked(useAuthSession).mockResolvedValueOnce({
    clear: clearSpy,
    data: {},
    id: "mockid",
    update: vi.fn(),
  })
  expect(await clearSession()).toBe("Session cleared")
})
