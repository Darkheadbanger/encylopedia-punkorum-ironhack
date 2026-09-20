import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import { getAllBands } from "./services/api";
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
    vi.mocked(getAllBands).mockReturnValue(new Promise(() => {})); // never resolves
    renderApp();
    expect(screen.getByText("Loading Encyclopedia Punkorum...")).toBeInTheDocument();
  });

  it("shows the home page with the number of bands once loaded", async () => {
    vi.mocked(getAllBands).mockResolvedValue({
      bands: [makeLocalBand(), makeMusicBrainzBand()],
      musicBrainzFailed: false,
    });
    renderApp();
    expect(
      await screen.findByText("There are currently 2 bands in Encyclopaedia Punkorum.")
    ).toBeInTheDocument();
  });

  it("warns when MusicBrainz is unavailable but still shows the local bands", async () => {
    vi.mocked(getAllBands).mockResolvedValue({
      bands: [makeLocalBand()],
      musicBrainzFailed: true,
    });
    renderApp();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "MusicBrainz is unavailable"
    );
    expect(
      screen.getByText("There are currently 1 bands in Encyclopaedia Punkorum.")
    ).toBeInTheDocument();
  });

  it("still shows the app (with 0 bands) when loading fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(getAllBands).mockRejectedValue(new Error("Network error"));
    // (the local server is down: the app still renders, with a message)
    renderApp();
    expect(
      await screen.findByText("There are currently 0 bands in Encyclopaedia Punkorum.")
    ).toBeInTheDocument();
  });
});
