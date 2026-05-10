import { expect, it, vi } from "vitest";
import { loadTodos } from "./loadTodos";
import { db } from "@/prisma/db";

vi.mock("@tanstack/react-start", async () => {
  const { mockCreateServerFn } = await import(
    "@/test/mocks/mockCreateServerFn"
  );
  return {
    createServerFn: mockCreateServerFn,
  };
});

vi.mock("../auth/authMiddleware", () => {
  return {
    authMiddleware: vi.fn().mockReturnValue({
      context: {
        userId: "mockuserid",
      },
    }),
  };
});

vi.mock("@/prisma/db", () => {
  return {
    db: {
      todo: {
        findMany: vi.fn(),
      },
    },
  };
});

const mockTodos = [
  {
    checked: false,
    id: "mocktodoid123",
    text: "Wash car",
  },
  {
    checked: true,
    id: "mocktodoid456",
    text: "Buy groceries",
  },
];

it("returns todos from DB", async () => {
  vi.mocked(db.todo.findMany).mockResolvedValueOnce(mockTodos as any);

  const res = await loadTodos();

  expect(res).toEqual(mockTodos);
});
