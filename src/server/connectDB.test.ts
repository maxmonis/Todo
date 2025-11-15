import mongoose from "mongoose"
import { expect, it, vi } from "vitest"
import { connectDB } from "./connectDB"

vi.mock("mongoose")

it("does not connect in test mode", async () => {
  await connectDB()

  expect(mongoose.set).not.toHaveBeenCalled()
  expect(mongoose.connect).not.toHaveBeenCalled()
})

it("connects when mode is not test", async () => {
  let logSpy = vi.spyOn(console, "log").mockImplementationOnce(() => {})

  import.meta.env.MODE = "development"

  await connectDB()

  expect(mongoose.set).toHaveBeenCalledExactlyOnceWith("strictQuery", false)
  expect(mongoose.connect).toHaveBeenCalledExactlyOnceWith(
    process.env.MONGO_URI,
  )
  expect(logSpy).toHaveBeenCalledExactlyOnceWith("MongoDB connected")

  logSpy.mockRestore()
  import.meta.env.MODE = "test"
})

it("exits process if connection fails", async () => {
  let errorSpy = vi.spyOn(console, "error").mockImplementationOnce(() => {})
  let exitSpy = vi.spyOn(process, "exit").mockImplementationOnce(() => {
    throw new Error("process.exit called")
  })

  import.meta.env.MODE = "production"
  vi.mocked(mongoose.connect).mockRejectedValueOnce(Error("Mock error"))

  let res = connectDB()

  await expect(res).rejects.toThrow("process.exit called")
  expect(errorSpy).toHaveBeenCalledExactlyOnceWith(
    "Failed to connect to MongoDB:",
    Error("Mock error"),
  )
  expect(exitSpy).toHaveBeenCalledExactlyOnceWith(1)

  errorSpy.mockRestore()
  exitSpy.mockRestore()
  import.meta.env.MODE = "test"
})
