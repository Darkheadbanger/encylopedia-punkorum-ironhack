import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import { renderPage, session, expectShell } from "../test/renderPage";
import HelpPage from "./HelpPage";

vi.mock("../context/AuthContext", () => ({
  AuthProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
  useAuth: vi.fn(),
}));

beforeEach(() => vi.mocked(useAuth).mockReturnValue(session() as never));

describe("HelpPage", () => {
  it("is titled and introduces the page", () => {
    renderPage(<HelpPage />);

    expectShell();
    expect(screen.getByRole("heading", { level: 2, name: "Help" })).toBeInTheDocument();
    expect(screen.getByText(/browse and contribute/i)).toBeInTheDocument();
  });

  // This page used to explain why half the bands could not be edited. They all can
  // now, so what it must explain instead is where a band came from — and that
  // nothing is read from MusicBrainz while browsing.
  it("explains where the bands come from and that they are all editable", () => {
    renderPage(<HelpPage />);

    expect(screen.getByRole("heading", { name: /Where do the bands come from/i })).toBeInTheDocument();
    expect(screen.getByText(/every one of them can be/i)).toBeInTheDocument();
    expect(screen.getByText(/nothing is read from MusicBrainz while you/i)).toBeInTheDocument();
  });

  it("says how to import a band, and that it needs an account", () => {
    renderPage(<HelpPage />);

    expect(screen.getByRole("heading", { name: /How do I import a band/i })).toBeInTheDocument();
    expect(screen.getByText(/You need an account to import/i)).toBeInTheDocument();
  });

  it("links to the rest of the site", () => {
    renderPage(<HelpPage />);
    expect(screen.getAllByRole("link").length).toBeGreaterThan(1);
  });
});
