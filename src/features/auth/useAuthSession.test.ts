import { useSession } from "@tanstack/react-start/server";
import { expect, it, vi } from "vitest";
import { useAuthSession } from "./useAuthSession";

vi.mock("@tanstack/react-start/server", () => {
  return {
    useSession: vi.fn(),
  };
});

it("returns the result of useSession", () => {
  const mockSession = {
    email: "valid@email.mock",
    userId: "mock-user-id",
  };

  // @ts-expect-error
  useSession.mockReturnValueOnce(mockSession);

  const res = useAuthSession();

  expect(res).toEqual(mockSession);
  expect(useSession).toHaveBeenCalledOnce();
});
