import mongoose from "mongoose";
import { expect, it, vi } from "vitest";
import { connectDB } from "./connectDB";

vi.mock("mongoose");

it("does not connect in test mode", async () => {
  await connectDB();

  expect(mongoose.connect).not.toHaveBeenCalled();
});

it("connects when mode is not test", async () => {
  import.meta.env.MODE = "development";

  const logSpy = vi.spyOn(console, "log");

  logSpy.mockImplementationOnce(() => {});

  await connectDB();

  expect(mongoose.connect).toHaveBeenCalledOnce();
  expect(logSpy).toHaveBeenCalledExactlyOnceWith("MongoDB connected");

  import.meta.env.MODE = "test";
});

it("exits process if connection fails", async () => {
  import.meta.env.MODE = "production";

  const errorSpy = vi.spyOn(console, "error");
  const exitSpy = vi.spyOn(process, "exit");

  errorSpy.mockImplementationOnce(() => {});
  exitSpy.mockImplementationOnce(() => {
    throw Error("process.exit called");
  });

  vi.mocked(mongoose.connect).mockRejectedValueOnce(
    Error("Mock error message"),
  );

  const res = connectDB();

  await expect(res).rejects.toThrow("process.exit called");
  expect(errorSpy).toHaveBeenCalledExactlyOnceWith(
    "Failed to connect to MongoDB:",
    Error("Mock error message"),
  );
  expect(exitSpy).toHaveBeenCalledExactlyOnceWith(1);

  import.meta.env.MODE = "test";
});
