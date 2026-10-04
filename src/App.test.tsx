import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import { getAllBands } from "./services/api";
import { makeBand, makeIngestedBand } from "./test/fixtures";

vi.mock("./services/api.js", () => ({
  getAllBands: vi.fn(),
  // AuthProvider imports this from the same module
  authAPI: { login: vi.fn(), signup: vi.fn(), verify: vi.fn() },
}));

const renderApp = () =>
  render(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>
  );

describe("App", () => {
  it("shows a loading message while the bands are fetched", () => {
    vi.mocked(getAllBands).mockReturnValue(new Promise(() => {})); // never resolves
    renderApp();
    expect(screen.getByText("Loading Encyclopedia Punkorum...")).toBeInTheDocument();
  });

  it("shows the home page with the number of bands once loaded", async () => {
    vi.mocked(getAllBands).mockResolvedValue([makeBand(), makeIngestedBand()]);
    renderApp();
    expect(
      await screen.findByText("There are currently 2 bands in Encyclopaedia Punkorum.")
    ).toBeInTheDocument();
  });

  // There is no second source to warn about any more: MusicBrainz is ingested by
  // the backend, so a band is either in our database or nowhere.
  it("never warns about MusicBrainz: nothing is read from it at display time", async () => {
    vi.mocked(getAllBands).mockResolvedValue([makeIngestedBand()]);
    renderApp();

    await screen.findByText("There are currently 1 bands in Encyclopaedia Punkorum.");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("still shows the app (with 0 bands) when loading fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(getAllBands).mockRejectedValue(new Error("Network error"));
    // (the local server is down: the app still renders, with a message)
    renderApp();
    expect(
      await screen.findByText("There are currently 0 bands in Encyclopaedia Punkorum.")
    ).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(/Could not load the bands/);
  });
});
