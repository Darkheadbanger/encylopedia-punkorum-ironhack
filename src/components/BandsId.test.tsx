import { axiosResponse } from "../test/fixtures";
import type { Band } from "../types";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import BandsId from "./BandsId";
import { APIFromMusicBrainz } from "../services/api";
import { makeLocalBand, makeMusicBrainzBand } from "../test/fixtures";

vi.mock("../services/api", () => ({ APIFromMusicBrainz: { getBandDetails: vi.fn() } }));

// BandsId reads :bandsId from the URL, so it needs a real route
const renderDetails = (bands: Band[], id: string) =>
  render(
    <MemoryRouter initialEntries={[`/bands/${id}`]}>
      <Routes>
        <Route path="/bands/:bandsId" element={<BandsId bands={bands} />} />
      </Routes>
    </MemoryRouter>
  );

// BandsId waits 1 second before calling MusicBrainz
const AFTER_API_CALL = { timeout: 3000 };

describe("BandsId — local band", () => {
  it("shows 'Band not found' for an unknown id", () => {
    renderDetails([makeLocalBand()], "unknown");
    expect(screen.getByText("Band not found")).toBeInTheDocument();
  });

  it("shows the band information", () => {
    renderDetails([makeLocalBand()], "local-1");
    expect(screen.getByRole("heading", { level: 2, name: "Sex Pistols" })).toBeInTheDocument();
    expect(screen.getByText("London")).toBeInTheDocument();
    expect(screen.getByText("1975 - 1978")).toBeInTheDocument();
    expect(screen.getByText("punk rock, proto-punk")).toBeInTheDocument();
    expect(screen.getByText("English punk rock band")).toBeInTheDocument();
  });

  it("shows the albums from db.json without calling MusicBrainz", () => {
    renderDetails([makeLocalBand()], "local-1");
    expect(screen.getByText("Never Mind the Bollocks")).toBeInTheDocument();
    expect(APIFromMusicBrainz.getBandDetails).not.toHaveBeenCalled();
  });

  it("shows the members once the Members tab is opened", async () => {
    const user = userEvent.setup();
    renderDetails([makeLocalBand()], "local-1");

    // Discography is the tab shown first
    expect(screen.queryByText("Johnny Rotten")).not.toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Members" }));

    expect(screen.getByText("Johnny Rotten")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Members" })).toHaveAttribute("aria-selected", "true");
  });

  it("lists the other bands under a musician's name", async () => {
    const user = userEvent.setup();
    const band = makeLocalBand({
      members: [
        { name: "Sid Vicious", instrument: "bass", period: "1977-1978", otherBands: ["Siouxsie and the Banshees", "The Flowers of Romance"] },
      ],
    });
    renderDetails([band], "local-1");

    await user.click(screen.getByRole("tab", { name: "Members" }));

    expect(
      screen.getByText("Also in: Siouxsie and the Banshees, The Flowers of Romance")
    ).toBeInTheDocument();
  });

  it("filters the discography by release type", async () => {
    const user = userEvent.setup();
    const band = makeLocalBand({
      albums: [
        { title: "Never Mind the Bollocks", year: "1977", type: "Full-length" },
        { title: "Live at Chelmsford", year: "1990", type: "Live album" },
        { title: "Spunk", year: "1977", type: "Demo" },
      ],
    });
    renderDetails([band], "local-1");

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
    renderDetails([makeLocalBand()], "local-1");

    await user.click(screen.getByRole("button", { name: "Demos" }));

    expect(screen.getByText("No releases in this category")).toBeInTheDocument();
  });

  it("truncates a long history behind a Read more button", async () => {
    const user = userEvent.setup();
    const description = `${"The Sex Pistols formed in London in 1975. ".repeat(19)}They split in 1978.`;
    renderDetails([makeLocalBand({ description })], "local-1");

    expect(screen.getByRole("heading", { name: "History" })).toBeInTheDocument();
    // Truncated: the last sentence is not shown yet
    expect(screen.queryByText(/They split in 1978\./)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Read more" }));

    expect(screen.getByRole("button", { name: "Read less" })).toBeInTheDocument();
    expect(screen.getByText(/They split in 1978\./)).toBeInTheDocument();
  });

  it("shows a short history without a Read more button", () => {
    renderDetails([makeLocalBand({ description: "A short history." })], "local-1");
    expect(screen.getByText("A short history.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Read more" })).not.toBeInTheDocument();
  });

  it("shows no History section when the band has no description", () => {
    renderDetails([makeLocalBand()], "local-1");
    expect(screen.queryByRole("heading", { name: "History" })).not.toBeInTheDocument();
  });

  it("shows the band photo", () => {
    renderDetails([makeLocalBand()], "local-1");
    expect(screen.getByAltText("Sex Pistols punk band")).toHaveAttribute("src", "https://example.com/pistols.jpg");
  });

  it("shows 'Photos coming soon' when there is no image", () => {
    renderDetails([makeLocalBand({ image: null })], "local-1");
    expect(screen.getByText("Photos coming soon")).toBeInTheDocument();
  });

  it("uses the local Misfits picture for the Misfits", () => {
    renderDetails([makeLocalBand({ name: "Misfits", image: null })], "local-1");
    expect(screen.getByAltText("Misfits punk band")).toBeInTheDocument();
  });
});

describe("BandsId — MusicBrainz band", () => {
  it("loads studio albums and members from MusicBrainz", async () => {
    vi.mocked(APIFromMusicBrainz.getBandDetails).mockResolvedValue(
      axiosResponse({
        relations: [
          { type: "member of band", artist: { name: "Joey Ramone" }, begin: "1974", end: "1996", attributes: ["lead vocals"] },
          { type: "producer", artist: { name: "Not A Member" } },
        ],
        "release-groups": [
          { id: "r1", title: "Leave Home", "primary-type": "Album", "secondary-types": [], "first-release-date": "1977-01-10" },
          { id: "r2", title: "It's Alive", "primary-type": "Album", "secondary-types": ["Live"] },
          { id: "r3", title: "Blitzkrieg Bop", "primary-type": "Single", "secondary-types": [] },
        ],
      }),
    );
    renderDetails([makeMusicBrainzBand()], "mb-1");

    expect(screen.getByText("Loading discography...")).toBeInTheDocument();
    expect(await screen.findByText("Leave Home", {}, AFTER_API_CALL)).toBeInTheDocument();

    expect(APIFromMusicBrainz.getBandDetails).toHaveBeenCalledWith("mb-1");
    // "Complete" now shows every release, like Encyclopaedia Metallum
    expect(screen.getByText("It's Alive")).toBeInTheDocument();
    expect(screen.getByText("Blitzkrieg Bop")).toBeInTheDocument();
    expect(screen.getByText("New York")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("maps MusicBrainz release types onto the discography categories", async () => {
    const user = userEvent.setup();
    vi.mocked(APIFromMusicBrainz.getBandDetails).mockResolvedValue(
      axiosResponse({
        "release-groups": [
          { id: "r1", title: "Leave Home", "primary-type": "Album", "secondary-types": [], "first-release-date": "1977-01-10" },
          { id: "r2", title: "It's Alive", "primary-type": "Album", "secondary-types": ["Live"] },
          { id: "r3", title: "Blitzkrieg Bop", "primary-type": "Single", "secondary-types": [] },
        ],
      }),
    );
    renderDetails([makeMusicBrainzBand()], "mb-1");
    await screen.findByText("Leave Home", {}, AFTER_API_CALL);

    // "Album" with no secondary type becomes "Full-length", so it lands in Main
    await user.click(screen.getByRole("button", { name: "Main" }));
    expect(screen.getByText("Leave Home")).toBeInTheDocument();
    expect(screen.queryByText("It's Alive")).not.toBeInTheDocument();

    // the secondary type "Live" wins over the primary type "Album"
    await user.click(screen.getByRole("button", { name: "Lives" }));
    expect(screen.getByText("It's Alive")).toBeInTheDocument();
    expect(screen.queryByText("Leave Home")).not.toBeInTheDocument();
  });

  it("only lists actual band members, not producers", async () => {
    const user = userEvent.setup();
    vi.mocked(APIFromMusicBrainz.getBandDetails).mockResolvedValue(
      axiosResponse({
        relations: [
          { type: "member of band", artist: { name: "Joey Ramone" }, begin: "1974", end: "1996", attributes: ["lead vocals"] },
          { type: "producer", artist: { name: "Not A Member" } },
        ],
      }),
    );
    renderDetails([makeMusicBrainzBand()], "mb-1");
    await screen.findByRole("tab", { name: "Members" });

    await user.click(screen.getByRole("tab", { name: "Members" }));

    expect(await screen.findByText("Joey Ramone", {}, AFTER_API_CALL)).toBeInTheDocument();
    expect(screen.queryByText("Not A Member")).not.toBeInTheDocument();
  });

  it("shows empty messages when the MusicBrainz call fails", async () => {
    const user = userEvent.setup();
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(APIFromMusicBrainz.getBandDetails).mockRejectedValue(new Error("Network error"));
    renderDetails([makeMusicBrainzBand()], "mb-1");

    expect(
      await screen.findByText("No releases in this category", {}, AFTER_API_CALL)
    ).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Members" }));
    expect(screen.getByText("No members information")).toBeInTheDocument();
  });
});
