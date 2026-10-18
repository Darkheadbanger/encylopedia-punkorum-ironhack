// Shared scaffolding for the layout and component tests.
//
// Every layout renders the same shell — login panel, browse panel, logo, navbar —
// around one page. Repeating that setup in twelve files would hide what each test
// actually checks.
//
// These tests used to replace AuthContext wholesale:
//
//     vi.mock("../context/AuthContext", () => ({ useAuth: vi.fn() }))
//
// which meant the real provider — storing the token, asking the server to validate
// it, deriving isLoggedIn, throwing a bad token away — was never exercised by the
// pages that depend on it. renderPage mounts the REAL <AuthProvider> instead. The
// only thing still faked is the one HTTP call it makes on mount, and that goes
// away when the suite moves to intercepting HTTP itself.

import type { ReactElement, ReactNode } from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
// `expect` is not global in this project (no `globals: true`), so a helper that
// asserts must import it like any test file.
import { expect } from "vitest";
import { AuthProvider } from "../context/AuthContext";
import { http, HttpResponse } from "msw";
import { API, server } from "./server";
import type { AuthUser } from "../types";

const TOKEN_KEY = "authToken"; // must match AuthContext

/** Set when a test signs in, and cleared when it signs out. settleAuth() waits
 *  on it rather than on a fixed number of microtasks. */
const current = { verified: false, expected: false };

/** The member every logged-in test is signed in as. */
export const MEMBER: AuthUser = { id: "1", email: "joey@ramones.com", username: "joey" };

/** Puts a real session in place, or clears it.
 *
 *  A logged-in visitor is one with a token the server recognises — so that is
 *  exactly what this sets up: the token in localStorage, and /auth/verify
 *  answering with the member. The provider does the rest for real. */
export const signedIn = (loggedIn: boolean) => {
  current.verified = false;
  current.expected = loggedIn;

  if (!loggedIn) {
    localStorage.removeItem(TOKEN_KEY);
    return;
  }
  localStorage.setItem(TOKEN_KEY, "a-token-the-server-accepts");
  // The handler reports that the provider really asked and was really answered,
  // which is what settleAuth() waits on.
  server.use(
    http.get(`${API}/auth/verify`, () => {
      current.verified = true;
      return HttpResponse.json(MEMBER);
    })
  );
};

// A function, not a component: this file exports helpers, and react-refresh asks
// a file to export one or the other. Nothing here is ever hot-reloaded anyway.
const wrap = (children: ReactNode, path: string) => (
  <MemoryRouter initialEntries={[path]}>
    <AuthProvider>{children}</AuthProvider>
  </MemoryRouter>
);

/** The layouts use <Link>, <Navbar> and useAuth(), so they need a router and the
 *  real provider. `loggedIn` decides which session is in place first. */
export const renderPage = (
  ui: ReactElement,
  path = "/",
  { loggedIn = false }: { loggedIn?: boolean } = {},
) => {
  signedIn(loggedIn);
  return render(wrap(ui, path));
};

/** Waits for the provider to finish checking the stored token, by waiting for the
 *  shell to show the logged-in state. For pages that render the login panel. */
export const whenSignedIn = () =>
  waitFor(() => expect(screen.getByRole("button", { name: "Logout" })).toBeInTheDocument());

/** The same wait, for a component rendered without the shell: there is no Logout
 *  button to look for.
 *
 *  Needed because the real provider only knows who you are once the server has
 *  answered — one tick after mount. The mocked hook used to be logged in from the
 *  very first render, which is not how the browser behaves either.
 *
 *  waitFor and not a bare act(): act() only drains microtasks, so it settled the
 *  session purely because the /auth/verify handler happened to be synchronous.
 *  The day one is stubbed with a delay, every test gated on this would quietly
 *  assert against the logged-out UI — and the negative ones would still pass. */
export const settleAuth = async () => {
  if (current.expected) await waitFor(() => expect(current.verified).toBe(true));
  // One more flush, so React has applied the state the answer produced.
  await act(async () => {});
};

/** The parts of the page that come from the layout itself, not from the route. */
export const expectShell = ({ loggedIn = false } = {}) => {
  expect(screen.getByRole("button", { name: loggedIn ? "Logout" : "Login" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Random" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Encyclopedia Punkorum logo" })).toBeInTheDocument();
  expect(screen.getByLabelText("Search:")).toBeInTheDocument();
};
