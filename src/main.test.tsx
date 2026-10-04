// main.tsx is the entry point: it runs on import and mounts the app. The test is
// therefore about what it mounts into, and what it wraps the app in — a missing
// <Router> here would break every <Link> in the site at once.

import { describe, it, expect, vi, beforeEach } from "vitest";
import { createRoot } from "react-dom/client";
import { isValidElement } from "react";
import type { ReactElement } from "react";

const render = vi.fn();

vi.mock("react-dom/client", () => ({
  createRoot: vi.fn(() => ({ render, unmount: vi.fn() })),
}));

// App fetches the bands on mount; it is never actually rendered here.
vi.mock("./App", () => ({ default: () => null }));

/** The names of the components wrapping the app, outermost first. */
const wrappers = (element: ReactElement): string[] => {
  const child = (element.props as { children?: unknown }).children;
  const type = element.type as { name?: string; displayName?: string } | symbol;
  const name = typeof type === "symbol"
    ? "StrictMode"
    : type.name ?? type.displayName ?? "unknown";

  return isValidElement(child) ? [name, ...wrappers(child)] : [name];
};

beforeEach(() => {
  document.body.innerHTML = '<div id="root"></div>';
  vi.clearAllMocks();
  // main.tsx does its work on import, and an import is cached: without this the
  // second test would import nothing and see no render call at all.
  vi.resetModules();
});

describe("main", () => {
  it("mounts into #root and renders once", async () => {
    await import("./main");

    expect(createRoot).toHaveBeenCalledWith(document.getElementById("root"));
    expect(render).toHaveBeenCalledOnce();
  });

  it("wraps the app in StrictMode and a Router", async () => {
    await import("./main");

    const tree = render.mock.calls[0][0] as ReactElement;
    expect(wrappers(tree)).toEqual(["StrictMode", "BrowserRouter", "default"]);
  });
});
