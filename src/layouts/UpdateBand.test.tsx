import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import { renderPage, session, expectShell } from "../test/renderPage";
import { makeBand } from "../test/fixtures";
import UpdateBand from "./UpdateBand";

vi.mock("../context/AuthContext", () => ({
  AuthProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
  useAuth: vi.fn(),
}));

// UpdateBandForm has its own test file; mocked here so this one only checks that
// the layout passes both props through.
vi.mock("../components/UpdateBandForm", () => ({
  default: ({ bands, setBands }: { bands: { name: string }[]; setBands: unknown }) => (
    <p>update form, {bands.length} band(s), setBands: {typeof setBands}</p>
  ),
}));

beforeEach(() => vi.mocked(useAuth).mockReturnValue(session(true) as never));

describe("UpdateBand", () => {
  it("shows the shell around the update form", () => {
    renderPage(<UpdateBand bands={[makeBand()]} setBands={vi.fn()} />);

    expectShell({ loggedIn: true });
    expect(screen.getByText(/update form/)).toBeInTheDocument();
  });

  // The form finds the band to edit in this list: an empty one means a blank form.
  it("hands the bands and setBands down to the form", () => {
    renderPage(<UpdateBand bands={[makeBand()]} setBands={vi.fn()} />);
    expect(screen.getByText("update form, 1 band(s), setBands: function")).toBeInTheDocument();
  });
});
