import { expect, it, vi } from "vitest";
import { addTodo } from "./addTodo";
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
        userId: "mockuserid",
      },
    }),
  };
});

vi.mock("@/mongo/db");

it("saves the new todo and returns it", async () => {
  vi.mocked(db.Todo.create).mockImplementationOnce((args: any) => {
    return Promise.resolve({
      ...args,
      _id: {
        toString: () => "mocktodoid",
      },
    });
  });

  const res = await addTodo({
    data: "Fix faucet",
  });

  expect(res).toEqual({
    checked: false,
    id: "mocktodoid",
    text: "Fix faucet",
  });
});
