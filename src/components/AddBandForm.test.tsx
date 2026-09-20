import { axiosResponse, makeLocalBand } from "../test/fixtures";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import AddBandForm from "./AddBandForm";
import { localBandsAPI } from "../services/api";

vi.mock("../services/api", () => ({ localBandsAPI: { create: vi.fn() } }));

// A fake /bands page lets us check where the form navigates
const renderForm = (setBands = vi.fn()) =>
  render(
    <MemoryRouter initialEntries={["/addBand"]}>
      <Routes>
        <Route path="/addBand" element={<AddBandForm setBands={setBands} />} />
        <Route path="/bands" element={<p>Bands page</p>} />
      </Routes>
    </MemoryRouter>
  );

describe("AddBandForm", () => {
  it("creates the band, adds it to the state and goes to /bands", async () => {
    // The server answers with the band it stored — that is what must land in the state
    vi.mocked(localBandsAPI.create).mockResolvedValue(
      axiosResponse(makeLocalBand({ id: "server-id", name: "Crass", country: "GB" })),
    );
    const setBands = vi.fn();
    const user = userEvent.setup();
    renderForm(setBands);

    await user.type(screen.getByLabelText("Band Name *"), "Crass");
    await user.type(screen.getByLabelText("Country"), "GB");
    await user.type(screen.getByLabelText(/Genres/), "anarcho-punk,hardcore");
    await user.type(screen.getByLabelText("Album title"), "The Feeding of the 5000");
    await user.click(screen.getByRole("button", { name: "Create Band" }));

    // No id is sent: the server generates it
    expect(localBandsAPI.create).toHaveBeenCalledWith(
      expect.not.objectContaining({ id: expect.anything() })
    );
    expect(localBandsAPI.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Crass",
        country: "GB",
        status: "Active",
        genre: ["anarcho-punk", "hardcore"],
        disbanded: null,
        albums: [{ title: "The Feeding of the 5000", year: "", type: "Album" }],
        members: [], // empty member rows are removed
        source: "local",
        editable: true,
      })
    );
    expect(await screen.findByText("Bands page")).toBeInTheDocument();
    // setBands receives an updater: the band the SERVER returned goes first
    const updater = setBands.mock.calls[0][0];
    expect(updater([{ id: "old" }])[0]).toMatchObject({ id: "server-id", name: "Crass" });
  });

  it("refuses to submit without a band name", () => {
    renderForm();

    // fireEvent.submit skips the browser's "required" check, so we reach our own check
    fireEvent.submit(screen.getByRole("button", { name: "Create Band" }).closest("form")!);

    expect(screen.getByRole("alert")).toHaveTextContent("You must enter the band name!");
    expect(localBandsAPI.create).not.toHaveBeenCalled();
  });

  it("shows an error message when the API fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(localBandsAPI.create).mockRejectedValue(new Error("Server down"));
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText("Band Name *"), "Crass");
    await user.click(screen.getByRole("button", { name: "Create Band" }));

    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent("Could not save the band.")
    );
    expect(screen.queryByText("Bands page")).not.toBeInTheDocument();
  });

  it("adds and removes album rows (at least one row stays)", async () => {
    const user = userEvent.setup();
    renderForm();

    expect(screen.getByRole("button", { name: "Remove album" })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "+ Add Album" }));
    expect(screen.getAllByLabelText("Album title")).toHaveLength(2);

    await user.click(screen.getAllByRole("button", { name: "Remove album" })[1]);
    expect(screen.getAllByLabelText("Album title")).toHaveLength(1);
  });

  it("adds member rows", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole("button", { name: "+ Add Member" }));

    expect(screen.getAllByLabelText("Member name")).toHaveLength(2);
  });

  it("goes back to /bands on Cancel", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(screen.getByText("Bands page")).toBeInTheDocument();
  });
});
