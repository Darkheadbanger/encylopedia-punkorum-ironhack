import { describe, it, expect, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import { holds, isDown, server, API } from "./test/server";
import { http } from "msw";
import { makeBand, makeIngestedBand } from "./test/fixtures";

const renderApp = () =>
  render(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>
  );

describe("App", () => {
  it("shows a loading message while the bands are fetched", () => {
    // The server takes its time: that is what "loading" really is.
    server.use(http.get(`${API}/bands`, () => new Promise(() => {})));
    renderApp();
    expect(screen.getByText("Loading Encyclopedia Punkorum...")).toBeInTheDocument();
  });

  it("shows the home page with the number of bands once loaded", async () => {
    holds([makeBand(), makeIngestedBand()]);
    renderApp();
    expect(
      await screen.findByText("There are currently 2 bands in Encyclopaedia Punkorum.")
    ).toBeInTheDocument();
  });

  // There is no second source to warn about any more: MusicBrainz is ingested by
  // the backend, so a band is either in our database or nowhere.
  it("never warns about MusicBrainz: nothing is read from it at display time", async () => {
    holds([makeIngestedBand()]);
    renderApp();

    await screen.findByText("There are currently 1 bands in Encyclopaedia Punkorum.");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("still shows the app (with 0 bands) when loading fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    isDown("get", "/bands"); // the server is not answering at all
    // (the local server is down: the app still renders, with a message)
    renderApp();
    expect(
      await screen.findByText("There are currently 0 bands in Encyclopaedia Punkorum.")
    ).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(/Could not load the bands/);
  });
});

// Measured at 59 s before the first useful pixel on a cold visit: the API sleeps
// on Render's free plan and the whole site waits behind it. Nothing here makes
// the server faster — it stops the silence, so nobody concludes the site is dead.
describe("App — while the server wakes up", () => {
  it("explains the wait instead of leaving a bare spinner", async () => {
    vi.useFakeTimers();
    server.use(http.get(`${API}/bands`, () => new Promise(() => {})));
    renderApp();

    expect(screen.getByText("Loading Encyclopedia Punkorum...")).toBeInTheDocument();
    expect(screen.queryByText(/waking up/i)).not.toBeInTheDocument();

    await act(async () => { vi.advanceTimersByTime(5000); });
    expect(screen.getByText(/waking up/i)).toBeInTheDocument();

    await act(async () => { vi.advanceTimersByTime(12000); });
    expect(screen.getByText(/up to a minute/i)).toBeInTheDocument();

    vi.useRealTimers();
  });
});
