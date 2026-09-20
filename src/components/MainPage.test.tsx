import type { Band } from "../types";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MainPage from "./MainPage";
import { makeLocalBand, makeMusicBrainzBand } from "../test/fixtures";

const renderMainPage = (bands: Band[]) =>
  render(
    <MemoryRouter>
      <MainPage bands={bands} />
    </MemoryRouter>
  );

describe("MainPage", () => {
  it("shows how many bands are in the encyclopedia", () => {
    renderMainPage([makeLocalBand(), makeMusicBrainzBand()]);
    expect(screen.getByText("There are currently 2 bands in Encyclopaedia Punkorum.")).toBeInTheDocument();
  });

  it("has a 'Bands' link to the bands list and a 'Genres' button", () => {
    renderMainPage([]);
    expect(screen.getByRole("link", { name: "Bands" })).toHaveAttribute("href", "/bands");
    expect(screen.getByRole("button", { name: "Genres" })).toBeInTheDocument();
  });
});
