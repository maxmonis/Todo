import mongoose from "mongoose";
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

const mockUserId = new mongoose.Types.ObjectId().toString();

it("calls next if session valid", async () => {
  const nextSpy = vi.fn();

  vi.mocked(useAuthSession).mockResolvedValueOnce({
    clear: vi.fn(),
    data: {
      email: "mock@email.test",
      userId: mockUserId,
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
      email: "mock@email.test",
      userId: mockUserId,
    },
  });
});

it("throws if email missing", async () => {
  vi.mocked(useAuthSession).mockResolvedValueOnce({
    clear: vi.fn(),
    data: {
      userId: mockUserId,
    },
    id: undefined,
    update: vi.fn(),
  });

  // @ts-expect-error
  const res = authMiddleware({
    next: vi.fn(),
  });

  await expect(res).rejects.toThrowError("Not authorized");
});

it("throws if user ID missing", async () => {
  vi.mocked(useAuthSession).mockResolvedValueOnce({
    clear: vi.fn(),
    data: {
      email: "mock@email.test",
    },
    id: undefined,
    update: vi.fn(),
  });

  // @ts-expect-error
  const res = authMiddleware({
    next: vi.fn(),
  });

  await expect(res).rejects.toThrowError("Not authorized");
});

it("throws if user ID invalid", async () => {
  vi.mocked(useAuthSession).mockResolvedValueOnce({
    clear: vi.fn(),
    data: {
      email: "mock@email.test",
      userId: "not-a-valid-object-id",
    },
    id: undefined,
    update: vi.fn(),
  });

  // @ts-expect-error
  const res = authMiddleware({
    next: vi.fn(),
  });

  await expect(res).rejects.toThrowError("Not authorized");
});
