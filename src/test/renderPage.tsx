// Shared scaffolding for the layout tests.
//
// Every layout renders the same shell — login panel, browse panel, logo, navbar —
// around one page. Repeating that setup in twelve files would hide what each test
// actually checks.

import type { ReactElement } from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
// `expect` is not global in this project (no `globals: true`), so a helper that
// asserts must import it like any test file.
import { expect, vi } from "vitest";

/** The layouts use <Link> and <Navbar>, so they need a router. */
export const renderPage = (ui: ReactElement, path = "/") =>
  render(<MemoryRouter initialEntries={[path]}>{ui}</MemoryRouter>);

/** What a mocked useAuth() returns. */
export const session = (isLoggedIn = false) => ({
  user: isLoggedIn ? { id: "1", email: "joey@ramones.com", username: "joey" } : null,
  isLoggedIn,
  isLoading: false,
  login: vi.fn(),
  signup: vi.fn(),
  logout: vi.fn(),
});

/** The parts of the page that come from the layout itself, not from the route. */
export const expectShell = ({ loggedIn = false } = {}) => {
  expect(screen.getByRole("button", { name: loggedIn ? "Logout" : "Login" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Random" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Encyclopedia Punkorum logo" })).toBeInTheDocument();
  expect(screen.getByLabelText("Search:")).toBeInTheDocument();
};
