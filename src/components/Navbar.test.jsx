import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar";

const renderNavbar = () =>
  render(
    <MemoryRouter>
      <Navbar />
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
});
