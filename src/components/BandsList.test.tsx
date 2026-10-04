import type { Band } from "../types";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import BandsList from "./BandsList";
import { makeBand, makeIngestedBand } from "../test/fixtures";

// BandsList renders a <tr>, so it must live inside a real table
const renderRow = (band: Band) =>
  render(
    <MemoryRouter>
      <table>
        <tbody>
          <BandsList band={band} />
        </tbody>
      </table>
    </MemoryRouter>
  );

describe("BandsList", () => {
  it("shows name (link to details), country, genres and status", () => {
    renderRow(makeBand());
    expect(screen.getByRole("link", { name: "Sex Pistols" })).toHaveAttribute("href", "/bands/band-1");
    expect(screen.getByText("GB")).toBeInTheDocument();
    // Separated, or multi-word genres run together: "punk rock New York Punk"
    expect(screen.getByText("punk rock · proto-punk")).toBeInTheDocument();
    expect(screen.getByText("Split-up")).toHaveClass("not-active");
  });

  it("uses the 'still-active' class for an active band", () => {
    renderRow(makeBand({ status: "Active" }));
    expect(screen.getByText("Active")).toHaveClass("still-active");
  });

  // Editing and deleting now live on the band's own page: a row of tiny icons
  // repeated 54 times was unreadable, and the row is only a summary.
  it("carries no edit or delete control", () => {
    renderRow(makeBand());
    expect(screen.queryByRole("link", { name: /Edit/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});

// An ingested band is read exactly like a hand-written one: same shape, same row,
// no second branch. That is the point of ingesting instead of displaying.
describe("BandsList — an ingested band is just a band", () => {
  it("renders it the same way, with no special case", () => {
    renderRow(makeIngestedBand({ genre: ["hardcore punk"], status: "Active" }));

    expect(screen.getByRole("link", { name: "Cro-Mags" })).toHaveAttribute("href", "/bands/band-2");
    expect(screen.getByText("hardcore punk")).toBeInTheDocument();
    expect(screen.getByText("Active")).toHaveClass("still-active");
  });

  it("shows N/A for the fields MusicBrainz left empty", () => {
    renderRow(makeIngestedBand({ country: "", genre: [], status: "" }));

    expect(screen.getAllByText("N/A")).toHaveLength(3);
  });
});
