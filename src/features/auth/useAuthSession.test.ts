import { useSession } from "@tanstack/react-start/server"
import { expect, it, vi } from "vitest"
import { useAuthSession } from "./useAuthSession"

vi.mock("@tanstack/react-start/server", () => ({
  useSession: vi.fn(),
}))

it("returns the result of useSession", () => {
  let mockSession = {
    email: "valid@mock.email",
    userId: "mockuserId",
  }
  // @ts-expect-error
  useSession.mockReturnValue(mockSession)
  expect(useAuthSession()).toEqual(mockSession)
  expect(useSession).toHaveBeenCalledOnce()
})
