import { describe, it, expect, vi, afterEach } from "vitest";
import { screen } from "@testing-library/react";
import { renderPage, expectShell } from "../test/renderPage";
import ForumPage from "./ForumPage";

// The real <AuthProvider> runs here: nothing about authentication is faked.
afterEach(() => vi.restoreAllMocks());

describe("ForumPage", () => {
  it("is titled and announces the forum as not built yet", () => {
    renderPage(<ForumPage />);

    expectShell();
    expect(screen.getByRole("heading", { level: 2, name: "Forum" })).toBeInTheDocument();
    expect(screen.getByText(/The forum is not available yet/)).toBeInTheDocument();
  });
});
