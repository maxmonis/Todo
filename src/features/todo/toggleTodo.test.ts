import { expect, it, vi } from "vitest";
import { db } from "@/prisma/db";
import { toggleTodo } from "./toggleTodo";

const mocks = vi.hoisted(() => {
  return { userId: "mock-user-id" };
});

vi.mock("@tanstack/react-start", async () => {
  const { mockCreateServerFn } = await import(
    "@/test/mocks/mockCreateServerFn"
  );
  return { createServerFn: mockCreateServerFn };
});

vi.mock("@/prisma/db", () => {
  return { db: { todo: { findUnique: vi.fn(), update: vi.fn() } } };
});

vi.mock("../auth/authMiddleware", () => {
  return { authMiddleware: vi.fn().mockReturnValue({ userId: mocks.userId }) };
});

const mockTodo = {
  checked: true,
  id: "ckgvn8jss000001l4h0m2v1x1",
  text: "Mock text",
  userId: mocks.userId,
};

it("rejects invalid id", async () => {
  const res = toggleTodo({ data: "not-a-valid-cuid" });

  await expect(res).rejects.toThrow();
});

it("throws if not found", async () => {
  vi.mocked(db.todo.findUnique).mockResolvedValueOnce(null);

  const res = toggleTodo({ data: mockTodo.id });

  await expect(res).rejects.toThrow("Not found");
});

it("throws if userId does not match", async () => {
  vi.mocked(db.todo.findUnique).mockResolvedValueOnce({
    ...mockTodo,
    userId: "not-the-matching-user-id",
  });

  const res = toggleTodo({ data: mockTodo.id });

  await expect(res).rejects.toThrow("Not authorized");
});

it("toggles todo then returns ID and status", async () => {
  const checked = !mockTodo.checked;

  vi.mocked(db.todo.findUnique).mockResolvedValueOnce(mockTodo);
  vi.mocked(db.todo.update).mockResolvedValueOnce({ ...mockTodo, checked });

  const res = await toggleTodo({ data: mockTodo.id });

  expect(res).toEqual({ checked, id: mockTodo.id });
  expect(db.todo.update).toHaveBeenCalledOnce();
});
