import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import BandsList from "./BandsList";
import { localBandsAPI } from "../services/api";
import { makeLocalBand, makeMusicBrainzBand } from "../test/fixtures";

vi.mock("../services/api", () => ({ localBandsAPI: { delete: vi.fn() } }));

// BandsList renders a <tr>, so it must live inside a real table
const renderRow = (band, setBands = vi.fn()) =>
  render(
    <MemoryRouter>
      <table>
        <tbody>
          <BandsList band={band} setBands={setBands} />
        </tbody>
      </table>
    </MemoryRouter>
  );

describe("BandsList — local band", () => {
  it("shows name (link to details), country, genres and status", () => {
    renderRow(makeLocalBand());
    expect(screen.getByRole("link", { name: "Sex Pistols" })).toHaveAttribute("href", "/bands/local-1");
    expect(screen.getByText("GB")).toBeInTheDocument();
    expect(screen.getByText("punk rock proto-punk")).toBeInTheDocument();
    expect(screen.getByText("Split-up")).toHaveClass("not-active");
  });

  it("uses the 'still-active' class for an active band", () => {
    renderRow(makeLocalBand({ status: "Active" }));
    expect(screen.getByText("Active")).toHaveClass("still-active");
  });

  it("shows the edit link and the delete button", () => {
    renderRow(makeLocalBand());
    expect(screen.getByRole("link", { name: "Edit Sex Pistols" })).toHaveAttribute("href", "/updateBand/local-1");
    expect(screen.getByRole("button", { name: "Delete Sex Pistols" })).toBeInTheDocument();
  });

  it("deletes the band after confirmation and removes it from the state", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    localBandsAPI.delete.mockResolvedValue({});
    const setBands = vi.fn();
    const band = makeLocalBand();
    const user = userEvent.setup();
    renderRow(band, setBands);

    await user.click(screen.getByRole("button", { name: "Delete Sex Pistols" }));

    expect(localBandsAPI.delete).toHaveBeenCalledWith("local-1");
    await waitFor(() => expect(setBands).toHaveBeenCalled());
    // setBands receives an updater function: check it removes only this band
    const other = makeLocalBand({ id: "local-2", name: "Crass" });
    const updater = setBands.mock.calls[0][0];
    expect(updater([band, other])).toEqual([other]);
  });

  it("does nothing when the deletion is cancelled", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);
    const user = userEvent.setup();
    renderRow(makeLocalBand());

    await user.click(screen.getByRole("button", { name: "Delete Sex Pistols" }));

    expect(localBandsAPI.delete).not.toHaveBeenCalled();
  });
});

describe("BandsList — MusicBrainz band", () => {
  it("keeps only the punk-related tags as genres", () => {
    renderRow(makeMusicBrainzBand());
    expect(screen.getByText("punk hardcore punk")).toBeInTheDocument();
  });

  it("is 'Still Active' when the life-span has not ended", () => {
    renderRow(makeMusicBrainzBand());
    expect(screen.getByText("Still Active")).toHaveClass("still-active");
  });

  it("is 'Split-up' when the life-span has ended", () => {
    renderRow(makeMusicBrainzBand({ "life-span": { begin: "1974", ended: true } }));
    expect(screen.getByText("Split-up")).toHaveClass("not-active");
  });

  it("shows N/A when there is no country", () => {
    renderRow(makeMusicBrainzBand({ country: undefined }));
    expect(screen.getByText("N/A")).toBeInTheDocument();
  });

  it("cannot be edited or deleted", () => {
    renderRow(makeMusicBrainzBand());
    expect(screen.queryByRole("link", { name: /Edit/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Delete/ })).not.toBeInTheDocument();
  });
});
