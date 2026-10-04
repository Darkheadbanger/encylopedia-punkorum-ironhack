import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider, useAuth } from "./AuthContext";
import { authAPI } from "../services/api";

vi.mock("../services/api", () => ({
  authAPI: {
    login: vi.fn(),
    signup: vi.fn(),
    verify: vi.fn(),
  },
}));

const joey = { id: "507f1f77bcf86cd799439011", email: "joey@ramones.com", username: "joey" };

// A window on the context, so the tests read what a real component would read.
function Probe() {
  const { user, isLoggedIn, isLoading, login, logout } = useAuth();
  if (isLoading) return <p>loading</p>;
  return (
    <>
      <p data-testid="state">{isLoggedIn ? `in:${user?.username}` : "out"}</p>
      {/* login() rejects on bad credentials — the real form catches it to show the
          message, so the probe must catch it too, or Vitest reports an unhandled
          rejection and the whole run exits non-zero. */}
      <button onClick={() => login("joey@ramones.com", "hey-ho-lets-go").catch(() => {})}>
        log in
      </button>
      <button onClick={logout}>log out</button>
    </>
  );
}

const renderProbe = () =>
  render(
    <AuthProvider>
      <Probe />
    </AuthProvider>
  );

beforeEach(() => {
  localStorage.clear();
});

describe("AuthContext", () => {
  it("starts logged out when no token is stored", async () => {
    renderProbe();
    expect(await screen.findByTestId("state")).toHaveTextContent("out");
    // Nothing stored means nothing to verify: no pointless call to the server
    expect(authAPI.verify).not.toHaveBeenCalled();
  });

  it("stores the token and exposes the user after a successful login", async () => {
    vi.mocked(authAPI.login).mockResolvedValue({ data: { authToken: "a-token" } } as never);
    vi.mocked(authAPI.verify).mockResolvedValue({ data: joey } as never);
    renderProbe();

    await userEvent.click(await screen.findByRole("button", { name: "log in" }));

    await waitFor(() => expect(screen.getByTestId("state")).toHaveTextContent("in:joey"));
    expect(localStorage.getItem("authToken")).toBe("a-token");
  });

  it("stays logged out and keeps no token when login fails", async () => {
    vi.mocked(authAPI.login).mockRejectedValue(new Error("401"));
    renderProbe();

    await userEvent.click(await screen.findByRole("button", { name: "log in" }));

    await waitFor(() => expect(screen.getByTestId("state")).toHaveTextContent("out"));
    expect(localStorage.getItem("authToken")).toBeNull();
  });

  it("drops the token and the user on logout", async () => {
    vi.mocked(authAPI.login).mockResolvedValue({ data: { authToken: "a-token" } } as never);
    vi.mocked(authAPI.verify).mockResolvedValue({ data: joey } as never);
    renderProbe();

    await userEvent.click(await screen.findByRole("button", { name: "log in" }));
    await waitFor(() => expect(screen.getByTestId("state")).toHaveTextContent("in:joey"));

    await userEvent.click(screen.getByRole("button", { name: "log out" }));

    expect(screen.getByTestId("state")).toHaveTextContent("out");
    expect(localStorage.getItem("authToken")).toBeNull();
  });

  it("restores the session from a stored token", async () => {
    localStorage.setItem("authToken", "a-token");
    vi.mocked(authAPI.verify).mockResolvedValue({ data: joey } as never);

    renderProbe();

    await waitFor(() => expect(screen.getByTestId("state")).toHaveTextContent("in:joey"));
  });

  it("discards a stored token the server refuses", async () => {
    localStorage.setItem("authToken", "expired-or-forged");
    vi.mocked(authAPI.verify).mockRejectedValue(new Error("401"));

    renderProbe();

    await waitFor(() => expect(screen.getByTestId("state")).toHaveTextContent("out"));
    // A token the server rejects is worthless: it must not survive the check
    expect(localStorage.getItem("authToken")).toBeNull();
  });
});
