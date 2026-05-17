import { expect, it, vi } from "vitest";
import { db } from "@/prisma/db";
import { addTodo } from "./addTodo";

vi.mock("@tanstack/react-start", async () => {
  const { mockCreateServerFn } = await import(
    "@/test/mocks/mockCreateServerFn"
  );
  return { createServerFn: mockCreateServerFn };
});

vi.mock("@tanstack/react-start/server");

vi.mock("@/prisma/db", () => {
  return { db: { todo: { create: vi.fn() } } };
});

vi.mock("@/features/auth/server/authMiddleware", () => {
  return {
    authMiddleware: vi
      .fn()
      .mockReturnValue({ context: { userId: "mockuserid" } }),
  };
});

it("saves the new todo and returns it", async () => {
  vi.mocked(db.todo.create).mockImplementationOnce(
    ({ data }: any) =>
      Promise.resolve({ checked: false, id: "1", text: data.text }) as any,
  );

  const res = await addTodo({ data: "Wash car" });

  expect(res).toEqual({ checked: false, id: "1", text: "Wash car" });
});
