import { redirect } from "@tanstack/react-router";
import { expect, it, vi } from "vitest";
import { googleAuthCallback } from "./googleAuthCallback";
import { useAuthSession } from "./useAuthSession";
import { db } from "@/prisma/db";

vi.mock("@tanstack/react-router");

vi.mock("./useAuthSession");

vi.mock("@/prisma/db", () => {
  return {
    db: {
      user: {
        create: vi.fn(),
        findUnique: vi.fn(),
      },
    },
  };
});

const mockAccessToken = "mock.access.token";
const mockHref = "https://base-url.mock";
const mockUrl = `${mockHref}/api/auth/google/callback`;
const mockUrlWithCode = `${mockUrl}?code=mock_code`;
const mockUser = {
  email: "mock@email.test",
  id: "mockuserid",
};

it("throws redirect if no code", async () => {
  vi.mocked(redirect).mockImplementationOnce(vi.fn((args) => args));

  const res = googleAuthCallback({
    request: new Request(mockUrl),
  });

  await expect(res).rejects.toEqual({
    href: mockHref,
  });
  expect(redirect).toHaveBeenCalledExactlyOnceWith({
    href: mockHref,
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
            access_token: mockAccessToken,
          }),
      } as any),
    )
    .mockImplementationOnce(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            email: mockUser.email,
          }),
      } as any),
    );

  vi.mocked(db.user.findUnique).mockResolvedValueOnce(null);
  vi.mocked(db.user.create).mockResolvedValueOnce(mockUser);

  vi.mocked(useAuthSession).mockResolvedValueOnce({
    clear: vi.fn(),
    data: {},
    id: undefined,
    update: updateSpy,
  });
  vi.mocked(redirect).mockImplementationOnce(vi.fn((args) => args));

  await googleAuthCallback({
    request: new Request(mockUrlWithCode),
  });

  expect(fetchSpy).toHaveBeenCalledTimes(2);
  expect(db.user.findUnique).toHaveBeenCalledExactlyOnceWith({
    select: {
      id: true,
    },
    where: {
      email: mockUser.email,
    },
  });
  expect(db.user.create).toHaveBeenCalledExactlyOnceWith({
    data: {
      email: mockUser.email,
    },
    select: {
      id: true,
    },
  });
  expect(updateSpy).toHaveBeenCalledExactlyOnceWith(mockUser);
  expect(redirect).toHaveBeenCalledExactlyOnceWith({
    href: mockHref,
  });
});

it("uses existing user if found", async () => {
  const updateSpy = vi.fn();

  vi.spyOn(global, "fetch")
    .mockImplementationOnce(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            access_token: mockAccessToken,
          }),
      } as any),
    )
    .mockImplementationOnce(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            email: mockUser.email,
          }),
      } as any),
    );

  vi.mocked(db.user.findUnique).mockResolvedValueOnce(mockUser);
  vi.mocked(useAuthSession).mockResolvedValueOnce({
    update: updateSpy,
  } as any);
  vi.mocked(redirect).mockImplementationOnce(vi.fn((args) => args));

  await googleAuthCallback({
    request: new Request(mockUrlWithCode),
  });

  expect(db.user.create).not.toHaveBeenCalled();
  expect(updateSpy).toHaveBeenCalledExactlyOnceWith(mockUser);
  expect(redirect).toHaveBeenCalledExactlyOnceWith({
    href: mockHref,
  });
});

it("throws if access_token missing", async () => {
  vi.spyOn(global, "fetch").mockResolvedValueOnce({
    json: () => Promise.resolve({}),
  } as any);

  const res = googleAuthCallback({
    request: new Request(mockUrlWithCode),
  });

  await expect(res).rejects.toThrow("No access token");
});

it("throws if email missing", async () => {
  vi.spyOn(global, "fetch")
    .mockImplementationOnce(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            access_token: mockAccessToken,
          }),
      } as any),
    )
    .mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({}),
      } as any),
    );

  const res = googleAuthCallback({
    request: new Request(mockUrlWithCode),
  });

  await expect(res).rejects.toThrow("No email");
});
