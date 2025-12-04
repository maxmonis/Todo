import mongoose from "mongoose";
import { expect, it, vi } from "vitest";
import { toggleTodo } from "./toggleTodo";
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
      userId: "mockuserid",
    }),
  };
});

vi.mock("@/mongo/db");

const mockTodoId = new mongoose.Types.ObjectId().toString();

it("rejects invalid objectId", async () => {
  const res = toggleTodo({
    data: "not-a-valid-object-id",
  });

  await expect(res).rejects.toThrow();
});

it("throws if not found", async () => {
  vi.mocked(db.Todo.findById).mockResolvedValueOnce(null);

  const res = toggleTodo({
    data: mockTodoId,
  });

  await expect(res).rejects.toThrow("Not found");
});

it("throws if userId does not match", async () => {
  vi.mocked(db.Todo.findById).mockResolvedValueOnce({
    userId: {
      toString: () => "not-the-matching-user-id",
    },
  });

  const res = toggleTodo({
    data: mockTodoId,
  });

  await expect(res).rejects.toThrow("Not authorized");
});

it("toggles todo then returns ID and status", async () => {
  const saveSpy = vi.fn();

  vi.mocked(db.Todo.findById).mockResolvedValueOnce({
    checked: true,
    save: saveSpy,
    userId: {
      toString: () => "mockuserid",
    },
  });

  const res = await toggleTodo({
    data: mockTodoId,
  });

  expect(res).toEqual({
    checked: false,
    id: mockTodoId,
  });
  expect(saveSpy).toHaveBeenCalledOnce();
});
