import "@testing-library/jest-dom/vitest"
import { afterEach, beforeAll, vi } from "vitest"

beforeAll(() => {
  process.env.GOOGLE_CLIENT_ID = "MOCK_GOOGLE_CLIENT_ID"
  process.env.GOOGLE_CLIENT_SECRET = "MOCK_GOOGLE_CLIENT_SECRET"
  process.env.MONGO_URI = "MOCK_MONGO_URI"
  process.env.SESSION_SECRET = "MOCK_SESSION_SECRET"
  process.env.VITE_BASE_URL = "https://base-url.mock"
})

afterEach(() => {
  vi.resetModules()
  vi.clearAllMocks()
})
