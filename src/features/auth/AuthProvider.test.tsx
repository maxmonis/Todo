import { fireEvent, render, screen } from "@testing-library/react";
import { act, useContext } from "react";
import { expect, it, vi } from "vitest";
import { AuthContext } from "./AuthContext";
import { AuthProvider } from "./AuthProvider";
import { clearSession } from "./clearSession";
import { loadUser } from "./loadUser";

const mocks = vi.hoisted(() => {
  return { clear: vi.fn(), setQueryData: vi.fn() };
});

vi.mock("@tanstack/react-query", () => {
  return {
    useQueryClient: vi.fn().mockReturnValue({
      clear: mocks.clear,
      setQueryData: mocks.setQueryData,
    }),
  };
});

vi.mock("./clearSession");

vi.mock("./loadUser");

function TestComponent() {
  const { loading, logout, user } = useContext(AuthContext)!;

  return (
    <>
      <div>loading:{loading ? "true" : "false"}</div>
      <div>user:{user ? user.email : "null"}</div>
      <button onClick={logout}>Logout</button>
    </>
  );
}

const mockUser = {
  email: "mock@email.test",
  todos: [{ checked: false, id: "1", text: "Wash car" }],
};

it("updates loading when signed out", async () => {
  vi.mocked(loadUser).mockResolvedValueOnce(null);

  render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>,
  );

  screen.getByText("loading:true");
  screen.getByText("user:null");

  await act(async () => {
    await Promise.resolve();
  });

  screen.getByText("loading:false");
  screen.getByText("user:null");
});

it("updates user and loading when logged in", async () => {
  vi.mocked(loadUser).mockResolvedValueOnce(mockUser);

  render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>,
  );

  await act(async () => {
    await Promise.resolve();
  });

  screen.getByText("loading:false");
  screen.getByText(`user:${mockUser.email}`);
  expect(mocks.setQueryData).toHaveBeenCalledExactlyOnceWith(
    ["todos"],
    mockUser.todos,
  );
});

it("clears session when logout clicked", async () => {
  vi.mocked(loadUser).mockResolvedValueOnce(mockUser);

  render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>,
  );

  await act(async () => {
    await Promise.resolve();
  });

  fireEvent.click(screen.getByRole("button", { name: "Logout" }));

  expect(clearSession).toHaveBeenCalledOnce();
  expect(mocks.clear).toHaveBeenCalledOnce();
  screen.getByText("user:null");
});
