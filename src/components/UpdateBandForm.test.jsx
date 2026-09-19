import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import UpdateBandForm from "./UpdateBandForm";
import { localBandsAPI } from "../services/api";
import { makeLocalBand, makeMusicBrainzBand } from "../test/fixtures";

vi.mock("../services/api", () => ({ localBandsAPI: { update: vi.fn() } }));

// Fake destination pages let us check where the form navigates
const renderForm = (bands, id, setBands = vi.fn()) =>
  render(
    <MemoryRouter initialEntries={[`/updateBand/${id}`]}>
      <Routes>
        <Route path="/updateBand/:updateId" element={<UpdateBandForm bands={bands} setBands={setBands} />} />
        <Route path="/bands" element={<p>Bands page</p>} />
        <Route path="/bands/:bandsId" element={<p>Details page</p>} />
      </Routes>
    </MemoryRouter>
  );

describe("UpdateBandForm", () => {
  it("shows 'Band not found' for an unknown id", () => {
    renderForm([makeLocalBand()], "unknown");
    expect(screen.getByText("Band not found")).toBeInTheDocument();
  });

  it("refuses to edit a MusicBrainz band and offers to go back", async () => {
    const user = userEvent.setup();
    renderForm([makeMusicBrainzBand()], "mb-1");

    expect(screen.getByRole("heading", { name: "Cannot Edit MusicBrainz Bands" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Back to Bands" }));
    expect(screen.getByText("Bands page")).toBeInTheDocument();
  });

  it("is pre-filled with the band data", () => {
    renderForm([makeLocalBand()], "local-1");
    expect(screen.getByLabelText("Band Name *")).toHaveValue("Sex Pistols");
    expect(screen.getByLabelText("Country")).toHaveValue("GB");
    expect(screen.getByLabelText("Status")).toHaveValue("Split-up");
    expect(screen.getByLabelText(/Genres/)).toHaveValue("punk rock, proto-punk");
    expect(screen.getByLabelText("Album title")).toHaveValue("Never Mind the Bollocks");
    expect(screen.getByLabelText("Member name")).toHaveValue("Johnny Rotten");
  });

  it("saves the changes, updates the state and goes to the band page", async () => {
    vi.spyOn(window, "alert").mockImplementation(() => {});
    localBandsAPI.update.mockResolvedValue({});
    const setBands = vi.fn();
    const band = makeLocalBand();
    const user = userEvent.setup();
    renderForm([band], "local-1", setBands);

    const nameInput = screen.getByLabelText("Band Name *");
    await user.clear(nameInput);
    await user.type(nameInput, "The Sex Pistols");
    await user.click(screen.getByRole("button", { name: "Update Band" }));

    expect(localBandsAPI.update).toHaveBeenCalledWith(
      "local-1",
      expect.objectContaining({ id: "local-1", name: "The Sex Pistols", source: "local" })
    );
    expect(await screen.findByText("Details page")).toBeInTheDocument();
    expect(window.alert).toHaveBeenCalledWith("The Sex Pistols has been updated!");
    // setBands receives an updater: only the edited band changes
    const other = makeLocalBand({ id: "local-2", name: "Crass" });
    const updated = setBands.mock.calls[0][0]([band, other]);
    expect(updated[0].name).toBe("The Sex Pistols");
    expect(updated[1]).toBe(other);
  });

  it("goes back to the band page on Cancel", async () => {
    const user = userEvent.setup();
    renderForm([makeLocalBand()], "local-1");

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(screen.getByText("Details page")).toBeInTheDocument();
    expect(localBandsAPI.update).not.toHaveBeenCalled();
  });
});
