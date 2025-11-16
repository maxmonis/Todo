import { expect, it, vi } from "vitest"
import { mockCreateServerFn } from "~/test/mocks/mockCreateServerFn"
import { clearSession } from "./clearSession"
import { useAuthSession } from "./useAuthSession"

vi.mock("@tanstack/react-start", () => {
  return { createServerFn: mockCreateServerFn }
})

vi.mock("./useAuthSession")

it("clears session and returns message", async () => {
  let clearSpy = vi.fn()

  vi.mocked(useAuthSession).mockResolvedValueOnce({
    clear: clearSpy,
    data: {},
    id: undefined,
    update: vi.fn(),
  })

  let res = await clearSession()

  expect(res).toBe("Session cleared")
  expect(clearSpy).toHaveBeenCalledOnce()
})
