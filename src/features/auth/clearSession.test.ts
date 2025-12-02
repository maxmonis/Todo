import { expect, it, vi } from "vitest";
import { clearSession } from "./clearSession";
import { useAuthSession } from "./useAuthSession";

vi.mock("@tanstack/react-start", async () => {
  const { mockCreateServerFn } = await import(
    "@/test/mocks/mockCreateServerFn"
  );
  return {
    createServerFn: mockCreateServerFn,
  };
});

vi.mock("./useAuthSession");

it("clears session and returns message", async () => {
  const clearSpy = vi.fn();

  vi.mocked(useAuthSession).mockResolvedValueOnce({
    clear: clearSpy,
    data: {},
    id: undefined,
    update: vi.fn(),
  });

  const res = await clearSession();

  expect(res).toBe("Session cleared");
  expect(clearSpy).toHaveBeenCalledOnce();
});
