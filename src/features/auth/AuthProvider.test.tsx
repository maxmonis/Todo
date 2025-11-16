import { fireEvent, render, screen } from "@testing-library/react"
import { act, useContext } from "react"
import { expect, it, vi } from "vitest"
import { AuthContext } from "./AuthContext"
import { AuthProvider } from "./AuthProvider"
import { clearSession } from "./clearSession"
import { loadUser } from "./loadUser"

vi.mock("./clearSession")

vi.mock("./loadUser")

function TestComponent() {
  let context = useContext(AuthContext)!

  return (
    <>
      <div>loading:{context.loading ? "true" : "false"}</div>
      <div>user:{context.user ? context.user.email : "null"}</div>
      <button onClick={context.logout}>Logout</button>
    </>
  )
}

it("updates loading when signed out", async () => {
  vi.mocked(loadUser).mockResolvedValueOnce(null)

  render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>,
  )

  screen.getByText("loading:true")
  screen.getByText("user:null")

  await act(async () => {
    await Promise.resolve()
  })

  screen.getByText("loading:false")
  screen.getByText("user:null")
})

it("updates user and loading when logged in", async () => {
  vi.mocked(loadUser).mockResolvedValueOnce({ email: "valid@email.mock" })

  render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>,
  )

  await act(async () => {
    await Promise.resolve()
  })

  screen.getByText("loading:false")
  screen.getByText("user:valid@email.mock")
})

it("clears session when logout clicked", async () => {
  vi.mocked(loadUser).mockResolvedValueOnce({ email: "valid@email.mock" })

  render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>,
  )

  await act(async () => {
    await Promise.resolve()
  })

  fireEvent.click(screen.getByRole("button", { name: "Logout" }))

  expect(clearSession).toHaveBeenCalledOnce()
  screen.getByText("user:null")
})
