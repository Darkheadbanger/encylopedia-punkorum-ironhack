// main.tsx is the entry point: it runs on import and mounts the app into the
// div#root that index.html provides.
//
// This file used to replace react-dom/client with a stub and read the element
// tree handed to render() — asserting the SHAPE of what would have been mounted,
// without ever mounting it. Nothing proved the app could actually start.
//
// It mounts for real now. The backend is answered by MSW, so importing main is
// the same thing the browser does when it loads index.html.

import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";
import { act, screen, waitFor } from "@testing-library/react";
import { holds } from "./test/server";
import { makeBand } from "./test/fixtures";

/** Mounts the entry point exactly as the browser does, and hands back the root
 *  so it can be taken down again.
 *
 *  Unmounting matters: Testing Library's cleanup() only knows about roots IT
 *  created, so three tests importing main used to leave three live roots behind,
 *  each with its own effects and its own in-flight GET /bands — all still in the
 *  document that screen queries. */
const mountEntryPoint = async () => {
  const { root } = await import("./main");
  return root;
};

let root: Awaited<ReturnType<typeof mountEntryPoint>> | null = null;

beforeEach(() => {
  document.body.innerHTML = '<div id="root"></div>';
  holds([makeBand()]);

  // main.tsx does its work on import, and an import is cached: without this the
  // second test would import nothing and mount nothing at all.
  vi.resetModules();
});

afterEach(async () => {
  if (root) await act(async () => root!.unmount());
  root = null;
});

describe("main", () => {
  it("mounts the app into #root", async () => {
    root = await mountEntryPoint();

    // The shell is what every page of the site shares: if this is on screen, the
    // app started, the router resolved a route, and a page rendered.
    expect(await screen.findByRole("link", { name: "Encyclopedia Punkorum logo" }))
      .toBeInTheDocument();
    expect(document.getElementById("root")).not.toBeEmptyDOMElement();
  });

  // A missing <Router> would break every <Link> in the site at once — and react
  // -router throws rather than rendering, so this test fails loudly either way.
  it("wraps the app in a router, so its links are real links", async () => {
    root = await mountEntryPoint();

    await waitFor(() =>
      expect(screen.getByRole("link", { name: "Help" })).toHaveAttribute("href", "/help")
    );
  });

  // The bands come from our API, not from a second source: the page counts what
  // the server sent.
  it("shows the app with the bands the server holds", async () => {
    root = await mountEntryPoint();

    expect(
      await screen.findByText("There are currently 1 bands in Encyclopaedia Punkorum.")
    ).toBeInTheDocument();
  });
});
