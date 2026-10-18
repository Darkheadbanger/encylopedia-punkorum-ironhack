import { describe, it, expect, vi, afterEach } from "vitest";
import { screen } from "@testing-library/react";
import { renderPage, expectShell } from "../test/renderPage";
import StorePage from "./StorePage";

// The real <AuthProvider> runs here: nothing about authentication is faked.
afterEach(() => vi.restoreAllMocks());

describe("StorePage", () => {
  it("is titled and announces the store as not built yet", () => {
    renderPage(<StorePage />);

    expectShell();
    expect(screen.getByRole("heading", { level: 2, name: "Store" })).toBeInTheDocument();
    expect(screen.getByText(/The store is not available yet/)).toBeInTheDocument();
  });
});
