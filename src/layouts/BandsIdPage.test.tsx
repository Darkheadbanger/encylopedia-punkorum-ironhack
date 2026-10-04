import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import { session, expectShell } from "../test/renderPage";
import { makeBand } from "../test/fixtures";
import BandsIdPage from "./BandsIdPage";

vi.mock("../context/AuthContext", () => ({
  AuthProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
  useAuth: vi.fn(),
}));

beforeEach(() => vi.mocked(useAuth).mockReturnValue(session() as never));

// This layout's child reads :bandsId, so the id has to come from a real route.
const renderAt = (id: string) =>
  render(
    <MemoryRouter initialEntries={[`/bands/${id}`]}>
      <Routes>
        <Route
          path="/bands/:bandsId"
          element={<BandsIdPage bands={[makeBand()]} setBands={vi.fn()} />}
        />
      </Routes>
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
