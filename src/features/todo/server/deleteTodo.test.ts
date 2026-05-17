import { expect, it, vi } from "vitest";
import { db } from "@/prisma/db";
import { deleteTodo } from "./deleteTodo";

const mocks = vi.hoisted(() => {
  return {
    todo: {
      checked: false,
      id: "ckgvn8jss000001l4h0m2v1x1",
      text: "Mock text",
      userId: "ckgvn8jss000001l4h0m2v1x2",
    },
  };
});

vi.mock("@tanstack/react-start", async () => {
  const { mockCreateServerFn } = await import(
    "@/test/mocks/mockCreateServerFn"
  );
  return { createServerFn: mockCreateServerFn };
});

vi.mock("@tanstack/react-start/server");

vi.mock("@/prisma/db", () => {
  return { db: { todo: { delete: vi.fn(), findUnique: vi.fn() } } };
});

vi.mock("@/features/auth/server/authMiddleware", () => {
  return {
    authMiddleware: vi.fn().mockReturnValue({ userId: mocks.todo.userId }),
  };
});

it("rejects invalid id", async () => {
  const res = deleteTodo({ data: "not-a-valid-cuid" });

  await expect(res).rejects.toThrow();
});

it("throws if not found", async () => {
  vi.mocked(db.todo.findUnique).mockResolvedValueOnce(null);

  const res = deleteTodo({ data: mocks.todo.id });

  await expect(res).rejects.toThrow("Not found");
});

it("throws if userId does not match", async () => {
  vi.mocked(db.todo.findUnique).mockResolvedValueOnce({
    ...mocks.todo,
    userId: "not-the-matching-user-id",
  });

  const res = deleteTodo({ data: mocks.todo.id });

  await expect(res).rejects.toThrow("Not authorized");
});

it("deletes todo and returns ID", async () => {
  vi.mocked(db.todo.findUnique).mockResolvedValueOnce(mocks.todo);

  const res = await deleteTodo({ data: mocks.todo.id });

  expect(res).toBe(mocks.todo.id);
  expect(db.todo.delete).toHaveBeenCalledOnce();
});
