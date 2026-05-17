import { expect, it, vi } from "vitest";
import { db } from "@/prisma/db";
import { loadTodos } from "./loadTodos";

vi.mock("@tanstack/react-start", async () => {
  const { mockCreateServerFn } = await import(
    "@/test/mocks/mockCreateServerFn"
  );
  return { createServerFn: mockCreateServerFn };
});

vi.mock("@/prisma/db", () => {
  return { db: { todo: { findMany: vi.fn() } } };
});

vi.mock("@/features/auth/server/authMiddleware", () => {
  return {
    authMiddleware: vi
      .fn()
      .mockReturnValue({ context: { userId: "mockuserid" } }),
  };
});

it("returns todos from DB", async () => {
  const mockTodos = [
    { checked: false, id: "1", text: "Wash car" },
    { checked: true, id: "2", text: "Buy groceries" },
  ];

  vi.mocked(db.todo.findMany).mockResolvedValueOnce(mockTodos as any);

  const res = await loadTodos();

  expect(res).toEqual(mockTodos);
});
