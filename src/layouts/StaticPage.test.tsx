// StaticPage is the shell the four side pages share. It is the one layout worth
// testing on its own: if it stops rendering its children, Help, Rules, Store and
// Forum all go blank at once.

import { describe, it, expect, vi, afterEach } from "vitest";
import { screen } from "@testing-library/react";
import { renderPage, expectShell, whenSignedIn } from "../test/renderPage";
import StaticPage from "./StaticPage";

// The real <AuthProvider> runs here: being logged in means a token the server
// accepts, exactly as in the browser.
afterEach(() => vi.restoreAllMocks());

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

  it("shows the logout button instead of the form once logged in", async () => {
    renderPage(<StaticPage title="Help">content</StaticPage>, "/", { loggedIn: true });

    await whenSignedIn();
    expectShell({ loggedIn: true });
  });
});
