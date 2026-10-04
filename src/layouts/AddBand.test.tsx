import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import { renderPage, session, expectShell } from "../test/renderPage";
import AddBand from "./AddBand";

vi.mock("../context/AuthContext", () => ({
  AuthProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
  useAuth: vi.fn(),
}));

// The form itself is covered by AddBandForm.test.tsx; it is mocked here so this
// test fails for one reason only — the layout.
vi.mock("../components/AddBandForm", () => ({
  default: ({ setBands }: { setBands: unknown }) => (
    <p>add form, setBands: {typeof setBands}</p>
  ),
}));

beforeEach(() => vi.mocked(useAuth).mockReturnValue(session(true) as never));

describe("AddBand", () => {
  it("shows the shell around the creation form", () => {
    renderPage(<AddBand setBands={vi.fn()} />);

    expectShell({ loggedIn: true });
    expect(screen.getByText(/add form/)).toBeInTheDocument();
  });

  // Without it the form could not add the new band to the list, and the table
  // would only catch up on a page reload.
  it("hands setBands down to the form", () => {
    renderPage(<AddBand setBands={vi.fn()} />);
    expect(screen.getByText("add form, setBands: function")).toBeInTheDocument();
  });
});
