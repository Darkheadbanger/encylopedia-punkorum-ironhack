import { axiosResponse } from "../test/fixtures";
import type { Band, SetBands } from "../types";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import { session } from "../test/renderPage";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import BandsId from "./BandsId";
import { bandsAPI } from "../services/api";
import { makeBand, makeIngestedBand } from "../test/fixtures";

vi.mock("../services/api", () => ({ bandsAPI: { delete: vi.fn() } }));

vi.mock("../context/AuthContext", () => ({
  AuthProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
  useAuth: vi.fn(),
}));

// Logged in unless a test says otherwise: the actions are what this file is about.
beforeEach(() => vi.mocked(useAuth).mockReturnValue(session(true) as never));

// BandsId reads :bandsId from the URL, so it needs a real route. /bands is declared
// too, so the redirect after a deletion can be observed.
const renderDetails = (bands: Band[], id: string, setBands: SetBands = vi.fn()) =>
  render(
    <MemoryRouter initialEntries={[`/bands/${id}`]}>
      <Routes>
        <Route path="/bands/:bandsId" element={<BandsId bands={bands} setBands={setBands} />} />
        <Route path="/bands" element={<p>Bands list</p>} />
      </Routes>
    </MemoryRouter>
  );

describe("BandsId", () => {
  it("shows 'Band not found' for an unknown id", () => {
    renderDetails([makeBand()], "unknown");
    expect(screen.getByText("Band not found")).toBeInTheDocument();
  });

  it("shows the band information", () => {
    renderDetails([makeBand()], "band-1");
    expect(screen.getByRole("heading", { level: 2, name: "Sex Pistols" })).toBeInTheDocument();
    expect(screen.getByText("London")).toBeInTheDocument();
    expect(screen.getByText("1975 - 1978")).toBeInTheDocument();
    expect(screen.getByText("punk rock, proto-punk")).toBeInTheDocument();
    expect(screen.getByText("English punk rock band")).toBeInTheDocument();
  });

  it("shows the albums straight from the band, with nothing to fetch", () => {
    renderDetails([makeBand()], "band-1");
    expect(screen.getByText("Never Mind the Bollocks")).toBeInTheDocument();
  });

  it("shows the members once the Members tab is opened", async () => {
    const user = userEvent.setup();
    renderDetails([makeBand()], "band-1");

    // Discography is the tab shown first
    expect(screen.queryByText("Johnny Rotten")).not.toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Members" }));

    expect(screen.getByText("Johnny Rotten")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Members" })).toHaveAttribute("aria-selected", "true");
  });

  it("lists the other bands under a musician's name", async () => {
    const user = userEvent.setup();
    const band = makeBand({
      members: [
        { name: "Sid Vicious", instrument: "bass", period: "1977-1978", otherBands: ["Siouxsie and the Banshees", "The Flowers of Romance"] },
      ],
    });
    renderDetails([band], "band-1");

    await user.click(screen.getByRole("tab", { name: "Members" }));

    expect(
      screen.getByText("Also in: Siouxsie and the Banshees, The Flowers of Romance")
    ).toBeInTheDocument();
  });

  it("filters the discography by release type", async () => {
    const user = userEvent.setup();
    const band = makeBand({
      albums: [
        { title: "Never Mind the Bollocks", year: "1977", type: "Full-length" },
        { title: "Live at Chelmsford", year: "1990", type: "Live album" },
        { title: "Spunk", year: "1977", type: "Demo" },
      ],
    });
    renderDetails([band], "band-1");

    // "Complete" shows everything
    expect(screen.getByText("Never Mind the Bollocks")).toBeInTheDocument();
    expect(screen.getByText("Live at Chelmsford")).toBeInTheDocument();
    expect(screen.getByText("Spunk")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Lives" }));

    expect(screen.getByText("Live at Chelmsford")).toBeInTheDocument();
    expect(screen.queryByText("Never Mind the Bollocks")).not.toBeInTheDocument();
    expect(screen.queryByText("Spunk")).not.toBeInTheDocument();
  });

  it("says so when a category has no release", async () => {
    const user = userEvent.setup();
    renderDetails([makeBand()], "band-1");

    await user.click(screen.getByRole("button", { name: "Demos" }));

    expect(screen.getByText("No releases in this category")).toBeInTheDocument();
  });

  it("truncates a long history behind a Read more button", async () => {
    const user = userEvent.setup();
    const description = `${"The Sex Pistols formed in London in 1975. ".repeat(19)}They split in 1978.`;
    renderDetails([makeBand({ description })], "band-1");

    expect(screen.getByRole("heading", { name: "History" })).toBeInTheDocument();
    // Truncated: the last sentence is not shown yet
    expect(screen.queryByText(/They split in 1978\./)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Read more" }));

    expect(screen.getByRole("button", { name: "Read less" })).toBeInTheDocument();
    expect(screen.getByText(/They split in 1978\./)).toBeInTheDocument();
  });

  it("shows a short history without a Read more button", () => {
    renderDetails([makeBand({ description: "A short history." })], "band-1");
    expect(screen.getByText("A short history.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Read more" })).not.toBeInTheDocument();
  });

  it("shows no History section when the band has no description", () => {
    renderDetails([makeBand()], "band-1");
    expect(screen.queryByRole("heading", { name: "History" })).not.toBeInTheDocument();
  });

  it("shows the band photo", () => {
    renderDetails([makeBand()], "band-1");
    expect(screen.getByAltText("Sex Pistols punk band")).toHaveAttribute("src", "https://example.com/pistols.jpg");
  });

  it("shows 'Photos coming soon' when there is no image", () => {
    renderDetails([makeBand({ image: null })], "band-1");
    expect(screen.getByText("Photos coming soon")).toBeInTheDocument();
  });

  it("uses the local Misfits picture for the Misfits", () => {
    renderDetails([makeBand({ name: "Misfits", image: null })], "band-1");
    expect(screen.getByAltText("Misfits punk band")).toBeInTheDocument();
  });
});

// The edit and delete controls used to sit in every row of the bands table. They
// now live here, where there is room to label them.
describe("BandsId — editing and deleting", () => {
  it("links to the update form", () => {
    renderDetails([makeBand()], "band-1");
    expect(screen.getByRole("link", { name: "Edit this band" }))
      .toHaveAttribute("href", "/updateBand/band-1");
  });

  it("deletes the band, drops it from the list and goes back to /bands", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    vi.mocked(bandsAPI.delete).mockResolvedValue(axiosResponse(undefined));
    const setBands = vi.fn();
    const band = makeBand();
    const user = userEvent.setup();
    renderDetails([band], "band-1", setBands);

    await user.click(screen.getByRole("button", { name: "Delete this band" }));

    expect(bandsAPI.delete).toHaveBeenCalledWith("band-1");
    await waitFor(() => expect(setBands).toHaveBeenCalled());
    // setBands receives an updater function: check it removes only this band
    const other = makeBand({ id: "band-2", name: "Crass" });
    const updater = setBands.mock.calls[0][0];
    expect(updater([band, other])).toEqual([other]);

    expect(await screen.findByText("Bands list")).toBeInTheDocument();
  });

  it("does nothing when the deletion is cancelled", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);
    const user = userEvent.setup();
    renderDetails([makeBand()], "band-1");

    await user.click(screen.getByRole("button", { name: "Delete this band" }));

    expect(bandsAPI.delete).not.toHaveBeenCalled();
    expect(screen.queryByText("Bands list")).not.toBeInTheDocument();
  });

  it("keeps the band and says so when the server refuses the deletion", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(bandsAPI.delete).mockRejectedValue(new Error("401"));
    const setBands = vi.fn();
    const user = userEvent.setup();
    renderDetails([makeBand()], "band-1", setBands);

    await user.click(screen.getByRole("button", { name: "Delete this band" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/could not be deleted/i);
    expect(setBands).not.toHaveBeenCalled();
    expect(screen.queryByText("Bands list")).not.toBeInTheDocument();
  });
});


// What used to be a second, read-only rendering path. An ingested band now goes
// through exactly the same code as a hand-written one — it only carries a credit.
describe("BandsId — an ingested band", () => {
  it("can be edited and deleted like any other", () => {
    renderDetails([makeIngestedBand()], "band-2");

    expect(screen.getByRole("link", { name: "Edit this band" }))
      .toHaveAttribute("href", "/updateBand/band-2");
    expect(screen.getByRole("button", { name: "Delete this band" })).toBeInTheDocument();
  });

  it("credits MusicBrainz and links back to the source", () => {
    renderDetails([makeIngestedBand()], "band-2");

    const credit = screen.getByRole("link", { name: "MusicBrainz" });
    expect(credit).toHaveAttribute(
      "href",
      "https://musicbrainz.org/artist/7a2e6b55-f149-4e74-be6a-30a1b1a3e5ae"
    );
    expect(credit).toHaveAttribute("target", "_blank");
  });

  it("shows no credit on a band someone typed in", () => {
    renderDetails([makeBand()], "band-1");
    expect(screen.queryByRole("link", { name: "MusicBrainz" })).not.toBeInTheDocument();
  });

  it("shows its discography with no loading step: it is already in our database", () => {
    const band = makeIngestedBand({
      albums: [{ title: "The Age of Quarrel", year: "1986", type: "Full-length" }],
    });
    renderDetails([band], "band-2");

    expect(screen.getByText("The Age of Quarrel")).toBeInTheDocument();
    expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
  });
});

// The API answers 401 to a write without a token, so showing the buttons to a
// visitor would only offer an action that cannot work.
describe("BandsId — actions require an account", () => {
  it("hides Edit and Delete from a visitor who is not logged in", () => {
    vi.mocked(useAuth).mockReturnValue(session(false) as never);
    renderDetails([makeBand()], "band-1");

    expect(screen.queryByRole("link", { name: "Edit this band" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Delete this band" })).not.toBeInTheDocument();
  });

  it("says why, and offers the way in", () => {
    vi.mocked(useAuth).mockReturnValue(session(false) as never);
    renderDetails([makeBand()], "band-1");

    // The sentence is split by the link, so the two halves are checked apart
    expect(screen.getByText(/to edit or delete this band/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Log in" })).toHaveAttribute("href", "/signup");
  });

  it("shows both once logged in", () => {
    renderDetails([makeBand()], "band-1");

    expect(screen.getByRole("link", { name: "Edit this band" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete this band" })).toBeInTheDocument();
    expect(screen.queryByText(/to edit or delete this band/i)).not.toBeInTheDocument();
  });

  // The band itself must still be readable: an encyclopedia is for consulting.
  it("still shows everything else to a visitor", () => {
    vi.mocked(useAuth).mockReturnValue(session(false) as never);
    renderDetails([makeBand()], "band-1");

    expect(screen.getByRole("heading", { level: 2, name: "Sex Pistols" })).toBeInTheDocument();
    expect(screen.getByText("Never Mind the Bollocks")).toBeInTheDocument();
  });
});

// The Cover Art Archive answers 404 when it holds no sleeve for a release, and the
// 54 hand-written bands have no picture at all. Neither case may show a broken
// image icon.
describe("BandsId — artwork", () => {
  it("shows the picture when there is one", () => {
    renderDetails([makeBand()], "band-1");
    expect(screen.getByAltText("Sex Pistols punk band"))
      .toHaveAttribute("src", "https://example.com/pistols.jpg");
  });

  it("replaces a picture that fails to load with the placeholder", () => {
    renderDetails([makeBand({ image: "https://coverartarchive.org/release-group/none/front-500" })], "band-1");

    fireEvent.error(screen.getByAltText("Sex Pistols punk band"));

    expect(screen.queryByAltText("Sex Pistols punk band")).not.toBeInTheDocument();
    expect(screen.getByText("Photos coming soon")).toBeInTheDocument();
  });

  it("credits the Cover Art Archive when the picture comes from there", () => {
    renderDetails([makeIngestedBand({ image: "https://coverartarchive.org/release-group/rg-1/front-500" })], "band-2");

    expect(screen.getByText(/cover art archive/i)).toBeInTheDocument();
  });

  it("adds no credit for a picture someone pasted in by hand", () => {
    renderDetails([makeBand()], "band-1");
    expect(screen.queryByText(/cover art archive/i)).not.toBeInTheDocument();
  });
});
