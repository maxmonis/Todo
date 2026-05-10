import { expect, it, vi } from "vitest";
import { addTodo } from "./addTodo";
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
        create: vi.fn(),
      },
    },
  };
});

const mockTodo = {
  checked: false,
  id: "mocktodoid",
  text: "Fix faucet",
};

it("saves the new todo and returns it", async () => {
  vi.mocked(db.todo.create).mockImplementationOnce(({ data }: any) => {
    return Promise.resolve({
      checked: mockTodo.checked,
      id: mockTodo.id,
      text: data.text,
    }) as any;
  });

  const res = await addTodo({
    data: mockTodo.text,
  });

  expect(res).toEqual(mockTodo);
});
