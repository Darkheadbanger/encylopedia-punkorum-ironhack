import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { expectShell } from "../test/renderPage";
import { makeBand } from "../test/fixtures";
import BandsIdPage from "./BandsIdPage";

// The real <AuthProvider> runs here: nothing about authentication is faked.
afterEach(() => vi.restoreAllMocks());

// This layout's child reads :bandsId, so the id has to come from a real route —
// which is why this file builds its own router instead of using renderPage().
// The real <AuthProvider> wraps it all the same.
const renderAt = (id: string) =>
  render(
    <MemoryRouter initialEntries={[`/bands/${id}`]}>
      <AuthProvider>
        <Routes>
          <Route
            path="/bands/:bandsId"
            element={<BandsIdPage bands={[makeBand()]} setBands={vi.fn()} />}
          />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );

describe("BandsIdPage", () => {
  it("shows the shell around the band details", () => {
    renderAt("band-1");

    expectShell();
    expect(screen.getByRole("heading", { level: 2, name: "Sex Pistols" })).toBeInTheDocument();
  });

  // The layout must keep working for an id that matches nothing: the message comes
  // from the child, the sidebar and navbar still come from here.
  it("keeps the shell when the band does not exist", () => {
    renderAt("nope");

    expectShell();
    expect(screen.getByText("Band not found")).toBeInTheDocument();
  });
});
