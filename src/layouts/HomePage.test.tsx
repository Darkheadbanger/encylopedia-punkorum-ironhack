import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import { renderPage, session, expectShell } from "../test/renderPage";
import { makeBand } from "../test/fixtures";
import HomePage from "./HomePage";

vi.mock("../context/AuthContext", () => ({
  AuthProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
  useAuth: vi.fn(),
}));

beforeEach(() => vi.mocked(useAuth).mockReturnValue(session() as never));

describe("HomePage", () => {
  it("shows the shell and the two entry points", () => {
    renderPage(<HomePage bands={[makeBand()]} />);

    expectShell();
    expect(screen.getByRole("link", { name: "Bands" })).toHaveAttribute("href", "/bands");
    expect(screen.getByRole("link", { name: "Genres" })).toHaveAttribute("href", "/genres");
  });

  it("passes the bands down, so the count is the real one", () => {
    renderPage(<HomePage bands={[makeBand(), makeBand({ id: "band-2" })]} />);
    expect(screen.getByText(/currently 2 bands/)).toBeInTheDocument();
  });

  it("says zero rather than nothing when there is no band", () => {
    renderPage(<HomePage bands={[]} />);
    expect(screen.getByText(/currently 0 bands/)).toBeInTheDocument();
  });
});
