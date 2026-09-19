import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import { getAllBands } from "./services/api.js";
import { makeLocalBand, makeMusicBrainzBand } from "./test/fixtures";

vi.mock("./services/api.js", () => ({ getAllBands: vi.fn() }));

const renderApp = () =>
  render(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>
  );

describe("App", () => {
  it("shows a loading message while the bands are fetched", () => {
    getAllBands.mockReturnValue(new Promise(() => {})); // never resolves
    renderApp();
    expect(screen.getByText("Loading Encyclopedia Punkorum...")).toBeInTheDocument();
  });

  it("shows the home page with the number of bands once loaded", async () => {
    getAllBands.mockResolvedValue([makeLocalBand(), makeMusicBrainzBand()]);
    renderApp();
    expect(
      await screen.findByText("There are currently 2 bands in Encyclopaedia Punkorum.")
    ).toBeInTheDocument();
  });

  it("still shows the app (with 0 bands) when loading fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    getAllBands.mockRejectedValue(new Error("Network error"));
    renderApp();
    expect(
      await screen.findByText("There are currently 0 bands in Encyclopaedia Punkorum.")
    ).toBeInTheDocument();
  });
});
