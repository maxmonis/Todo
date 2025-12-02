import { expect, it, vi } from "vitest";
import { loadTodos } from "./loadTodos";
import { db } from "@/mongo/db";

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
        userId: "mock-user-id",
      },
    }),
  };
});
vi.mock("@/mongo/db");

it("returns todos from DB", async () => {
  vi.mocked(db.Todo.find).mockReturnValueOnce({
    lean: vi.fn().mockResolvedValueOnce([
      {
        _id: {
          toString: () => "mock-todo-id-123",
        },
        text: "Wash car",
      },
      {
        _id: {
          toString: () => "mock-todo-id-456",
        },
        checked: true,
        text: "Buy groceries",
      },
    ]),
  } as any);

  const res = await loadTodos();

  expect(res).toEqual([
    {
      checked: false,
      id: "mock-todo-id-123",
      text: "Wash car",
    },
    {
      checked: true,
      id: "mock-todo-id-456",
      text: "Buy groceries",
    },
  ]);
});
