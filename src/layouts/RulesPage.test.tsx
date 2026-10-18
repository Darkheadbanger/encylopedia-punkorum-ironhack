import { describe, it, expect, vi, afterEach } from "vitest";
import { screen } from "@testing-library/react";
import { renderPage, expectShell } from "../test/renderPage";
import RulesPage from "./RulesPage";

// The real <AuthProvider> runs here: nothing about authentication is faked.
afterEach(() => vi.restoreAllMocks());

describe("RulesPage", () => {
  it("is titled and states why the rules are strict", () => {
    renderPage(<RulesPage />);

    expectShell();
    expect(screen.getByRole("heading", { level: 2, name: "Rules" })).toBeInTheDocument();
    expect(screen.getByText(/accepts everything documents nothing/i)).toBeInTheDocument();
  });

  // The whole point of the page: what is in scope and what is not. A rules page
  // that no longer says "rejected" is decoration.
  it("says what gets rejected", () => {
    renderPage(<RulesPage />);
    expect(screen.getByRole("heading", { name: /Rejected/i })).toBeInTheDocument();
  });

  it("ends on the way to contribute", () => {
    renderPage(<RulesPage />);
    expect(screen.getByRole("link", { name: "Submit a band" })).toHaveAttribute("href", "/addBand");
  });
});
