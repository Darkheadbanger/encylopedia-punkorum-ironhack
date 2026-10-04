// StaticPage is the shell the four side pages share. It is the one layout worth
// testing on its own: if it stops rendering its children, Help, Rules, Store and
// Forum all go blank at once.

import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import { renderPage, session, expectShell } from "../test/renderPage";
import StaticPage from "./StaticPage";

vi.mock("../context/AuthContext", () => ({
  AuthProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
  useAuth: vi.fn(),
}));

beforeEach(() => vi.mocked(useAuth).mockReturnValue(session() as never));

describe("StaticPage", () => {
  it("shows the title as a heading and renders its children", () => {
    renderPage(
      <StaticPage title="Rules">
        <p>No metal.</p>
      </StaticPage>
    );

    expect(screen.getByRole("heading", { level: 2, name: "Rules" })).toBeInTheDocument();
    expect(screen.getByText("No metal.")).toBeInTheDocument();
  });

  it("wraps the content in the site shell", () => {
    renderPage(<StaticPage title="Help">content</StaticPage>);
    expectShell();
  });

  it("shows the logout button instead of the form once logged in", () => {
    vi.mocked(useAuth).mockReturnValue(session(true) as never);
    renderPage(<StaticPage title="Help">content</StaticPage>);
    expectShell({ loggedIn: true });
  });
});
