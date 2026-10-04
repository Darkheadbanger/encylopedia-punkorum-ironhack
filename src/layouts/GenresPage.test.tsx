import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import { renderPage, session, expectShell } from "../test/renderPage";
import GenresPage from "./GenresPage";

vi.mock("../context/AuthContext", () => ({
  AuthProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
  useAuth: vi.fn(),
}));

beforeEach(() => vi.mocked(useAuth).mockReturnValue(session() as never));

describe("GenresPage", () => {
  it("titles the page and shows the taxonomy", () => {
    renderPage(<GenresPage />);

    expectShell();
    expect(screen.getByRole("heading", { level: 2, name: "Punk Genres" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Roots & Proto-Punk" })).toBeInTheDocument();
  });

  // The page states where the data comes from. Removing that note would make the
  // site claim the genres are part of the database.
  it("keeps the honesty note about hard-coded data", () => {
    renderPage(<GenresPage />);
    expect(screen.getByRole("note")).toHaveTextContent(/hard-coded/i);
  });

  it("offers the filter, without which the page is a wall of text", () => {
    renderPage(<GenresPage />);
    expect(screen.getByLabelText("Filter genres")).toBeInTheDocument();
  });
});
