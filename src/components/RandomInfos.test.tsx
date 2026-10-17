import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RandomInfos from "./RandomInfos";

// A Router is needed now: the Reviews links are real ones. The rest of the
// sidebar is still a promise, and says so by calling preventDefault.
const renderSidebar = () =>
  render(
    <MemoryRouter>
      <RandomInfos />
    </MemoryRouter>
  );

describe("RandomInfos", () => {
  it("shows the 4 sections", () => {
    renderSidebar();
    for (const title of ["Bands", "Labels", "Reviews", "Random"]) {
      expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
    }
  });

  it("sends Latest and Top Rated to the reviews page", () => {
    renderSidebar();
    expect(screen.getByRole("link", { name: "Latest" })).toHaveAttribute("href", "/reviews");
    expect(screen.getByRole("link", { name: "Top Rated" }))
      .toHaveAttribute("href", "/reviews?sort=rating");
  });

  it("the other links are still placeholders: clicking them does not navigate", () => {
    renderSidebar();
    // fireEvent returns false when the click handler called preventDefault()
    const notPrevented = fireEvent.click(screen.getByRole("link", { name: "Random Band" }));
    expect(notPrevented).toBe(false);
  });
});
