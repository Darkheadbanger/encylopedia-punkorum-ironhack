import { describe, it, expect, vi, afterEach } from "vitest";
import { screen } from "@testing-library/react";
import { renderPage, expectShell } from "../test/renderPage";
import { makeBand } from "../test/fixtures";
import HomePage from "./HomePage";

// The real <AuthProvider> runs here: nothing about authentication is faked.
afterEach(() => vi.restoreAllMocks());

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
