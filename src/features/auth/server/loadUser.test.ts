import { expect, it, vi } from "vitest";
import { db } from "@/prisma/db";
import { loadUser } from "./loadUser";
import { useAuthSession } from "./useAuthSession";

vi.mock("@tanstack/react-start", async () => {
  const { mockCreateServerFn } = await import(
    "@/test/mocks/mockCreateServerFn"
  );
  return { createServerFn: mockCreateServerFn };
});

vi.mock("@/prisma/db", () => {
  return { db: { user: { findUnique: vi.fn() } } };
});

vi.mock("./useAuthSession");

const mockUser = { email: "mock@email.test", id: "ckgvn8jss000001l4h0m2v1x1" };

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
    data: { id: mockUser.id },
    id: undefined,
    update: vi.fn(),
  });
  vi.mocked(db.user.findUnique).mockResolvedValueOnce(null);

  const res = await loadUser();

  expect(res).toBeNull();
  expect(db.user.findUnique).toHaveBeenCalledOnce();
  expect(clearSpy).toHaveBeenCalledOnce();
});

it("updates session and returns user if found", async () => {
  const mockTodos = [{ checked: false, id: "1", text: "Wash car" }];

  vi.mocked(useAuthSession).mockResolvedValueOnce({
    clear: vi.fn(),
    data: { id: mockUser.id },
    id: undefined,
    update: vi.fn(),
  });
  vi.mocked(db.user.findUnique).mockResolvedValueOnce({
    email: mockUser.email,
    todos: mockTodos,
  } as any);

  const res = await loadUser();

  expect(res).toEqual({ email: mockUser.email, todos: mockTodos });
});
