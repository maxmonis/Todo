import { expect, it, vi } from "vitest";
import { loadUser } from "./loadUser";
import { useAuthSession } from "./useAuthSession";
import { db } from "@/prisma/db";

vi.mock("@tanstack/react-start", async () => {
  const { mockCreateServerFn } = await import(
    "@/test/mocks/mockCreateServerFn"
  );
  return {
    createServerFn: mockCreateServerFn,
  };
});

vi.mock("./useAuthSession");

vi.mock("@/prisma/db", () => {
  return {
    db: {
      user: {
        findUnique: vi.fn(),
      },
    },
  };
});

const mockUser = {
  email: "mock@email.test",
  id: "ckgvn8jss000001l4h0m2v1x1",
};

it("returns null if no session exists", async () => {
  vi.mocked(useAuthSession).mockResolvedValueOnce({
    clear: vi.fn(),
    data: {},
    id: undefined,
    update: vi.fn(),
  });

  const res = await loadUser();

  expect(res).toBeNull();
});

it("clears session and returns null if user not found", async () => {
  const clearSpy = vi.fn();

  vi.mocked(useAuthSession).mockResolvedValueOnce({
    clear: clearSpy,
    data: {
      id: mockUser.id,
    },
    id: undefined,
    update: vi.fn(),
  });
  vi.mocked(db.user.findUnique).mockResolvedValueOnce(null);

  const res = await loadUser();

  expect(res).toBeNull();
  expect(db.user.findUnique).toHaveBeenCalledExactlyOnceWith({
    select: {
      email: true,
      todos: {
        orderBy: {
          id: "asc",
        },
        select: {
          checked: true,
          id: true,
          text: true,
        },
      },
    },
    where: {
      id: mockUser.id,
    },
  });
  expect(clearSpy).toHaveBeenCalledOnce();
});

it("updates session and returns user if found", async () => {
  const updateSpy = vi.fn();

  vi.mocked(useAuthSession).mockResolvedValueOnce({
    clear: vi.fn(),
    data: {
      id: mockUser.id,
    },
    id: undefined,
    update: updateSpy,
  });
  vi.mocked(db.user.findUnique).mockResolvedValueOnce({
    email: mockUser.email,
    todos: [],
  } as any);

  const res = await loadUser();

  expect(res).toEqual({
    email: mockUser.email,
    todos: [],
  });
  expect(updateSpy).toHaveBeenCalledExactlyOnceWith({
    id: mockUser.id,
  });
});
