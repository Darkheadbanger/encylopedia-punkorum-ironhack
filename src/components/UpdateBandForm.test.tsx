import { axiosResponse } from "../test/fixtures";
import type { Band, SetBands } from "../types";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import UpdateBandForm from "./UpdateBandForm";
import { bandsAPI } from "../services/api";
import { makeBand, makeIngestedBand } from "../test/fixtures";

vi.mock("../services/api", () => ({ bandsAPI: { update: vi.fn() } }));

// Fake destination pages let us check where the form navigates
const renderForm = (bands: Band[], id: string, setBands: SetBands = vi.fn()) =>
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
    renderForm([makeBand()], "unknown");
    expect(screen.getByText("Band not found")).toBeInTheDocument();
  });

  // This used to refuse the edit. An ingested band lives in our database, so the
  // form fills in with its data like any other.
  it("edits an ingested band like any other", () => {
    renderForm([makeIngestedBand()], "band-2");

    expect(screen.getByRole("heading", { name: "Edit Band: Cro-Mags" })).toBeInTheDocument();
    expect(screen.getByLabelText(/Band Name/i)).toHaveValue("Cro-Mags");
  });

  // Regression test: typing in the form used to mutate the objects held by the
  // `bands` state, so edits survived Cancel. The form must never touch them.
  it("does not modify the band in the bands state while typing", async () => {
    const user = userEvent.setup();
    const band = makeBand();
    renderForm([band], "band-1");

    await user.clear(screen.getByLabelText("Album title"));
    await user.type(screen.getByLabelText("Album title"), "Hacked");
    await user.clear(screen.getByLabelText("Member name"));
    await user.type(screen.getByLabelText("Member name"), "Hacked");

    expect(band.albums![0].title).toBe("Never Mind the Bollocks");
    expect(band.members![0].name).toBe("Johnny Rotten");
  });

  it("is pre-filled with the band data", () => {
    renderForm([makeBand()], "band-1");
    expect(screen.getByLabelText("Band Name *")).toHaveValue("Sex Pistols");
    expect(screen.getByLabelText("Country")).toHaveValue("GB");
    expect(screen.getByLabelText("Status")).toHaveValue("Split-up");
    expect(screen.getByLabelText(/Genres/)).toHaveValue("punk rock, proto-punk");
    expect(screen.getByLabelText("Album title")).toHaveValue("Never Mind the Bollocks");
    expect(screen.getByLabelText("Member name")).toHaveValue("Johnny Rotten");
  });

  it("saves the changes, updates the state and goes to the band page", async () => {
    const band = makeBand();
    // The server answers with the band it stored — that is what must land in the state
    vi.mocked(bandsAPI.update).mockResolvedValue(
      axiosResponse({ ...band, name: "The Sex Pistols" }),
    );
    const setBands = vi.fn();
    const user = userEvent.setup();
    renderForm([band], "band-1", setBands);

    const nameInput = screen.getByLabelText("Band Name *");
    await user.clear(nameInput);
    await user.type(nameInput, "The Sex Pistols");
    await user.click(screen.getByRole("button", { name: "Update Band" }));

    expect(bandsAPI.update).toHaveBeenCalledWith(
      "band-1",
      expect.objectContaining({ name: "The Sex Pistols" })
    );
    // The id goes in the URL, and the provenance stays the server's business
    expect(bandsAPI.update).toHaveBeenCalledWith(
      "band-1",
      expect.not.objectContaining({ id: expect.anything(), source: expect.anything() })
    );
    expect(await screen.findByText("Details page")).toBeInTheDocument();
    // setBands receives an updater: only the edited band changes
    const other = makeBand({ id: "band-2", name: "Crass" });
    const updated = setBands.mock.calls[0][0]([band, other]);
    expect(updated[0].name).toBe("The Sex Pistols");
    expect(updated[1]).toBe(other);
  });

  it("goes back to the band page on Cancel", async () => {
    const user = userEvent.setup();
    renderForm([makeBand()], "band-1");

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(screen.getByText("Details page")).toBeInTheDocument();
    expect(bandsAPI.update).not.toHaveBeenCalled();
  });
});
