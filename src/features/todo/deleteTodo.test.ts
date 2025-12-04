import mongoose from "mongoose";
import { expect, it, vi } from "vitest";
import { deleteTodo } from "./deleteTodo";
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
  const res = deleteTodo({
    data: "not-a-valid-object-id",
  });

  await expect(res).rejects.toThrow();
});

it("throws if not found", async () => {
  vi.mocked(db.Todo.findById).mockResolvedValueOnce(null);

  const res = deleteTodo({
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

  const res = deleteTodo({
    data: mockTodoId,
  });

  await expect(res).rejects.toThrow("Not authorized");
});

it("deletes todo and returns ID", async () => {
  const deleteOneSpy = vi.fn();

  vi.mocked(db.Todo.findById).mockResolvedValueOnce({
    deleteOne: deleteOneSpy,
    userId: {
      toString: () => "mockuserid",
    },
  });

  const res = await deleteTodo({
    data: mockTodoId,
  });

  expect(res).toBe(mockTodoId);
  expect(deleteOneSpy).toHaveBeenCalledOnce();
});
