import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import AddBandForm from "./AddBandForm";
import { localBandsAPI } from "../services/api";

vi.mock("../services/api", () => ({ localBandsAPI: { create: vi.fn() } }));
vi.mock("uuid", () => ({ v4: () => "test-id" })); // predictable id

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
    vi.spyOn(window, "alert").mockImplementation(() => {});
    localBandsAPI.create.mockResolvedValue({});
    const setBands = vi.fn();
    const user = userEvent.setup();
    renderForm(setBands);

    await user.type(screen.getByLabelText("Band Name *"), "Crass");
    await user.type(screen.getByLabelText("Country"), "GB");
    await user.type(screen.getByLabelText(/Genres/), "anarcho-punk,hardcore");
    await user.type(screen.getByLabelText("Album title"), "The Feeding of the 5000");
    await user.click(screen.getByRole("button", { name: "Create Band" }));

    expect(localBandsAPI.create).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "test-id",
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
    expect(window.alert).toHaveBeenCalledWith("Crass has been added!");
    // setBands receives an updater: the new band goes first
    const updater = setBands.mock.calls[0][0];
    expect(updater([{ id: "old" }])[0]).toMatchObject({ id: "test-id", name: "Crass" });
  });

  it("refuses to submit without a band name", () => {
    vi.spyOn(window, "alert").mockImplementation(() => {});
    renderForm();

    // fireEvent.submit skips the browser's "required" check, so we reach our own check
    fireEvent.submit(screen.getByRole("button", { name: "Create Band" }).closest("form"));

    expect(window.alert).toHaveBeenCalledWith("You must enter the band name!");
    expect(localBandsAPI.create).not.toHaveBeenCalled();
  });

  it("shows an error message when the API fails", async () => {
    vi.spyOn(window, "alert").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    localBandsAPI.create.mockRejectedValue(new Error("Server down"));
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText("Band Name *"), "Crass");
    await user.click(screen.getByRole("button", { name: "Create Band" }));

    await waitFor(() =>
      expect(window.alert).toHaveBeenCalledWith("There is something wrong when you created a band. Try again!")
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
