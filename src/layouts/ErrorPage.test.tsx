import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import { renderPage, session, expectShell } from "../test/renderPage";
import ErrorPage from "./ErrorPage";

vi.mock("../context/AuthContext", () => ({
  AuthProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
  useAuth: vi.fn(),
}));

beforeEach(() => vi.mocked(useAuth).mockReturnValue(session() as never));

describe("ErrorPage layout", () => {
  // The layout and the component it renders are both called ErrorPage. If the
  // import alias in the layout were dropped, this test would blow the stack
  // instead of rendering — which is exactly what it is here to catch.
  it("renders the not-found component, not itself", () => {
    renderPage(<ErrorPage />);

    expectShell();
    expect(screen.getByText("404")).toBeInTheDocument();
  });

  it("offers a way back to the site", () => {
    renderPage(<ErrorPage />);
    expect(screen.getByRole("link", { name: /home|bands/i })).toBeInTheDocument();
  });
});
