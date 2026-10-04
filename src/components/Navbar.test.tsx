import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar";

import { Routes, Route, useSearchParams } from "react-router-dom";

/** Shows where the search form sent the visitor, and with what. */
function SearchProbe() {
  const [params] = useSearchParams();
  return <p>searched: {params.get("q")}</p>;
}

const renderNavbar = () =>
  render(
    <MemoryRouter>
      <Navbar />
      <Routes>
        <Route path="/search" element={<SearchProbe />} />
      </Routes>
    </MemoryRouter>
  );

describe("Navbar", () => {
  it("shows the logo as a link to the home page", () => {
    renderNavbar();
    expect(screen.getByRole("link", { name: "Encyclopedia Punkorum logo" })).toHaveAttribute("href", "/");
  });

  it("has a link to add a new band", () => {
    renderNavbar();
    expect(screen.getByRole("link", { name: "Submit new band" })).toHaveAttribute("href", "/addBand");
  });

  it("starts with the 'bands' search category", () => {
    renderNavbar();
    expect(screen.getByRole("combobox", { name: "Search category" })).toHaveValue("bands");
    expect(screen.getByLabelText("Search:")).toHaveAttribute("placeholder", "Select the bands");
  });

  it("updates the search placeholder when another category is selected", async () => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    const user = userEvent.setup();
    renderNavbar();

    await user.selectOptions(screen.getByRole("combobox", { name: "Search category" }), "genres");

    expect(screen.getByLabelText("Search:")).toHaveAttribute("placeholder", "Select the genres");
  });

  // The form used to call preventDefault() and stop there: typing a band name did
  // nothing at all.
  it("sends the typed term to the search page", async () => {
    const user = userEvent.setup();
    renderNavbar();

    await user.type(screen.getByLabelText("Search:"), "cro-mags");
    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(await screen.findByText("searched: cro-mags")).toBeInTheDocument();
  });

  it("works with the Enter key, not just the button", async () => {
    const user = userEvent.setup();
    renderNavbar();

    await user.type(screen.getByLabelText("Search:"), "crass{Enter}");

    expect(await screen.findByText("searched: crass")).toBeInTheDocument();
  });

  it("stays put when nothing was typed", async () => {
    const user = userEvent.setup();
    renderNavbar();

    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(screen.queryByText(/searched:/)).not.toBeInTheDocument();
  });

  it("ignores a term made of spaces", async () => {
    const user = userEvent.setup();
    renderNavbar();

    await user.type(screen.getByLabelText("Search:"), "   ");
    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(screen.queryByText(/searched:/)).not.toBeInTheDocument();
  });

  it.each([
    ["Help", "/help"],
    ["Rules", "/rules"],
    ["Store", "/store"],
    ["Forum", "/forum"],
  ])("links %s to %s", (label, path) => {
    renderNavbar();
    expect(screen.getByRole("link", { name: label })).toHaveAttribute("href", path);
  });
});
