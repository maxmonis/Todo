import { redirect } from "@tanstack/react-router";
import { expect, it, vi } from "vitest";
import { googleAuthCallback } from "./googleAuthCallback";
import { useAuthSession } from "./useAuthSession";
import { db } from "@/server/db";

vi.mock("@tanstack/react-router");
vi.mock("./useAuthSession");
vi.mock("@/server/db");

it("throws redirect if no code", async () => {
  vi.mocked(redirect).mockImplementationOnce(vi.fn((args) => args));

  const res = googleAuthCallback({
    request: new Request("https://base-url.mock/api/auth/google/callback"),
  });

  await expect(res).rejects.toEqual({
    href: "https://base-url.mock",
  });
  expect(redirect).toHaveBeenCalledExactlyOnceWith({
    href: "https://base-url.mock",
  });
});

it("exchanges code, creates session, and redirects", async () => {
  const fetchSpy = vi.spyOn(global, "fetch");
  const updateSpy = vi.fn();

  fetchSpy
    .mockImplementationOnce(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            access_token: "mock_access_token",
          }),
      } as any),
    )
    .mockImplementationOnce(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            email: "valid@email.mock",
          }),
      } as any),
    );

  vi.mocked(db.User.findOne).mockResolvedValueOnce(null);
  vi.mocked(db.User.create).mockResolvedValueOnce({
    _id: {
      toString: () => "mock-user-id",
    },
    email: "valid@email.mock",
  } as any);

  vi.mocked(useAuthSession).mockResolvedValueOnce({
    clear: vi.fn(),
    data: {},
    id: undefined,
    update: updateSpy,
  });
  vi.mocked(redirect).mockImplementationOnce(vi.fn((args) => args));

  await googleAuthCallback({
    request: new Request(
      "https://base-url.mock/api/auth/google/callback?code=mock_code",
    ),
  });

  expect(fetchSpy).toHaveBeenCalledTimes(2);
  expect(db.User.findOne).toHaveBeenCalledExactlyOnceWith({
    email: "valid@email.mock",
  });
  expect(db.User.create).toHaveBeenCalledExactlyOnceWith({
    email: "valid@email.mock",
  });
  expect(updateSpy).toHaveBeenCalledExactlyOnceWith({
    email: "valid@email.mock",
    userId: "mock-user-id",
  });
  expect(redirect).toHaveBeenCalledExactlyOnceWith({
    href: "https://base-url.mock",
  });
});

it("uses existing user if found", async () => {
  const updateSpy = vi.fn();

  vi.spyOn(global, "fetch")
    .mockImplementationOnce(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            access_token: "mock_access_token",
          }),
      } as any),
    )
    .mockImplementationOnce(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            email: "valid@email.mock",
          }),
      } as any),
    );

  vi.mocked(db.User.findOne).mockResolvedValueOnce({
    _id: {
      toString: () => "mock-user-id",
    },
    email: "valid@email.mock",
  });
  vi.mocked(useAuthSession).mockResolvedValueOnce({
    update: updateSpy,
  } as any);
  vi.mocked(redirect).mockImplementationOnce(vi.fn((args) => args));

  await googleAuthCallback({
    request: new Request(
      "https://base-url.mock/api/auth/google/callback?code=mock_code",
    ),
  });

  expect(db.User.create).not.toHaveBeenCalled();
  expect(updateSpy).toHaveBeenCalledExactlyOnceWith({
    email: "valid@email.mock",
    userId: "mock-user-id",
  });
  expect(redirect).toHaveBeenCalledExactlyOnceWith({
    href: "https://base-url.mock",
  });
});

it("throws if access_token missing", async () => {
  vi.spyOn(global, "fetch").mockResolvedValueOnce({
    json: () => Promise.resolve({}),
  } as any);

  const res = googleAuthCallback({
    request: new Request(
      "https://base-url.mock/api/auth/google/callback?code=mock_code",
    ),
  });

  await expect(res).rejects.toThrow("No access token");
});

it("throws if email missing", async () => {
  vi.spyOn(global, "fetch")
    .mockImplementationOnce(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            access_token: "mock_access_token",
          }),
      } as any),
    )
    .mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({}),
      } as any),
    );

  const res = googleAuthCallback({
    request: new Request(
      "https://base-url.mock/api/auth/google/callback?code=mock_code",
    ),
  });

  await expect(res).rejects.toThrow("No email");
});
