import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
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

  // They used to look like links and do nothing when clicked. An entry that
  // leads nowhere is no longer a link at all: it is greyed out, and its title
  // says why on hover rather than leaving the visitor to guess.
  it.each(["Alphabetical", "Country", "Genre", "Random Band", "Random Album"])(
    "%s is not offered as a link",
    (label) => {
      renderSidebar();
      expect(screen.queryByRole("link", { name: label })).not.toBeInTheDocument();
    }
  );

  it("says why on hover, in the browser's own tooltip", () => {
    renderSidebar();
    expect(screen.getByText("Random Band")).toHaveAttribute("title", "Coming soon");
    expect(screen.getAllByTitle("Coming soon")).toHaveLength(7);
  });
});
