import { expect, it, vi } from "vitest";
import { authMiddleware } from "./authMiddleware";
import { useAuthSession } from "./useAuthSession";

vi.mock("@tanstack/react-start", () => {
  return {
    createMiddleware: vi.fn(() => {
      return {
        // this will allow us to call the middleware and make assertions
        server: vi.fn((handler: () => void) => handler),
      };
    }),
  };
});

vi.mock("./useAuthSession");

const mockUserId = "ckgvn8jss000001l4h0m2v1x1";

it("calls next if session valid", async () => {
  const nextSpy = vi.fn();

  vi.mocked(useAuthSession).mockResolvedValueOnce({
    clear: vi.fn(),
    data: {
      id: mockUserId,
    },
    id: undefined,
    update: vi.fn(),
  });

  // @ts-expect-error
  await authMiddleware({
    next: nextSpy,
  });

  expect(nextSpy).toHaveBeenCalledExactlyOnceWith({
    context: {
      userId: mockUserId,
    },
  });
});

it("throws if user ID missing", async () => {
  vi.mocked(useAuthSession).mockResolvedValueOnce({
    clear: vi.fn(),
    data: {},
    id: undefined,
    update: vi.fn(),
  });

  // @ts-expect-error
  const res = authMiddleware({
    next: vi.fn(),
  });

  await expect(res).rejects.toThrowError("Not authorized");
});
